import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PokemonCard } from "@/types/pokemon";
import { formatImageUrl, formatSymbolUrl } from "../lib/imageUtils";

const CARDS_PER_PAGE = 6;

export const usePokemonSearch = () => {
    const [pokemonCards, setPokemonCards] = useState<PokemonCard[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [visibleCards, setVisibleCards] = useState(CARDS_PER_PAGE);
    const { toast } = useToast();

    const searchPokemon = async (query: string) => {
        console.log("Recherche de cartes Pokémon:", query);
        setIsLoading(true);
        setPokemonCards([]);
        setVisibleCards(CARDS_PER_PAGE);

        try {
            // Vérifier si la requête contient plusieurs termes séparés par des virgules
            const searchTerms = query
                .split(",")
                .map((q) => q.trim().toLowerCase())
                .filter((term) => term.length > 0);

            if (searchTerms.length === 0) {
                throw new Error("Veuillez entrer un terme de recherche valide");
            }

            // Construire l'URL avec les filtres pour la recherche par nom
            const searchPromises = searchTerms.map((term) => {
                const url = `https://api.tcgdex.net/v2/fr/cards?name=${encodeURIComponent(
                    term
                )}`;
                return fetch(url).then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `Erreur lors de la recherche: ${response.statusText}`
                        );
                    }
                    return response.json() as Promise<PokemonCard[]>;
                });
            });

            const results = await Promise.all(searchPromises);

            // Fusionner et dédupliquer les résultats
            const mergedResults = results.flat();
            const uniqueResults = Array.from(
                new Map(mergedResults.map((card) => [card.id, card])).values()
            );

            if (uniqueResults.length === 0) {
                toast({
                    variant: "destructive",
                    title: "Aucune carte trouvée",
                    description:
                        "Essayez un autre terme de recherche ou vérifiez l'orthographe.",
                });
                setIsLoading(false);
                return;
            }

            // Pour chaque carte trouvée, récupérer les détails complets
            const detailsPromises = uniqueResults.map((card) => {
                return fetch(`https://api.tcgdex.net/v2/fr/cards/${card.id}`)
                    .then((response) => {
                        if (!response.ok) {
                            console.error(
                                `Erreur lors de la récupération des détails pour ${card.id}`
                            );
                            return card; // Retourner la carte sans détails si erreur
                        }
                        return response.json() as Promise<PokemonCard>;
                    })
                    .then((cardData) => {
                        // Formater l'URL de l'image selon la documentation
                        if (cardData && cardData.image) {
                            cardData.image = formatImageUrl(cardData.image);
                        }

                        // Formater les URLs des symboles et logos du set
                        if (cardData.set) {
                            if (cardData.set.symbol) {
                                cardData.set.symbol = formatSymbolUrl(cardData.set.symbol);
                            }
                            if (cardData.set.logo) {
                                cardData.set.logo = formatSymbolUrl(cardData.set.logo);
                            }
                        }

                        return cardData;
                    });
            });

            const cardsWithDetails = await Promise.all(detailsPromises);
            setPokemonCards(cardsWithDetails);

            toast({
                title:
                    cardsWithDetails.length > 1 ? "Cartes trouvées !" : "Carte trouvée !",
                description: `${cardsWithDetails.length} carte(s) correspond(ent) à votre recherche.`,
            });
        } catch (error) {
            console.error("Erreur lors de la recherche:", error);
            toast({
                variant: "destructive",
                title: "Une erreur est survenue",
                description:
                    error instanceof Error
                        ? error.message
                        : "Impossible de compléter la recherche pour le moment.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const loadMore = () => {
        setVisibleCards((prevValue) => prevValue + CARDS_PER_PAGE);
    };

    return {
        pokemonCards,
        isLoading,
        searchPokemon,
        visibleCards,
        loadMore,
    };
};

export default usePokemonSearch; 