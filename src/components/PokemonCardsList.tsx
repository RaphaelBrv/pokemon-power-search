import React from "react";
import { Button } from "@/components/ui/button";
import PokemonCardItem from "./PokemonCardItem";
import { PokemonCard } from "@/types/pokemon";

interface PokemonCardsListProps {
  cards: PokemonCard[];
  visibleCards: number;
  onCardClick: (card: PokemonCard) => void;
  onLoadMore: () => void;
}

const PokemonCardsList: React.FC<PokemonCardsListProps> = ({
  cards,
  visibleCards,
  onCardClick,
  onLoadMore,
}) => {
  const displayedCards = cards.slice(0, visibleCards);
  const hasMoreCards = visibleCards < cards.length;

  if (cards.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {displayedCards.map((card) => (
          <PokemonCardItem key={card.id} card={card} onClick={onCardClick} />
        ))}
      </div>

      {/* Message si aucune carte ne s'affiche */}
      {displayedCards.length === 0 && (
        <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg mx-4 sm:mx-0">
          <p className="text-gray-700 text-sm sm:text-base">
            Aucune carte disponible avec des images valides.
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            Essayez une autre recherche.
          </p>
        </div>
      )}

      {/* Bouton "Afficher plus" */}
      {hasMoreCards && (
        <div className="mt-6 sm:mt-8 text-center px-4 sm:px-0">
          <Button
            onClick={onLoadMore}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md text-sm sm:text-base"
          >
            Afficher plus ({cards.length - visibleCards} restantes)
          </Button>
        </div>
      )}
    </>
  );
};

export default PokemonCardsList;
