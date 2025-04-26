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

const Index = () => {
  const { pokemonCards, isLoading, searchPokemon, visibleCards, loadMore } =
    usePokemonSearch();
  const [selectedCard, setSelectedCard] = React.useState<PokemonCard | null>(
    null
  );
  const [hasSearched, setHasSearched] = React.useState(false);

  // Gérer le clic sur une carte
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
    // Utilisation d'un fond blanc simple pour la clarté
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar avec fond rouge Pokémon */}
      <Navbar
        className={`bg-[${pokemonRed}] text-[${pokemonWhite}] shadow-md`}
      />

      {/* Contenu principal avec padding */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {/* Section Hero centrée */}
        <div className="text-center mb-12">
          <Hero />
        </div>

        {/* Barre de recherche stylisée */}
        <div
          className={`bg-gray-100 p-6 rounded-lg shadow-md mb-12 border-t-4 border-[${pokemonRed}]`}
        >
          <p className={`text-xl text-center text-[${pokemonBlack}] mb-6`}>
            Quelle carte Pokémon recherchez-vous aujourd'hui ?
          </p>
          {/* La SearchBar elle-même peut nécessiter une props pour styliser le bouton */}
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          <p className="text-sm text-center text-gray-500 mt-3">
            Tapez un nom ou plusieurs noms séparés par des virgules !
          </p>
        </div>

        {/* Zone d'affichage principale (Chargement, Cartes, Message d'erreur) */}
        <div className="mb-12">
          {/* Affichage du chargement */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 py-10">
              {/* Utilisation de couleurs Pokémon pour le spinner si possible, sinon standard */}
              <LoadingSpinner />
              <LoadingMessage />
            </div>
          )}

          {/* Affichage des cartes Pokémon */}
          {!isLoading && pokemonCards.length > 0 && (
            <div className="space-y-10">
              {/* Section Titre */}
              <h2
                className={`text-3xl font-bold text-center text-[${pokemonBlack}]`}
              >
                {hasSearched
                  ? "Résultats de votre recherche"
                  : "Cartes Pokémon populaires"}
              </h2>

              {/* Marquee pour les cartes par défaut */}
              {!hasSearched && (
                <div className="bg-white rounded-lg shadow-inner p-4 border border-gray-200">
                  <h3
                    className={`text-xl font-semibold mb-4 text-center text-[${pokemonBlack}]`}
                  >
                    Découvrez notre sélection
                  </h3>
                  {/* Ajustement du style du Marquee */}
                  <Marquee
                    className={`py-4 rounded-lg bg-gradient-to-r from-white via-gray-50 to-white border-y border-[${pokemonYellow}]`}
                    pauseOnHover
                    // Ajout d'un peu plus de gap et d'une durée plus rapide
                    style={
                      {
                        "--gap": "2rem",
                        "--duration": "30s",
                      } as React.CSSProperties
                    }
                  >
                    {pokemonCards.map((card) => (
                      // Ajustement de la taille et du style des items
                      <div
                        key={card.id}
                        className="mx-4 w-52 shrink-0 transform transition-transform hover:scale-105"
                      >
                        {/* Appliquer des styles plus subtils à PokemonCardItem via ses propres classes si nécessaire */}
                        <PokemonCardItem
                          card={card}
                          onClick={handleCardClick}
                        />
                      </div>
                    ))}
                  </Marquee>
                </div>
              )}

              {/* Liste des cartes en grille (s'affiche toujours, mais pourrait être conditionnelle si le Marquee suffisait avant recherche) */}
              <PokemonCardsList
                cards={pokemonCards}
                visibleCards={visibleCards}
                onCardClick={handleCardClick}
                onLoadMore={loadMore}
                // Passer une props pour styliser le bouton "Load More" si nécessaire
              />
            </div>
          )}

          {/* Message si aucune carte n'est trouvée */}
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

        {/* Section FAQ stylisée */}
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

        {/* Démo du curseur Pokeball */}
        <div className="text-center mt-12 mb-16">
          <h2 className={`text-2xl font-bold mb-8 text-[${pokemonBlack}]`}>
            Essayez notre curseur Pokeball !
          </h2>
          <PointerDemo />
        </div>

        {/* Modal de détail pour la carte (reste inchangé) */}
        <CardDetailModal
          selectedCard={selectedCard}
          onClose={handleCloseModal}
        />
      </main>

      {/* Footer avec fond noir et texte jaune/blanc */}
      <Footer
        className={`bg-[${pokemonBlack}] text-[${pokemonYellow}] py-6 mt-auto`}
      />
    </div>
  );
};

export default Index;
