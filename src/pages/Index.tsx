import React from "react";
import SearchBar from "@/components/SearchBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingMessage from "@/components/LoadingMessage";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import FAQ from "@/components/FAQ";
import { PointerDemo } from "@/components/PointerDemo";
import CardDetailModal from "@/components/CardDetailModal";
import PokemonCardsList from "@/components/PokemonCardsList";
import { usePokemonSearch } from "@/hooks/usePokemonSearch";
import { PokemonCard } from "@/types/pokemon";
import { Marquee } from "@/components/ui/marquee";
import PokemonCardItem from "@/components/PokemonCardItem";
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

  const { pokemonCards, isLoading, searchPokemon, visibleCards, loadMore } =
    usePokemonSearch();
  const [selectedCard, setSelectedCard] = React.useState<PokemonCard | null>(
    null
  );
  const [hasSearched, setHasSearched] = React.useState(false);

  // Gérer le clic sur une carte (fonctionne pour Marquee et List)
  const handleCardClick = (card: PokemonCard) => {
    setSelectedCard(card);
  };

  // Fermer la modal
  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  // Wrapper pour la recherche qui met à jour le statut de recherche
  const handleSearch = (query: string) => {
    setHasSearched(true);
    searchPokemon(query);
  };

  // Couleurs Pokémon
  const pokemonRed = "#FF0000";
  const pokemonYellow = "#FFDE00";
  const pokemonBlack = "#000000";
  const pokemonWhite = "#FFFFFF";

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Navbar
        className={`bg-[${pokemonRed}] text-[${pokemonWhite}] shadow-md`}
      />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {cursorContent && <Pointer>{cursorContent}</Pointer>}

        <div className="text-center mb-12">
          <Hero />
        </div>

        <div
          className={`bg-gray-100 p-6 rounded-lg shadow-md mb-12 border-t-4 border-[${pokemonRed}]`}
        >
          <p className={`text-xl text-center text-[${pokemonBlack}] mb-6`}>
            Quelle carte Pokémon recherchez-vous aujourd'hui ?
          </p>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          <p className="text-sm text-center text-gray-500 mt-3">
            Tapez un nom ou plusieurs noms séparés par des virgules !
          </p>
        </div>

        <div className="mb-12 min-h-[200px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 py-10">
              <LoadingSpinner />
              <LoadingMessage />
            </div>
          )}

          {!isLoading && pokemonCards.length > 0 && !hasSearched && (
            <div className="space-y-6">
              <h2
                className={`text-3xl font-bold text-center text-[${pokemonBlack}]`}
              >
                Cartes Pokémon populaires
              </h2>
              <div className="bg-white rounded-lg shadow-inner p-4 border border-gray-200">
                <h3
                  className={`text-xl font-semibold mb-4 text-center text-[${pokemonBlack}]`}
                >
                  Cliquez sur une carte pour voir les détails
                </h3>
                <Marquee
                  className={`py-4 rounded-lg bg-gradient-to-r from-white via-gray-50 to-white border-y border-[${pokemonYellow}]`}
                  pauseOnHover
                  style={
                    {
                      "--gap": "2rem",
                      "--duration": "30s",
                    } as React.CSSProperties
                  }
                >
                  {pokemonCards.map((card) => (
                    <div
                      key={card.id}
                      className="mx-4 w-52 shrink-0 transform transition-transform hover:scale-105 cursor-pointer"
                      onClick={() => handleCardClick(card)}
                    >
                      <PokemonCardItem card={card} onClick={handleCardClick} />
                    </div>
                  ))}
                </Marquee>
              </div>
            </div>
          )}

          {!isLoading && pokemonCards.length > 0 && hasSearched && (
            <div className="space-y-10">
              <h2
                className={`text-3xl font-bold text-center text-[${pokemonBlack}]`}
              >
                Résultats de votre recherche
              </h2>
              <PokemonCardsList
                cards={pokemonCards}
                visibleCards={visibleCards}
                onCardClick={handleCardClick}
                onLoadMore={loadMore}
              />
            </div>
          )}

          {!isLoading && pokemonCards.length === 0 && (
            <div
              className={`text-center p-8 bg-gray-50 rounded-lg border border-dashed border-[${pokemonRed}]`}
            >
              <p className={`text-xl font-semibold text-[${pokemonRed}] mb-2`}>
                Aucune carte trouvée !
              </p>
              <p className="text-gray-600">
                Essayez une autre recherche ou vérifiez l'orthographe.
              </p>
            </div>
          )}
        </div>

        <div
          className={`bg-gradient-to-br from-[${pokemonYellow}]/10 to-white p-6 rounded-lg shadow-md mb-12 border-l-4 border-[${pokemonYellow}]`}
        >
          <h2
            className={`text-2xl font-bold text-center mb-6 text-[${pokemonBlack}]`}
          >
            Questions Fréquentes (FAQ)
          </h2>
          <FAQ />
        </div>

        <div className="text-center mt-12 mb-16">
          <h2 className={`text-2xl font-bold mb-8 text-[${pokemonBlack}]`}>
            Essayez notre curseur Pokeball !
          </h2>
          <PointerDemo />
        </div>

        <CardDetailModal
          selectedCard={selectedCard}
          onClose={handleCloseModal}
        />
      </main>

      <Footer
        className={`bg-[${pokemonBlack}] text-[${pokemonYellow}] py-6 mt-auto`}
      />
    </div>
  );
};

// Composant Index principal qui fournit le contexte
const Index = () => {
  return (
    <CursorProvider>
      <PageContent />
    </CursorProvider>
  );
};

export default Index;
