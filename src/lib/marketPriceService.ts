// Note: Ceci est un service simulé car il n'y a pas d'API réelle pour les prix du marché dans l'API TCGDex
// Dans une application réelle, vous pourriez utiliser l'API TCGPlayer ou une autre API de prix

import { PokemonCard } from "@/types/pokemon";

// Interface pour un résultat de prix
interface PriceResult {
    low: number;
    mid: number;
    high: number;
    market: number;
    lastUpdated: string;
}

// Cache pour stocker les prix déjà récupérés
const priceCache = new Map<string, PriceResult>();

// Prix aléatoires simulés basés sur la rareté de la carte
const generateSimulatedPrice = (card: PokemonCard): PriceResult => {
    let basePrice = 1.0;

    // Augmenter le prix de base en fonction de la rareté
    if (card.rarity) {
        const rarityLower = card.rarity.toLowerCase();

        if (rarityLower.includes('rare')) basePrice = 2.0;
        if (rarityLower.includes('ultra')) basePrice = 5.0;
        if (rarityLower.includes('secret')) basePrice = 15.0;
        if (rarityLower.includes('hyper')) basePrice = 25.0;
        if (rarityLower.includes('rainbow')) basePrice = 30.0;
        if (rarityLower.includes('gold')) basePrice = 40.0;
    }

    // Augmenter le prix pour les cartes avec HP élevé
    if (card.hp) {
        const hpValue = parseInt(card.hp, 10);
        if (!isNaN(hpValue) && hpValue > 200) {
            basePrice *= 1.5;
        }
    }

    // Ajouter un facteur aléatoire
    const randomFactor = 0.7 + Math.random() * 0.6; // entre 0.7 et 1.3

    const normalizedPrice = basePrice * randomFactor;

    return {
        low: parseFloat((normalizedPrice * 0.7).toFixed(2)),
        mid: parseFloat(normalizedPrice.toFixed(2)),
        high: parseFloat((normalizedPrice * 1.3).toFixed(2)),
        market: parseFloat((normalizedPrice * (0.9 + Math.random() * 0.2)).toFixed(2)),
        lastUpdated: new Date().toISOString()
    };
};

// Récupérer les prix du marché pour une carte
export const getMarketPrices = async (card: PokemonCard): Promise<PriceResult> => {
    // Vérifier si les prix sont déjà en cache
    if (priceCache.has(card.id)) {
        return priceCache.get(card.id)!;
    }

    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

    // Générer des prix simulés
    const prices = generateSimulatedPrice(card);

    // Mettre en cache pour les futures requêtes
    priceCache.set(card.id, prices);

    return prices;
};

// Récupérer les prix du marché pour plusieurs cartes
export const getMarketPricesForCards = async (cards: PokemonCard[]): Promise<Map<string, PriceResult>> => {
    const results = new Map<string, PriceResult>();

    // Traiter les cartes par lots pour éviter de surcharger le navigateur
    const batchSize = 5;
    for (let i = 0; i < cards.length; i += batchSize) {
        const batch = cards.slice(i, i + batchSize);
        const pricePromises = batch.map(card => getMarketPrices(card).then(price => ({ cardId: card.id, price })));

        const batchResults = await Promise.all(pricePromises);
        batchResults.forEach(({ cardId, price }) => {
            results.set(cardId, price);
        });
    }

    return results;
};

// Enrichir les cartes avec les données de prix
export const enrichCardsWithPrices = async (cards: PokemonCard[]): Promise<PokemonCard[]> => {
    const prices = await getMarketPricesForCards(cards);

    return cards.map(card => {
        const cardPrice = prices.get(card.id);
        if (cardPrice) {
            return {
                ...card,
                marketPrices: cardPrice
            };
        }
        return card;
    });
};

export default {
    getMarketPrices,
    getMarketPricesForCards,
    enrichCardsWithPrices
}; 