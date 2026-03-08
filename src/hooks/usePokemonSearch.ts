import { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { PokemonCard, PokemonFilters, SortSettings } from "@/types/pokemon";
import { formatImageUrl, formatSymbolUrl } from "../lib/imageUtils";
import { useSearchHistory } from "@/contexts/SearchHistoryContext";
import marketPriceService from "@/lib/marketPriceService";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

const CARDS_PER_PAGE = 12;
const DEFAULT_CARDS_COUNT = 12;

// Cache global pour éviter de re-télécharger les détails des cartes déjà vues
const cardDetailsCache = new Map<string, PokemonCard>();

// Liste de cartes Pokémon de secours
const FALLBACK_CARD_IDS = [
    "sm12-1", "sv3-1", "swsh7-1", "sm10-1",
    "sm12-189", "swsh3-20", "swsh8-25", "sv3-125",
    "sm12-68", "sv3-245", "swsh35-31", "swsh4-44",
];

export const usePokemonSearch = () => {
    const [pokemonCards, setPokemonCards] = useState<PokemonCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCards, setVisibleCards] = useState(CARDS_PER_PAGE);
    const { toast } = useToast();
    const { user } = useAuth();
    const { addSearchToHistory } = useSearchHistory();

    // État pour les filtres et le tri
    const [filters, setFilters] = useState<PokemonFilters>({
        types: [],
        rarities: [],
        sets: [],
        minHp: 0,
        maxHp: 300,
    });
    const [sortSettings, setSortSettings] = useState<SortSettings>({
        option: 'name',
        direction: 'asc',
    });

    const [pricesLoading, setPricesLoading] = useState(false);
    const [pricesLoaded, setPricesLoaded] = useState(false);

    // Charger les détails d'une carte avec cache DB + Local
    const fetchCardDetails = useCallback(async (id: string): Promise<PokemonCard | null> => {
        if (cardDetailsCache.has(id)) {
            return cardDetailsCache.get(id)!;
        }

        try {
            // 1. Tenter de récupérer depuis Supabase Cache
            const { data: cachedCard, error: cacheError } = await supabase
                .from('pokemon_cards_cache')
                .select('full_data')
                .eq('id', id)
                .single();

            if (cachedCard && !cacheError) {
                const card = cachedCard.full_data as PokemonCard;
                cardDetailsCache.set(id, card);
                return card;
            }

            // 2. Si non trouvé, fetch de l'API externe
            const response = await fetch(`https://api.tcgdex.net/v2/fr/cards/${id}`);
            if (!response.ok) return null;
            
            const cardData = await response.json();
            
            // Formatage des URLs
            if (cardData.image) cardData.image = formatImageUrl(cardData.image);
            if (cardData.set?.symbol) cardData.set.symbol = formatSymbolUrl(cardData.set.symbol);
            if (cardData.set?.logo) cardData.set.logo = formatSymbolUrl(cardData.set.logo);

            // 3. Sauvegarder dans le cache DB (si utilisateur connecté)
            if (user) {
                await supabase.from('pokemon_cards_cache').upsert({
                    id: cardData.id,
                    name: cardData.name,
                    image_url: cardData.image,
                    types: cardData.types,
                    hp: cardData.hp,
                    rarity: cardData.rarity,
                    set_id: cardData.set?.id,
                    set_name: cardData.set?.name,
                    local_id: cardData.localId,
                    market_price: cardData.marketPrices?.market,
                    full_data: cardData
                });
            }

            cardDetailsCache.set(id, cardData);
            return cardData;
        } catch (err) {
            console.error(`Erreur détails carte ${id}:`, err);
            return null;
        }
    }, [user]);

    // Extraire les options disponibles (optimisé avec useMemo)
    const availableOptions = useMemo(() => {
        const types = new Set<string>();
        const rarities = new Set<string>();
        const sets = new Set<string>();
        let maxHpValue = 300;

        pokemonCards.forEach(card => {
            if (card.types) card.types.forEach(type => types.add(type));
            if (card.rarity) rarities.add(card.rarity);
            if (card.set?.name) sets.add(card.set.name);
            if (card.hp) {
                const val = parseInt(card.hp, 10);
                if (!isNaN(val) && val > maxHpValue) maxHpValue = val;
            }
        });

        return {
            types: Array.from(types).sort(),
            rarities: Array.from(rarities).sort(),
            sets: Array.from(sets).sort(),
            maxHp: maxHpValue
        };
    }, [pokemonCards]);

    // Filtrage et Tri (optimisé avec useMemo pour éviter les calculs lourds au re-rendu)
    const filteredCards = useMemo(() => {
        const result = pokemonCards.filter(card => {
            if (filters.types.length > 0 && (!card.types || !card.types.some(t => filters.types.includes(t)))) return false;
            if (filters.rarities.length > 0 && (!card.rarity || !filters.rarities.includes(card.rarity))) return false;
            if (filters.sets.length > 0 && (!card.set?.name || !filters.sets.includes(card.set.name))) return false;
            
            const hpValue = card.hp ? parseInt(card.hp, 10) : 0;
            if (!isNaN(hpValue) && (hpValue < filters.minHp || hpValue > filters.maxHp)) return false;
            if (isNaN(hpValue) && filters.minHp > 0) return false;

            return true;
        });

        const direction = sortSettings.direction === 'asc' ? 1 : -1;
        return result.sort((a, b) => {
            switch (sortSettings.option) {
                case 'name': return (a.name || '').localeCompare(b.name || '') * direction;
                case 'rarity': return (a.rarity || '').localeCompare(b.rarity || '') * direction;
                case 'hp': return ((a.hp ? parseInt(a.hp, 10) : 0) - (b.hp ? parseInt(b.hp, 10) : 0)) * direction;
                case 'releaseDate': return (a.set?.releaseDate || '').localeCompare(b.set?.releaseDate || '') * direction;
                default: return 0;
            }
        });
    }, [pokemonCards, filters, sortSettings]);

    const loadDefaultCards = useCallback(async () => {
        setIsLoading(true);
        try {
            // Tenter de charger les 20 plus récentes en cache pour l'accueil
            const { data: cached } = await supabase
                .from('pokemon_cards_cache')
                .select('full_data')
                .order('last_updated', { ascending: false })
                .limit(DEFAULT_CARDS_COUNT);

            if (cached && cached.length >= DEFAULT_CARDS_COUNT) {
                setPokemonCards(cached.map(c => c.full_data as PokemonCard));
                setIsLoading(false);
                return;
            }

            const response = await fetch(`https://api.tcgdex.net/v2/fr/cards?limit=${DEFAULT_CARDS_COUNT}`);
            const data = await response.json();
            const cardIds = Array.isArray(data) ? data.map((c: { id: string }) => c.id) : FALLBACK_CARD_IDS;
            
            // Fetch en parallèle avec limite implicite par le navigateur
            const cards = await Promise.all(cardIds.map(id => fetchCardDetails(id)));
            setPokemonCards(cards.filter(Boolean) as PokemonCard[]);
        } catch {
            console.error("Erreur cartes par défaut");
            const fallbackDetails = await Promise.all(FALLBACK_CARD_IDS.map(id => fetchCardDetails(id)));
            setPokemonCards(fallbackDetails.filter(Boolean) as PokemonCard[]);
        } finally {
            setIsLoading(false);
        }
    }, [fetchCardDetails]);

    useEffect(() => {
        loadDefaultCards();
    }, [loadDefaultCards]);

    const searchPokemon = useCallback(async (query: string) => {
        const terms = query.split(",").map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
        if (terms.length === 0) return;

        setIsLoading(true);
        setPricesLoaded(false);

        try {
            // 1. Tenter de chercher en DB d'abord (recherche textuelle)
            const searchPromises = terms.map(term => 
                supabase
                    .from('pokemon_cards_cache')
                    .select('full_data')
                    .ilike('name', `%${term}%`)
                    .limit(20)
            );

            const results = await Promise.all(searchPromises);
            const cachedCards = results.flatMap(r => r.data || []).map(r => r.full_data as PokemonCard);
            
            // Si on a assez de résultats, on les affiche tout de suite pour la réactivité
            if (cachedCards.length > 0) {
                setPokemonCards(cachedCards);
                // On continue quand même le fetch pour s'assurer d'avoir les données à jour/complètes
            }

            // 2. Fetch API TCGDex
            const apiSearchPromises = terms.map(term => 
                fetch(`https://api.tcgdex.net/v2/fr/cards?name=${encodeURIComponent(term)}`)
                    .then(res => res.ok ? res.json() : [])
            );

            const apiSearchResults = (await Promise.all(apiSearchPromises)).flat();
            const uniqueIds = Array.from(new Set(apiSearchResults.map((c: { id: string }) => c.id))).slice(0, 50);

            // Filtrer les IDs qu'on a déjà en cache mémoire
            const detailedCards = await Promise.all(uniqueIds.map(id => fetchCardDetails(id)));
            const validCards = detailedCards.filter(Boolean) as PokemonCard[];
            
            setPokemonCards(validCards);
            addSearchToHistory(query, validCards.length);

            if (validCards.length === 0 && cachedCards.length === 0) {
                toast({ variant: "destructive", title: "Aucune carte trouvée" });
            }
        } catch (err) {
            console.error("Erreur de recherche:", err);
            toast({ variant: "destructive", title: "Erreur de recherche" });
        } finally {
            setIsLoading(false);
        }
    }, [addSearchToHistory, fetchCardDetails, toast]);

    const loadMarketPrices = useCallback(async () => {
        if (pricesLoading || pricesLoaded) return;
        setPricesLoading(true);
        try {
            const visibleSlice = filteredCards.slice(0, visibleCards);
            const enriched = await marketPriceService.enrichCardsWithPrices(visibleSlice);
            
            setPokemonCards(prev => {
                const next = [...prev];
                enriched.forEach(card => {
                    const idx = next.findIndex(c => c.id === card.id);
                    if (idx !== -1) next[idx] = card;
                });
                return next;
            });
            setPricesLoaded(true);
            toast({ title: "Prix chargés" });
        } catch {
            toast({ variant: "destructive", title: "Erreur prix" });
        } finally {
            setPricesLoading(false);
        }
    }, [filteredCards, pricesLoading, pricesLoaded, toast, visibleCards]);

    const loadMore = useCallback(() => setVisibleCards(v => v + CARDS_PER_PAGE), []);

    return {
        pokemonCards,
        filteredCards,
        isLoading,
        searchPokemon,
        visibleCards,
        loadMore,
        filters,
        sortSettings,
        availableOptions,
        updateTypeFilter: (type: string, sel: boolean) => setFilters(f => ({ ...f, types: sel ? [...f.types, type] : f.types.filter(t => t !== type) })),
        updateRarityFilter: (rarity: string, sel: boolean) => setFilters(f => ({ ...f, rarities: sel ? [...f.rarities, rarity] : f.rarities.filter(r => r !== rarity) })),
        updateSetFilter: (set: string, sel: boolean) => setFilters(f => ({ ...f, sets: sel ? [...f.sets, set] : f.sets.filter(s => s !== set) })),
        updateHpRange: (min: number, max: number) => setFilters(f => ({ ...f, minHp: min, maxHp: max })),
        resetFilters: () => setFilters({ types: [], rarities: [], sets: [], minHp: 0, maxHp: availableOptions.maxHp }),
        updateSortSettings: (s: Partial<SortSettings>) => setSortSettings(prev => ({ ...prev, ...s })),
        pricesLoading,
        pricesLoaded,
        loadMarketPrices
    };
};

export default usePokemonSearch; 