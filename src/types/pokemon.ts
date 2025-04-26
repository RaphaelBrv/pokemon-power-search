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
}

// Interface pour les données du set
export interface PokemonSet {
    id: string;
    name: string;
    logo: string;
    symbol: string;
    cardCount: {
        total: number;
        official: number;
    };
    cards: PokemonCard[];
} 