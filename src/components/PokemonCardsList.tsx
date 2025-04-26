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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCards.map((card) => (
          <PokemonCardItem key={card.id} card={card} onClick={onCardClick} />
        ))}
      </div>

      {/* Message si aucune carte ne s'affiche */}
      {displayedCards.length === 0 && (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-700">
            Aucune carte disponible avec des images valides.
          </p>
          <p className="text-gray-500 mt-2">Essayez une autre recherche.</p>
        </div>
      )}

      {/* Bouton "Afficher plus" */}
      {hasMoreCards && (
        <div className="mt-8 text-center">
          <Button
            onClick={onLoadMore}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md"
          >
            Afficher plus ({cards.length - visibleCards} restantes)
          </Button>
        </div>
      )}
    </>
  );
};

export default PokemonCardsList;
