import React from "react";
import { useToast } from "@/hooks/use-toast";
import SearchBar from "@/components/SearchBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingMessage from "@/components/LoadingMessage";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import FAQ from "@/components/FAQ";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import Pokeball3D from "@/components/Pokeball3D";
import { PointerDemo } from "@/components/PointerDemo";

// Définition du type pour une carte Pokémon TCG
interface PokemonCard {
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
interface PokemonSet {
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

// Fonction pour formater l'URL de l'image selon la documentation TCGdex
const formatImageUrl = (
  imageUrl: string,
  quality: "high" | "low" = "high",
  extension: "webp" | "png" | "jpg" = "webp"
): string => {
  if (!imageUrl)
    return "https://via.placeholder.com/245x342?text=Image+non+disponible";

  // Si l'URL est déjà complète avec qualité et extension, la retourner telle quelle
  if (imageUrl.includes(`.${extension}`)) return imageUrl;

  // Supprimer l'extension et qualité si elles existent déjà
  const baseUrl = imageUrl.replace(/\/(high|low)\.(webp|png|jpg)$/, "");

  // Si l'URL ne commence pas par http, ajouter le domaine de base
  const fullBaseUrl = baseUrl.startsWith("http")
    ? baseUrl
    : `https://assets.tcgdex.net${baseUrl}`;

  // Retourner l'URL formatée avec qualité et extension
  return `${fullBaseUrl}/${quality}.${extension}`;
};

// Fonction pour formater l'URL du symbole/logo du set
const formatSymbolUrl = (
  symbolUrl: string,
  extension: "webp" | "png" | "jpg" = "webp"
): string => {
  if (!symbolUrl) return "";

  // Si l'URL est déjà complète avec extension, la retourner telle quelle
  if (symbolUrl.includes(`.${extension}`)) return symbolUrl;

  // Supprimer l'extension si elle existe déjà
  const baseUrl = symbolUrl.replace(/\.(webp|png|jpg)$/, "");

  // Si l'URL ne commence pas par http, ajouter le domaine de base
  const fullBaseUrl = baseUrl.startsWith("http")
    ? baseUrl
    : `https://assets.tcgdex.net${baseUrl}`;

  // Retourner l'URL formatée avec extension
  return `${fullBaseUrl}.${extension}`;
};

const CARDS_PER_PAGE = 6;

const Index = () => {
  const [pokemonCards, setPokemonCards] = React.useState<PokemonCard[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState<PokemonCard | null>(
    null
  );
  const [visibleCards, setVisibleCards] = React.useState(CARDS_PER_PAGE);
  const { toast } = useToast();

  // Gérer le clic sur une carte
  const handleCardClick = (card: PokemonCard) => {
    setSelectedCard(card);
  };

  // Fermer la modal
  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  // Charger plus de cartes
  const handleLoadMore = () => {
    setVisibleCards((prevValue) => prevValue + CARDS_PER_PAGE);
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

  // Cartes à afficher selon la pagination
  const displayedCards = pokemonCards.slice(0, visibleCards);
  const hasMoreCards = visibleCards < pokemonCards.length;

  // Composant pour afficher une carte avec gestion des erreurs d'image
  const PokemonCardItem = ({
    card,
    onClick,
  }: {
    card: PokemonCard;
    onClick: (card: PokemonCard) => void;
  }) => {
    const [imageError, setImageError] = React.useState(false);
    const [retryCount, setRetryCount] = React.useState(0);
    const maxRetries = 2; // Nombre maximum de tentatives

    const handleImageError = (
      e: React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
      const target = e.target as HTMLImageElement;
      console.error(`Erreur de chargement de l'image: ${target.src}`);

      // Si on a déjà atteint le nombre maximum de tentatives, marquer comme erreur définitive
      if (retryCount >= maxRetries) {
        setImageError(true);
        return;
      }

      // Incrémenter le compteur de tentatives
      setRetryCount((prev) => prev + 1);

      // Essayer un autre format si c'est la première tentative
      const cardId = card.id;
      const [setId, localId] = cardId.split("-");
      if (setId && localId) {
        // Essayer d'abord en PNG haute qualité, puis en basse qualité
        const quality = retryCount === 0 ? "high" : "low";
        const extension = retryCount === 0 ? "png" : "webp";
        const baseUrl = `/fr/${setId.split(".")[0]}/${setId}/${localId}`;
        target.src = formatImageUrl(baseUrl, quality, extension);
      } else {
        setImageError(true);
      }
    };

    // Si l'image ne peut pas être chargée après plusieurs tentatives, on n'affiche pas la carte
    if (imageError) {
      return null;
    }

    return (
      <div
        className="pokemon-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
        onClick={() => onClick(card)}
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 capitalize">{card.name}</h3>
          <div className="text-sm text-gray-500 mb-2">
            {card.set?.name} · {card.localId}/
            {card.set?.cardCount?.total || "?"}
          </div>
        </div>

        <div className="px-4 pb-4">
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-auto rounded-md mx-auto"
            loading="lazy"
            onError={handleImageError}
          />
        </div>

        {card.types && (
          <div className="px-4 pb-4 flex flex-wrap gap-2">
            {card.types.map((type, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 rounded-full text-xs capitalize"
              >
                {type}
              </span>
            ))}
          </div>
        )}

        {card.set && (
          <div className="px-4 pb-4 flex items-center gap-2">
            {card.set.symbol && (
              <img
                src={card.set.symbol}
                alt={`Symbole ${card.set.name}`}
                className="w-6 h-6"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (
                    !target.src.includes("placeholder") &&
                    !target.getAttribute("data-retry")
                  ) {
                    target.setAttribute("data-retry", "true");
                    target.src = formatSymbolUrl(card.set?.symbol || "", "png");
                  } else {
                    // Cacher seulement l'image du symbole, pas toute la carte
                    target.style.display = "none";
                  }
                }}
              />
            )}
            <span className="text-sm">{card.set.name}</span>
          </div>
        )}

        {card.illustrator && (
          <div className="px-4 pb-4 text-xs text-gray-500">
            Illustrateur: {card.illustrator}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center my-6 gap-4">
          <div className="md:w-2/3">
            <Hero />
          </div>
          <div className="md:w-1/3 bg-white shadow-md rounded-lg overflow-hidden">
            <Pokeball3D className="w-full h-64" />
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-xl text-gray-700 mb-6">
            Quelle carte Pokémon recherchez-vous aujourd'hui ? Tapez un nom ou
            plusieurs noms séparés par des virgules !
          </p>
          <SearchBar onSearch={searchPokemon} isLoading={isLoading} />
        </div>

        <div className="mt-8 mb-12">
          {isLoading && (
            <div className="space-y-4">
              <LoadingSpinner />
              <LoadingMessage />
            </div>
          )}

          {/* Affichage des cartes Pokémon trouvées */}
          {pokemonCards.length > 0 && !isLoading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCards.map((card) => (
                  <PokemonCardItem
                    key={card.id}
                    card={card}
                    onClick={handleCardClick}
                  />
                ))}
              </div>

              {/* Message si aucune carte ne s'affiche */}
              {displayedCards.length === 0 && (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    Aucune carte disponible avec des images valides.
                  </p>
                  <p className="text-gray-500 mt-2">
                    Essayez une autre recherche.
                  </p>
                </div>
              )}

              {/* Bouton "Afficher plus" */}
              {hasMoreCards && (
                <div className="mt-8 text-center">
                  <Button
                    onClick={handleLoadMore}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md"
                  >
                    Afficher plus ({pokemonCards.length - visibleCards}{" "}
                    restantes)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal d'affichage détaillé de la carte */}
        <Dialog
          open={!!selectedCard}
          onOpenChange={(open) => !open && handleCloseModal()}
        >
          {selectedCard && (
            <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[800px] p-0 overflow-hidden bg-white rounded-lg">
              <div className="flex flex-col md:flex-row">
                {/* Partie gauche - Image */}
                <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-50">
                  <img
                    src={formatImageUrl(selectedCard.image, "high", "webp")}
                    alt={selectedCard.name}
                    className="max-h-[80vh] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (
                        !target.src.includes("placeholder") &&
                        !target.getAttribute("data-retry")
                      ) {
                        target.setAttribute("data-retry", "true");
                        // Essayer le format PNG si le WebP ne fonctionne pas
                        target.src = formatImageUrl(
                          selectedCard.image,
                          "high",
                          "png"
                        );
                      } else if (
                        target.getAttribute("data-retry") === "true" &&
                        !target.getAttribute("data-retry-2")
                      ) {
                        // Deuxième tentative avec une autre qualité
                        target.setAttribute("data-retry-2", "true");
                        target.src = formatImageUrl(
                          selectedCard.image,
                          "low",
                          "png"
                        );
                      } else {
                        // Si toutes les tentatives échouent, afficher un placeholder
                        target.src =
                          "https://via.placeholder.com/600x825?text=Image+non+disponible";
                      }
                    }}
                  />
                </div>

                {/* Partie droite - Informations */}
                <div className="md:w-1/2 p-6 overflow-y-auto max-h-[80vh]">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold capitalize">
                      {selectedCard.name}
                    </h2>
                    <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-200">
                      <X size={18} />
                    </DialogClose>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700">
                      Set:{" "}
                      <span className="font-semibold">
                        {selectedCard.set?.name}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      Numéro:{" "}
                      <span className="font-semibold">
                        {selectedCard.localId}/
                        {selectedCard.set?.cardCount?.total || "?"}
                      </span>
                    </p>
                    {selectedCard.rarity && (
                      <p className="text-gray-700">
                        Rareté:{" "}
                        <span className="font-semibold">
                          {selectedCard.rarity}
                        </span>
                      </p>
                    )}
                    {selectedCard.illustrator && (
                      <p className="text-gray-700">
                        Illustrateur:{" "}
                        <span className="font-semibold">
                          {selectedCard.illustrator}
                        </span>
                      </p>
                    )}
                  </div>

                  {selectedCard.types && selectedCard.types.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Types</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCard.types.map((type, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm capitalize"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCard.abilities &&
                    selectedCard.abilities.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">
                          Capacités
                        </h3>
                        {selectedCard.abilities.map((ability, index) => (
                          <div
                            key={index}
                            className="mb-3 p-3 bg-blue-50 rounded-md"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">
                                {ability.name}
                              </span>
                              <span className="text-xs bg-blue-100 px-2 py-1 rounded-full">
                                {ability.type}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-700">
                              {ability.effect}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                  {selectedCard.attacks && selectedCard.attacks.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Attaques</h3>
                      {selectedCard.attacks.map((attack, index) => (
                        <div
                          key={index}
                          className="mb-3 p-3 bg-red-50 rounded-md"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{attack.name}</span>
                            {attack.damage && (
                              <span className="font-bold">{attack.damage}</span>
                            )}
                          </div>
                          <div className="flex items-center mt-1 mb-2">
                            {attack.cost &&
                              attack.cost.map((costType, i) => (
                                <span
                                  key={i}
                                  className="mr-1 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                >
                                  {costType}
                                </span>
                              ))}
                          </div>
                          {attack.effect && (
                            <p className="text-sm text-gray-700">
                              {attack.effect}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>

        <FAQ />

        {/* Démo du curseur Pokeball */}
        <div className="mt-12 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Interagissez avec nos curseurs Pokeball
          </h2>
          <PointerDemo />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
