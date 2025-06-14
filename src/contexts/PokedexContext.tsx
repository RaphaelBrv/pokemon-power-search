import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, UserPokemonCard } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { PokemonCard } from "@/types/pokemon";
import { useToast } from "@/hooks/use-toast";

interface PokedexContextType {
  userCards: UserPokemonCard[];
  loading: boolean;
  addCardToPokedex: (
    card: PokemonCard,
    quantity?: number,
    notes?: string
  ) => Promise<boolean>;
  removeCardFromPokedex: (cardId: string) => Promise<boolean>;
  updateCardInPokedex: (
    id: string,
    updates: Partial<UserPokemonCard>
  ) => Promise<boolean>;
  isCardInPokedex: (cardId: string) => boolean;
  getCardFromPokedex: (cardId: string) => UserPokemonCard | undefined;
  refreshPokedex: () => Promise<void>;
  totalCards: number;
  uniqueCards: number;
}

const PokedexContext = createContext<PokedexContextType | undefined>(undefined);

export const usePokedex = () => {
  const context = useContext(PokedexContext);
  if (context === undefined) {
    throw new Error("usePokedex must be used within a PokedexProvider");
  }
  return context;
};

export const PokedexProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userCards, setUserCards] = useState<UserPokemonCard[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      console.log("User connecté, récupération des cartes...");
      fetchUserCards();
    } else {
      console.log("Aucun utilisateur connecté, réinitialisation des cartes");
      setUserCards([]);
      setLoading(false);
    }
  }, [user]);

  const fetchUserCards = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log("Récupération des cartes pour l'utilisateur:", user.id);

      const { data, error } = await supabase
        .from("user_pokemon_cards")
        .select("*")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false });

      if (error) {
        console.error(
          "Erreur Supabase lors de la récupération des cartes:",
          error
        );
        toast({
          title: "Erreur",
          description: `Impossible de charger votre collection: ${error.message}`,
          variant: "destructive",
        });
        setUserCards([]);
      } else {
        console.log("Cartes récupérées:", data?.length || 0);
        setUserCards(data || []);
      }
    } catch (error) {
      console.error("Erreur générale:", error);
      setUserCards([]);
      toast({
        title: "Erreur",
        description: "Problème de connexion avec la base de données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCardToPokedex = async (
    card: PokemonCard,
    quantity = 1,
    notes = ""
  ) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description:
          "Vous devez être connecté pour ajouter des cartes à votre pokédex",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Vérifier si la carte existe déjà
      const existingCard = userCards.find((c) => c.card_id === card.id);

      if (existingCard) {
        // Mettre à jour la quantité
        const { error } = await supabase
          .from("user_pokemon_cards")
          .update({
            quantity: existingCard.quantity + quantity,
            notes: notes || existingCard.notes,
          })
          .eq("id", existingCard.id);

        if (error) throw error;

        // Mettre à jour localement
        setUserCards((prev) =>
          prev.map((c) =>
            c.id === existingCard.id
              ? {
                  ...c,
                  quantity: c.quantity + quantity,
                  notes: notes || c.notes,
                }
              : c
          )
        );

        toast({
          title: "Carte mise à jour",
          description: `${card.name} - Quantité: ${
            existingCard.quantity + quantity
          }`,
        });
      } else {
        // Ajouter nouvelle carte
        const imageUrl = card.image || null;

        const newCard: Omit<UserPokemonCard, "id" | "added_at"> = {
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
          .from("user_pokemon_cards")
          .insert([newCard])
          .select()
          .single();

        if (error) throw error;

        // Ajouter localement
        setUserCards((prev) => [data, ...prev]);

        toast({
          title: "Carte ajoutée",
          description: `${card.name} a été ajoutée à votre pokédex !`,
        });
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la carte à votre pokédex",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeCardFromPokedex = async (cardId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("user_pokemon_cards")
        .delete()
        .eq("card_id", cardId)
        .eq("user_id", user.id);

      if (error) throw error;

      // Supprimer localement
      setUserCards((prev) => prev.filter((c) => c.card_id !== cardId));

      toast({
        title: "Carte supprimée",
        description: "La carte a été retirée de votre pokédex",
      });

      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la carte",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateCardInPokedex = async (
    id: string,
    updates: Partial<UserPokemonCard>
  ) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("user_pokemon_cards")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      // Mettre à jour localement
      setUserCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );

      toast({
        title: "Carte mise à jour",
        description: "Les modifications ont été sauvegardées",
      });

      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la carte",
        variant: "destructive",
      });
      return false;
    }
  };

  const isCardInPokedex = (cardId: string) => {
    return userCards.some((c) => c.card_id === cardId);
  };

  const getCardFromPokedex = (cardId: string) => {
    return userCards.find((c) => c.card_id === cardId);
  };

  const refreshPokedex = async () => {
    await fetchUserCards();
  };

  const totalCards = userCards.reduce((sum, card) => sum + card.quantity, 0);
  const uniqueCards = userCards.length;

  const value = {
    userCards,
    loading,
    addCardToPokedex,
    removeCardFromPokedex,
    updateCardInPokedex,
    isCardInPokedex,
    getCardFromPokedex,
    refreshPokedex,
    totalCards,
    uniqueCards,
  };

  return (
    <PokedexContext.Provider value={value}>{children}</PokedexContext.Provider>
  );
};
