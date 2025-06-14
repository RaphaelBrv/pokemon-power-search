import * as React from "react";
import SearchBar from "@/components/SearchBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingMessage from "@/components/LoadingMessage";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import FAQ from "@/components/FAQ";
import CardDetailModal from "@/components/CardDetailModal";
import PokemonCardsList from "@/components/PokemonCardsList";
import FilterPanel from "@/components/FilterPanel";
import SortPanel from "@/components/SortPanel";
import FavoritesList from "@/components/FavoritesList";
import SearchHistory from "@/components/SearchHistory";
import DeckManager from "@/components/DeckManager";
import CardComparison from "@/components/CardComparison";

import { usePokemonSearch } from "@/hooks/usePokemonSearch";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useDecks } from "@/contexts/DeckContext";
import { useCardComparison } from "@/hooks/useCardComparison";

import { PokemonCard } from "@/types/pokemon";
import { Marquee } from "@/components/ui/marquee";
import PokemonCardItem from "@/components/PokemonCardItem";
import { Button } from "@/components/ui/button";
import { Coins, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  CursorProvider,
  useCursor,
  CursorStyleId,
} from "@/contexts/CursorContext";
import { Pointer } from "@/components/ui/pointer";
import { motion } from "framer-motion";

// Fonction pour rendre le contenu du curseur basé sur l'ID
const renderCursorContent = (id: CursorStyleId): React.ReactNode => {
  switch (id) {
    case "pokeball":
      return (
        <motion.div
          animate={{ scale: [0.8, 1, 0.8], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-red-600"
          >
            <circle cx="20" cy="20" r="18" fill="#FF0000" />
            <rect x="1" y="18" width="38" height="4" fill="#000000" />
            <circle
              cx="20"
              cy="20"
              r="6"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="2"
            />
            <circle
              cx="20"
              cy="20"
              r="3"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      );
    case "rotating":
      return (
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="18" fill="#FF0000" />
            <rect x="1" y="18" width="38" height="4" fill="#000000" />
            <circle
              cx="20"
              cy="20"
              r="6"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="2"
            />
            <circle
              cx="20"
              cy="20"
              r="3"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      );
    case "masterball":
      return (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="18" fill="#7B2CBF" />
          <rect x="1" y="18" width="38" height="4" fill="#000000" />
          <circle
            cx="20"
            cy="20"
            r="6"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2"
          />
          <circle cx="20" cy="20" r="2" fill="#FFFFFF" />
          <path d="M8 12 L12 8 L16 12 L12 16 Z" fill="#FF0000" />
          <path d="M28 12 L32 8 L36 12 L32 16 Z" fill="#FF0000" />
        </svg>
      );
    case "safari":
      return (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="18" fill="#4D924B" />
            <rect x="1" y="18" width="38" height="4" fill="#000000" />
            <path d="M10 10 L14 6 L18 10 L14 14 Z" fill="#7A542E" />
            <path d="M22 10 L26 6 L30 10 L26 14 Z" fill="#7A542E" />
            <circle
              cx="20"
              cy="20"
              r="6"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="2"
            />
            <circle
              cx="20"
              cy="20"
              r="3"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      );
    default:
      return null; // Pas de contenu si aucun ID n'est sélectionné
  }
};

// Composant interne qui utilise le contexte
const PageContent = () => {
  const { selectedCursorId } = useCursor();
  const cursorContent = renderCursorContent(selectedCursorId);
  const { toast } = useToast();

  const {
    pokemonCards,
    filteredCards,
    isLoading,
    searchPokemon,
    visibleCards,
    loadMore,
    filters,
    sortSettings,
    availableOptions,
    updateTypeFilter,
    updateRarityFilter,
    updateSetFilter,
    updateHpRange,
    resetFilters,
    updateSortSettings,
    pricesLoading,
    pricesLoaded,
    loadMarketPrices,
  } = usePokemonSearch();

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addCardToDeck, decks } = useDecks();
  const {
    comparisonCards,
    isInComparison,
    addToComparison,
    removeFromComparison,
    clearComparison,
    maxComparisonCards,
  } = useCardComparison();

  const [selectedCard, setSelectedCard] = React.useState<PokemonCard | null>(
    null
  );
  const [hasSearched, setHasSearched] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);

  const handleCardClick = (card: PokemonCard) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  const handleSearch = (query: string) => {
    setHasSearched(true);
    searchPokemon(query);
  };

  const handleToggleFavorite = (card: PokemonCard, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(card.id)) {
      removeFavorite(card.id);
      toast({
        title: "Retiré des favoris",
        description: `${card.name} a été retiré.`,
      });
    } else {
      addFavorite(card);
      toast({
        title: "Ajouté aux favoris",
        description: `${card.name} a été ajouté.`,
      });
    }
  };

  const handleToggleComparison = (card: PokemonCard, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInComparison(card.id)) {
      removeFromComparison(card.id);
      toast({
        title: "Retiré de la comparaison",
        description: `${card.name} a été retiré.`,
      });
    } else {
      if (comparisonCards.length < maxComparisonCards) {
        addToComparison(card);
        toast({
          title: "Ajouté à la comparaison",
          description: `${card.name} a été ajouté.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Limite atteinte",
          description: `Vous ne pouvez comparer que ${maxComparisonCards} cartes.`,
        });
      }
    }
  };

  const pokemonRed = "#FF0000";
  const pokemonYellow = "#FFDE00";
  const pokemonBlack = "#000000";
  const pokemonWhite = "#FFFFFF";

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Navbar className={`bg-[${pokemonRed}] text-[${pokemonWhite}] shadow-md`}>
        <div className="flex items-center space-x-2">
          <SearchHistory onSearchAgain={handleSearch} />
          <FavoritesList onCardClick={handleCardClick} />
          <DeckManager onViewCard={handleCardClick} />
          <CardComparison
            cards={comparisonCards}
            removeCard={removeFromComparison}
            clearComparison={clearComparison}
            maxCards={maxComparisonCards}
          />
        </div>
      </Navbar>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {cursorContent && <Pointer>{cursorContent}</Pointer>}

        <div className="text-center mb-8 sm:mb-12">
          <Hero />
        </div>

        <div
          className={`bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md mb-6 border-t-4 border-[${pokemonRed}]`}
        >
          <p
            className={`text-lg sm:text-xl text-center text-[${pokemonBlack}] mb-4 sm:mb-6`}
          >
            Quelle carte Pokémon recherchez-vous aujourd'hui ?
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-grow w-full">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
              <p className="text-sm text-center sm:text-left text-gray-500 mt-2">
                Tapez un nom ou plusieurs noms séparés par des virgules !
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full sm:w-auto flex-shrink-0 gap-2"
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm">
                {showFilters ? "Masquer les filtres" : "Filtres avancés"}
              </span>
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <FilterPanel
                filters={filters}
                availableOptions={availableOptions}
                updateTypeFilter={updateTypeFilter}
                updateRarityFilter={updateRarityFilter}
                updateSetFilter={updateSetFilter}
                updateHpRange={updateHpRange}
                resetFilters={resetFilters}
              />
              <div className="space-y-4 sm:space-y-6">
                <SortPanel
                  sortSettings={sortSettings}
                  updateSortSettings={updateSortSettings}
                />
                <Button
                  onClick={loadMarketPrices}
                  disabled={pricesLoading || pricesLoaded}
                  className="w-full gap-2"
                >
                  {pricesLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <Coins className="h-4 w-4" />
                  )}
                  <span className="text-sm sm:text-base">
                    {pricesLoaded ? "Prix chargés" : "Charger les prix"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 sm:mb-12 min-h-[200px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 py-10">
              <LoadingSpinner />
              <LoadingMessage />
            </div>
          )}

          {!isLoading && pokemonCards.length > 0 && !hasSearched && (
            <div className="space-y-4 sm:space-y-6">
              <h2
                className={`text-2xl sm:text-3xl font-bold text-center text-[${pokemonBlack}]`}
              >
                Cartes Pokémon populaires
              </h2>
              <div className="bg-white rounded-lg shadow-inner p-3 sm:p-4 border border-gray-200">
                <h3
                  className={`text-lg sm:text-xl font-semibold mb-4 text-center text-[${pokemonBlack}]`}
                >
                  Cliquez sur une carte pour voir les détails
                </h3>
                <Marquee
                  className={`py-4 rounded-lg bg-gradient-to-r from-white via-gray-50 to-white border-y border-[${pokemonYellow}]`}
                  pauseOnHover
                  style={
                    {
                      "--gap": "0.5rem",
                      "--duration": "40s",
                    } as React.CSSProperties
                  }
                >
                  {pokemonCards.map((card) => (
                    <div
                      key={card.id}
                      className="mx-1 sm:mx-2 w-40 sm:w-48 shrink-0"
                    >
                      <PokemonCardItem card={card} onClick={handleCardClick} />
                    </div>
                  ))}
                </Marquee>
              </div>
            </div>
          )}

          {!isLoading && hasSearched && (
            <div className="px-2 sm:px-0">
              {filteredCards.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p className="text-base sm:text-lg">
                    Aucune carte ne correspond à vos critères.
                  </p>
                  <p className="text-sm mt-2">
                    Essayez de modifier vos filtres ou votre recherche.
                  </p>
                </div>
              ) : (
                <PokemonCardsList
                  cards={filteredCards}
                  visibleCards={visibleCards}
                  onCardClick={handleCardClick}
                  onLoadMore={loadMore}
                />
              )}
            </div>
          )}
        </div>

        <div className="px-2 sm:px-0">
          <FAQ />
        </div>
      </main>

      <Footer className={`bg-[${pokemonBlack}] text-[${pokemonWhite}] mt-12`} />

      {selectedCard && (
        <CardDetailModal
          selectedCard={selectedCard}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

// Composant principal de la page
const Index = () => {
  return (
    <CursorProvider>
      <PageContent />
    </CursorProvider>
  );
};

export default Index;
