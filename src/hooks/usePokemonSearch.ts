import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PokemonCard } from "@/types/pokemon";
import { formatImageUrl, formatSymbolUrl } from "../lib/imageUtils";

const CARDS_PER_PAGE = 12;
const DEFAULT_CARDS_COUNT = 12;

// Liste de cartes Pokémon hardcodées pour assurer un affichage minimum
const FALLBACK_CARD_IDS = [
    "sm12-1", // Venusaur & Snivy GX
    "sv3-1", // Venusaur ex
    "swsh7-1", // Venusaur V
    "sm10-1", // Celebi & Venusaur GX
    "sm12-189", // Charizard & Braixen GX
    "swsh3-20", // Charizard V
    "swsh8-25", // Charizard VMAX
    "sv3-125", // Charizard ex
    "sm12-68", // Blastoise & Piplup GX
    "sv3-245", // Blastoise ex
    "swsh35-31", // Pikachu VMAX
    "swsh4-44", // Pikachu V
];

export const usePokemonSearch = () => {
    const [pokemonCards, setPokemonCards] = useState<PokemonCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCards, setVisibleCards] = useState(CARDS_PER_PAGE);
    const { toast } = useToast();

    // Charger des cartes populaires au chargement initial
    useEffect(() => {
        console.log("Chargement des cartes par défaut...");
        loadDefaultCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadDefaultCards = async () => {
        try {
            console.log("Début du chargement des cartes par défaut");

            // Créer un tableau pour stocker les IDs des cartes à charger
            let cardIds: string[] = [];

            try {
                // Première tentative : utiliser l'endpoint /cards
                const url = `https://api.tcgdex.net/v2/fr/cards?limit=${DEFAULT_CARDS_COUNT}`;
                console.log(`Requête à l'URL: ${url}`);

                const response = await fetch(url);
                console.log(`Statut de la réponse: ${response.status}`);

                if (!response.ok) {
                    throw new Error(`Erreur API: ${response.statusText}`);
                }

                const data = await response.json();
                console.log(`Type de données reçues:`, typeof data);

                // Si les données sont un tableau, utiliser les IDs
                if (Array.isArray(data) && data.length > 0) {
                    console.log(`Nombre de cartes trouvées: ${data.length}`);
                    cardIds = data.slice(0, DEFAULT_CARDS_COUNT).map(card => card.id);
                } else {
                    throw new Error("Format de données inattendu");
                }
            } catch (error) {
                console.warn("Échec de la première méthode, utilisation des IDs de secours", error);
                // Si l'API échoue, utiliser les IDs de secours
                cardIds = FALLBACK_CARD_IDS;
            }

            console.log(`IDs de cartes à charger: ${cardIds.join(', ')}`);

            // Si aucun ID n'est disponible (cas improbable), utiliser les IDs de secours
            if (cardIds.length === 0) {
                console.warn("Aucun ID de carte disponible, utilisation des IDs de secours");
                cardIds = FALLBACK_CARD_IDS;
            }

            // Récupérer les détails pour chaque carte individuellement
            const loadedCards: PokemonCard[] = [];

            for (const id of cardIds) {
                try {
                    console.log(`Chargement de la carte: ${id}`);
                    const detailUrl = `https://api.tcgdex.net/v2/fr/cards/${id}`;
                    const detailResponse = await fetch(detailUrl);

                    if (!detailResponse.ok) {
                        console.warn(`Échec du chargement de la carte ${id}: ${detailResponse.statusText}`);
                        continue;
                    }

                    const cardData = await detailResponse.json();

                    // Formater les URLs
                    if (cardData.image) {
                        cardData.image = formatImageUrl(cardData.image);
                    } else {
                        cardData.image = "https://via.placeholder.com/245x342?text=Image+non+disponible";
                    }

                    if (cardData.set?.symbol) {
                        cardData.set.symbol = formatSymbolUrl(cardData.set.symbol);
                    }

                    if (cardData.set?.logo) {
                        cardData.set.logo = formatSymbolUrl(cardData.set.logo);
                    }

                    loadedCards.push(cardData);
                    console.log(`Carte ${id} (${cardData.name}) chargée avec succès`);
                } catch (err) {
                    console.error(`Erreur lors du chargement de la carte ${id}:`, err);
                }
            }

            console.log(`Total de cartes chargées avec succès: ${loadedCards.length}`);

            if (loadedCards.length > 0) {
                // Si des cartes ont été chargées avec succès, les utiliser
                setPokemonCards(loadedCards);
                setVisibleCards(Math.min(loadedCards.length, DEFAULT_CARDS_COUNT));
                console.log("Cartes chargées avec succès:", loadedCards.map(c => c.name).join(', '));
            } else {
                // Sinon, créer des cartes de secours génériques
                console.error("Aucune carte n'a pu être chargée, création de cartes génériques");
                const fallbackCards = Array.from({ length: DEFAULT_CARDS_COUNT }, (_, i) => ({
                    id: `fallback-${i + 1}`,
                    name: `Carte Pokémon ${i + 1}`,
                    image: "https://via.placeholder.com/245x342?text=Carte+Pokémon",
                    localId: String(i + 1)
                })) as PokemonCard[];

                setPokemonCards(fallbackCards);
                setVisibleCards(Math.min(fallbackCards.length, DEFAULT_CARDS_COUNT));
            }
        } catch (error) {
            console.error("Erreur générale lors du chargement des cartes par défaut:", error);
            // Créer des cartes génériques en cas d'erreur générale
            const fallbackCards = Array.from({ length: DEFAULT_CARDS_COUNT }, (_, i) => ({
                id: `fallback-${i + 1}`,
                name: `Carte Pokémon ${i + 1}`,
                image: "https://via.placeholder.com/245x342?text=Carte+Pokémon",
                localId: String(i + 1)
            })) as PokemonCard[];

            setPokemonCards(fallbackCards);
            setVisibleCards(Math.min(fallbackCards.length, DEFAULT_CARDS_COUNT));
        } finally {
            setIsLoading(false);
            console.log("Chargement terminé, isLoading = false");
        }
    };

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