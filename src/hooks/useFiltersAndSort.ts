import { useState, useEffect, useMemo } from 'react';
import { PokemonCard, PokemonFilters, SortSettings } from '@/types/pokemon';

interface UseFiltersAndSortProps {
    cards: PokemonCard[];
}

export const useFiltersAndSort = ({ cards }: UseFiltersAndSortProps) => {
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

    // Extraire les options disponibles des cartes
    const availableOptions = useMemo(() => {
        const types = new Set<string>();
        const rarities = new Set<string>();
        const sets = new Set<string>();
        let maxHpValue = 0;

        cards.forEach(card => {
            // Types
            if (card.types) {
                card.types.forEach(type => types.add(type));
            }

            // Rareté
            if (card.rarity) {
                rarities.add(card.rarity);
            }

            // Sets
            if (card.set?.name) {
                sets.add(card.set.name);
            }

            // HP max
            if (card.hp) {
                const hpValue = parseInt(card.hp, 10);
                if (!isNaN(hpValue) && hpValue > maxHpValue) {
                    maxHpValue = hpValue;
                }
            }
        });

        return {
            types: Array.from(types).sort(),
            rarities: Array.from(rarities).sort(),
            sets: Array.from(sets).sort(),
            maxHp: maxHpValue > 0 ? maxHpValue : 300
        };
    }, [cards]);

    // Réinitialiser les filtres si les valeurs maximales changent
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            maxHp: availableOptions.maxHp
        }));
    }, [availableOptions.maxHp]);

    const updateTypeFilter = (type: string, isSelected: boolean) => {
        setFilters(prev => {
            if (isSelected) {
                return { ...prev, types: [...prev.types, type] };
            } else {
                return { ...prev, types: prev.types.filter(t => t !== type) };
            }
        });
    };

    const updateRarityFilter = (rarity: string, isSelected: boolean) => {
        setFilters(prev => {
            if (isSelected) {
                return { ...prev, rarities: [...prev.rarities, rarity] };
            } else {
                return { ...prev, rarities: prev.rarities.filter(r => r !== rarity) };
            }
        });
    };

    const updateSetFilter = (set: string, isSelected: boolean) => {
        setFilters(prev => {
            if (isSelected) {
                return { ...prev, sets: [...prev.sets, set] };
            } else {
                return { ...prev, sets: prev.sets.filter(s => s !== set) };
            }
        });
    };

    const updateHpRange = (min: number, max: number) => {
        setFilters(prev => ({
            ...prev,
            minHp: min,
            maxHp: max
        }));
    };

    const resetFilters = () => {
        setFilters({
            types: [],
            rarities: [],
            sets: [],
            minHp: 0,
            maxHp: availableOptions.maxHp
        });
    };

    const updateSortSettings = (newSettings: Partial<SortSettings>) => {
        setSortSettings(prev => ({
            ...prev,
            ...newSettings
        }));
    };

    // Appliquer les filtres et le tri aux cartes
    const filteredAndSortedCards = useMemo(() => {
        // Étape 1: Filtrer les cartes
        let result = cards.filter(card => {
            // Filtrer par type
            if (filters.types.length > 0) {
                if (!card.types || !card.types.some(type => filters.types.includes(type))) {
                    return false;
                }
            }

            // Filtrer par rareté
            if (filters.rarities.length > 0) {
                if (!card.rarity || !filters.rarities.includes(card.rarity)) {
                    return false;
                }
            }

            // Filtrer par set
            if (filters.sets.length > 0) {
                if (!card.set?.name || !filters.sets.includes(card.set.name)) {
                    return false;
                }
            }

            // Filtrer par HP
            if (card.hp) {
                const hpValue = parseInt(card.hp, 10);
                if (!isNaN(hpValue)) {
                    if (hpValue < filters.minHp || hpValue > filters.maxHp) {
                        return false;
                    }
                }
            } else if (filters.minHp > 0) {
                // Si la carte n'a pas de HP et que le minimum est supérieur à 0
                return false;
            }

            return true;
        });

        // Étape 2: Trier les cartes
        result.sort((a, b) => {
            const direction = sortSettings.direction === 'asc' ? 1 : -1;

            switch (sortSettings.option) {
                case 'name':
                    return (a.name || '').localeCompare(b.name || '') * direction;

                case 'rarity':
                    if (!a.rarity && !b.rarity) return 0;
                    if (!a.rarity) return direction;
                    if (!b.rarity) return -direction;
                    return a.rarity.localeCompare(b.rarity) * direction;

                case 'hp':
                    const aHp = a.hp ? parseInt(a.hp, 10) : 0;
                    const bHp = b.hp ? parseInt(b.hp, 10) : 0;
                    return (aHp - bHp) * direction;

                case 'releaseDate':
                    const aDate = a.set?.releaseDate || '';
                    const bDate = b.set?.releaseDate || '';
                    return aDate.localeCompare(bDate) * direction;

                default:
                    return 0;
            }
        });

        return result;
    }, [cards, filters, sortSettings]);

    // Calculer des statistiques sur les cartes filtrées
    const stats = useMemo(() => {
        return {
            totalCards: filteredAndSortedCards.length,
            byType: filteredAndSortedCards.reduce((acc, card) => {
                if (card.types) {
                    card.types.forEach(type => {
                        acc[type] = (acc[type] || 0) + 1;
                    });
                }
                return acc;
            }, {} as Record<string, number>),
            byRarity: filteredAndSortedCards.reduce((acc, card) => {
                if (card.rarity) {
                    acc[card.rarity] = (acc[card.rarity] || 0) + 1;
                }
                return acc;
            }, {} as Record<string, number>)
        };
    }, [filteredAndSortedCards]);

    return {
        filteredCards: filteredAndSortedCards,
        filters,
        sortSettings,
        availableOptions,
        stats,
        updateTypeFilter,
        updateRarityFilter,
        updateSetFilter,
        updateHpRange,
        resetFilters,
        updateSortSettings
    };
};

export default useFiltersAndSort; 