// Types pour l'API Pokémon TCG
export interface PokemonCard {
    id: string;
    localId: string;
    name: string;
    image: string;
    types?: string[];
    hp?: string;
    rarity?: string;
    set?: {
        id: string;
        name: string;
        logo: string;
        symbol: string;
        cardCount?: {
            total: number;
            official: number;
        };
        releaseDate?: string;
    };
    illustrator?: string;
    description?: string;
    abilities?: Array<{
        type: string;
        name: string;
        effect: string;
    }>;
    attacks?: Array<{
        cost: string[];
        name: string;
        effect: string;
        damage: string;
    }>;
    marketPrices?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        lastUpdated: string;
    };
}

// Interface pour les données du set
export interface PokemonSet {
    id: string;
    name: string;
    logo: string;
    symbol: string;
    releaseDate?: string;
    cardCount: {
        total: number;
        official: number;
    };
    cards: PokemonCard[];
}

// Interface pour les filtres
export interface PokemonFilters {
    types: string[];
    rarities: string[];
    sets: string[];
    minHp: number;
    maxHp: number;
}

// Interface pour les options de tri
export type SortOption = 'name' | 'releaseDate' | 'rarity' | 'hp';
export type SortDirection = 'asc' | 'desc';

export interface SortSettings {
    option: SortOption;
    direction: SortDirection;
}

// Interface pour un deck personnalisé
export interface PokemonDeck {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    cards: Array<{
        cardId: string;
        quantity: number;
    }>;
    coverImage?: string;
}

// Interface pour l'historique des recherches
export interface SearchHistoryItem {
    id: string;
    query: string;
    timestamp: Date;
    resultCount: number;
} 