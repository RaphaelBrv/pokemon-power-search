import { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { PokemonCard, PokemonFilters, SortSettings } from "@/types/pokemon";
import { formatImageUrl, formatSymbolUrl } from "../lib/imageUtils";
import { useSearchHistory } from "@/contexts/SearchHistoryContext";
import marketPriceService from "@/lib/marketPriceService";

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

    // Charger les détails d'une carte avec cache
    const fetchCardDetails = useCallback(async (id: string): Promise<PokemonCard | null> => {
        if (cardDetailsCache.has(id)) {
            return cardDetailsCache.get(id)!;
        }

        try {
            const response = await fetch(`https://api.tcgdex.net/v2/fr/cards/${id}`);
            if (!response.ok) return null;
            
            const cardData = await response.json();
            
            // Formatage des URLs
            if (cardData.image) cardData.image = formatImageUrl(cardData.image);
            if (cardData.set?.symbol) cardData.set.symbol = formatSymbolUrl(cardData.set.symbol);
            if (cardData.set?.logo) cardData.set.logo = formatSymbolUrl(cardData.set.logo);

            cardDetailsCache.set(id, cardData);
            return cardData;
        } catch (err) {
            console.error(`Erreur détails carte ${id}:`, err);
            return null;
        }
    }, []);

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
            const response = await fetch(`https://api.tcgdex.net/v2/fr/cards?limit=${DEFAULT_CARDS_COUNT}`);
            const data = await response.json();
            const cardIds = Array.isArray(data) ? data.map((c: { id: string }) => c.id) : FALLBACK_CARD_IDS;
            
            // Fetch en parallèle avec limite implicite par le navigateur
            const cards = await Promise.all(cardIds.map(id => fetchCardDetails(id)));
            setPokemonCards(cards.filter(Boolean) as PokemonCard[]);
        } catch (error) {
            console.error("Erreur cartes par défaut:", error);
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
            const searchPromises = terms.map(term => 
                fetch(`https://api.tcgdex.net/v2/fr/cards?name=${encodeURIComponent(term)}`)
                    .then(res => res.ok ? res.json() : [])
            );

            const searchResults = (await Promise.all(searchPromises)).flat();
            const uniqueIds = Array.from(new Set(searchResults.map((c: { id: string }) => c.id))).slice(0, 50); // Limite à 50 pour la perf

            const detailedCards = await Promise.all(uniqueIds.map(id => fetchCardDetails(id)));
            const validCards = detailedCards.filter(Boolean) as PokemonCard[];
            
            setPokemonCards(validCards);
            addSearchToHistory(query, validCards.length);

            if (validCards.length === 0) {
                toast({ variant: "destructive", title: "Aucune carte trouvée" });
            }
        } catch (error) {
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
        } catch (error) {
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