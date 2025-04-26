import { useState, useCallback } from 'react';
import { PokemonCard } from '@/types/pokemon';

interface UseCardComparisonReturn {
    comparisonCards: PokemonCard[];
    isInComparison: (cardId: string) => boolean;
    addToComparison: (card: PokemonCard) => void;
    removeFromComparison: (cardId: string) => void;
    clearComparison: () => void;
    maxComparisonCards: number;
}

export const useCardComparison = (maxCards = 4): UseCardComparisonReturn => {
    const [comparisonCards, setComparisonCards] = useState<PokemonCard[]>([]);

    const isInComparison = useCallback(
        (cardId: string) => comparisonCards.some(card => card.id === cardId),
        [comparisonCards]
    );

    const addToComparison = useCallback(
        (card: PokemonCard) => {
            if (comparisonCards.length >= maxCards) {
                console.warn(`Vous ne pouvez pas comparer plus de ${maxCards} cartes à la fois.`);
                return;
            }

            if (isInComparison(card.id)) {
                console.warn('Cette carte est déjà dans la comparaison.');
                return;
            }

            setComparisonCards(prev => [...prev, card]);
        },
        [comparisonCards.length, isInComparison, maxCards]
    );

    const removeFromComparison = useCallback(
        (cardId: string) => {
            setComparisonCards(prev => prev.filter(card => card.id !== cardId));
        },
        []
    );

    const clearComparison = useCallback(() => {
        setComparisonCards([]);
    }, []);

    return {
        comparisonCards,
        isInComparison,
        addToComparison,
        removeFromComparison,
        clearComparison,
        maxComparisonCards: maxCards,
    };
};

export default useCardComparison; 