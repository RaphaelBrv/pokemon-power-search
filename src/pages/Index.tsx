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

const Index = () => {
  const { pokemonCards, isLoading, searchPokemon, visibleCards, loadMore } =
    usePokemonSearch();
  const [selectedCard, setSelectedCard] = React.useState<PokemonCard | null>(
    null
  );

  // Gérer le clic sur une carte
  const handleCardClick = (card: PokemonCard) => {
    setSelectedCard(card);
  };

  // Fermer la modal
  const handleCloseModal = () => {
    setSelectedCard(null);
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
            <PokemonCardsList
              cards={pokemonCards}
              visibleCards={visibleCards}
              onCardClick={handleCardClick}
              onLoadMore={loadMore}
            />
          )}
        </div>

        {/* Modal d'affichage détaillé de la carte */}
        <CardDetailModal
          selectedCard={selectedCard}
          onClose={handleCloseModal}
        />

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
