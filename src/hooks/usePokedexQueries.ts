import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, UserPokemonCard } from '@/lib/supabase';
import { PokemonCard } from '@/types/pokemon';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

// Clés de requête
export const pokedexKeys = {
    all: ['pokedex'] as const,
    userCards: (userId: string) => [...pokedexKeys.all, 'userCards', userId] as const,
    userCard: (userId: string, cardId: string) => [...pokedexKeys.all, 'userCard', userId, cardId] as const,
};

// Hook pour récupérer les cartes de l'utilisateur
export const useUserCards = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: pokedexKeys.userCards(user?.id || ''),
        queryFn: async (): Promise<UserPokemonCard[]> => {
            if (!user) {
                throw new Error('Utilisateur non connecté');
            }

            console.log('🔍 Récupération des cartes pour l\'utilisateur:', user.id);

            const { data, error } = await supabase
                .from('user_pokemon_cards')
                .select('*')
                .eq('user_id', user.id)
                .order('added_at', { ascending: false });

            if (error) {
                console.error('❌ Erreur Supabase:', error);
                throw new Error(`Erreur lors de la récupération des cartes: ${error.message}`);
            }

            console.log('✅ Cartes récupérées:', data?.length || 0);
            return data || [];
        },
        enabled: !!user, // Ne lance la requête que si l'utilisateur est connecté
        staleTime: 2 * 60 * 1000, // 2 minutes pour les données du pokédex
    });
};

// Hook pour ajouter une carte au pokédex
export const useAddCardToPokedex = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            card,
            quantity = 1,
            notes = ''
        }: {
            card: PokemonCard;
            quantity?: number;
            notes?: string;
        }) => {
            if (!user) {
                throw new Error('Utilisateur non connecté');
            }

            // Vérifier si la carte existe déjà
            const existingCards = queryClient.getQueryData<UserPokemonCard[]>(
                pokedexKeys.userCards(user.id)
            ) || [];

            const existingCard = existingCards.find((c) => c.card_id === card.id);

            if (existingCard) {
                // Mettre à jour la quantité
                const { error } = await supabase
                    .from('user_pokemon_cards')
                    .update({
                        quantity: existingCard.quantity + quantity,
                        notes: notes || existingCard.notes,
                    })
                    .eq('id', existingCard.id);

                if (error) throw error;

                return { ...existingCard, quantity: existingCard.quantity + quantity, notes: notes || existingCard.notes };
            } else {
                // Ajouter nouvelle carte
                const imageUrl = card.image || null;

                const newCard: Omit<UserPokemonCard, 'id' | 'added_at'> = {
                    user_id: user.id,
                    card_id: card.id,
                    card_name: card.name,
                    card_image_url: imageUrl,
                    card_set: card.set?.name,
                    card_rarity: card.rarity,
                    card_type: card.types?.[0],
                    hp: card.hp ? parseInt(card.hp) : undefined,
                    market_price: card.marketPrices?.market,
                    quantity,
                    notes,
                };

                const { data, error } = await supabase
                    .from('user_pokemon_cards')
                    .insert([newCard])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            }
        },
        onSuccess: (data, variables) => {
            // Mettre à jour le cache
            queryClient.setQueryData<UserPokemonCard[]>(
                pokedexKeys.userCards(user!.id),
                (old = []) => {
                    const existingIndex = old.findIndex(c => c.card_id === variables.card.id);
                    if (existingIndex >= 0) {
                        // Mettre à jour la carte existante
                        const updated = [...old];
                        updated[existingIndex] = data;
                        return updated;
                    } else {
                        // Ajouter la nouvelle carte au début
                        return [data, ...old];
                    }
                }
            );

            toast({
                title: 'Carte ajoutée',
                description: `${variables.card.name} a été ajoutée à votre pokédex !`,
            });
        },
        onError: (error) => {
            console.error('❌ Erreur lors de l\'ajout:', error);
            toast({
                title: 'Erreur',
                description: 'Impossible d\'ajouter la carte à votre pokédex',
                variant: 'destructive',
            });
        },
    });
};

// Hook pour supprimer une carte du pokédex
export const useRemoveCardFromPokedex = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cardId: string) => {
            if (!user) {
                throw new Error('Utilisateur non connecté');
            }

            const { error } = await supabase
                .from('user_pokemon_cards')
                .delete()
                .eq('card_id', cardId)
                .eq('user_id', user.id);

            if (error) throw error;
            return cardId;
        },
        onSuccess: (cardId) => {
            // Mettre à jour le cache
            queryClient.setQueryData<UserPokemonCard[]>(
                pokedexKeys.userCards(user!.id),
                (old = []) => old.filter((c) => c.card_id !== cardId)
            );

            toast({
                title: 'Carte supprimée',
                description: 'La carte a été retirée de votre pokédex',
            });
        },
        onError: (error) => {
            console.error('❌ Erreur lors de la suppression:', error);
            toast({
                title: 'Erreur',
                description: 'Impossible de supprimer la carte',
                variant: 'destructive',
            });
        },
    });
};

// Hook pour mettre à jour une carte du pokédex
export const useUpdateCardInPokedex = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            updates
        }: {
            id: string;
            updates: Partial<UserPokemonCard>;
        }) => {
            if (!user) {
                throw new Error('Utilisateur non connecté');
            }

            const { error } = await supabase
                .from('user_pokemon_cards')
                .update(updates)
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;
            return { id, updates };
        },
        onSuccess: ({ id, updates }) => {
            // Mettre à jour le cache
            queryClient.setQueryData<UserPokemonCard[]>(
                pokedexKeys.userCards(user!.id),
                (old = []) => old.map((c) => (c.id === id ? { ...c, ...updates } : c))
            );

            toast({
                title: 'Carte mise à jour',
                description: 'Les modifications ont été sauvegardées',
            });
        },
        onError: (error) => {
            console.error('❌ Erreur lors de la mise à jour:', error);
            toast({
                title: 'Erreur',
                description: 'Impossible de mettre à jour la carte',
                variant: 'destructive',
            });
        },
    });
};

// Hook pour les statistiques du pokédex
export const usePokedexStats = () => {
    const { data: userCards = [] } = useUserCards();

    return {
        totalCards: userCards.reduce((sum, card) => sum + card.quantity, 0),
        uniqueCards: userCards.length,
        isCardInPokedex: (cardId: string) => userCards.some((c) => c.card_id === cardId),
        getCardFromPokedex: (cardId: string) => userCards.find((c) => c.card_id === cardId),
    };
}; 