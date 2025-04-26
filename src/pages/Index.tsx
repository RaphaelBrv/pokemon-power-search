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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center my-6 gap-4">
          <div className="md:w-2/3">
            <Hero />
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-xl text-gray-700 mb-6">
            Quelle carte Pokémon recherchez-vous aujourd'hui ? Tapez un nom ou
            plusieurs noms séparés par des virgules !
          </p>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className="mt-8 mb-12">
          {/* Affichage du chargement */}
          {isLoading && (
            <div className="space-y-4">
              <LoadingSpinner />
              <LoadingMessage />
            </div>
          )}

          {/* Affichage des cartes Pokémon */}
          {!isLoading && pokemonCards.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">
                {hasSearched
                  ? "Résultats de votre recherche"
                  : "Cartes Pokémon populaires"}
              </h2>

              {!hasSearched && (
                <div className="mb-10">
                  <h3 className="text-lg font-medium mb-3 text-center text-gray-700">
                    Découvrez notre sélection en défilement
                  </h3>
                  <Marquee
                    className="py-4 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-xl"
                    pauseOnHover
                  >
                    {pokemonCards.map((card) => (
                      <div key={card.id} className="mx-4 w-48 shrink-0">
                        <PokemonCardItem
                          card={card}
                          onClick={handleCardClick}
                        />
                      </div>
                    ))}
                  </Marquee>
                </div>
              )}

              <PokemonCardsList
                cards={pokemonCards}
                visibleCards={visibleCards}
                onCardClick={handleCardClick}
                onLoadMore={loadMore}
              />
            </>
          )}

          {/* Message si aucune carte n'est trouvée */}
          {!isLoading && pokemonCards.length === 0 && (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-lg">
                Aucune carte n'a été trouvée.
              </p>
              <p className="text-gray-500 mt-2">
                Essayez une autre recherche ou vérifiez votre connexion.
              </p>
            </div>
          )}
        </div>

        {/* Section FAQ */}
        <FAQ />

        {/* Modal de détail pour la carte */}
        <CardDetailModal
          selectedCard={selectedCard}
          onClose={handleCloseModal}
        />

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
