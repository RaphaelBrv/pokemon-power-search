import React, { useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
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
  const parentRef = useRef<HTMLDivElement>(null);
  const displayedCards = cards.slice(0, visibleCards);
  const hasMoreCards = visibleCards < cards.length;

  // Calcul du nombre de colonnes basé sur les breakpoints Tailwind
  // sm: 2, lg: 3, xl: 4
  const [columns, setColumns] = React.useState(1);

  React.useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1280) setColumns(4);
      else if (width >= 1024) setColumns(3);
      else if (width >= 640) setColumns(2);
      else setColumns(1);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Grouper les cartes par lignes pour la virtualisation
  const rows = useMemo(() => {
    const r = [];
    for (let i = 0; i < displayedCards.length; i += columns) {
      r.push(displayedCards.slice(i, i + columns));
    }
    return r;
  }, [displayedCards, columns]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => (window as any), // Utiliser le scroll de la fenêtre
    estimateSize: () => 450, // Hauteur estimée d'une ligne de cartes
    overscan: 2,
  });

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div
        ref={parentRef}
        className="relative w-full"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            className="absolute top-0 left-0 w-full grid gap-4 sm:gap-6"
            style={{
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {rows[virtualRow.index].map((card) => (
              <PokemonCardItem key={card.id} card={card} onClick={onCardClick} />
            ))}
          </div>
        ))}
      </div>

      {displayedCards.length === 0 && (
        <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg mx-4 sm:mx-0 mt-8">
          <p className="text-gray-700 text-sm sm:text-base">
            Aucune carte disponible avec des images valides.
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            Essayez une autre recherche.
          </p>
        </div>
      )}

      {hasMoreCards && (
        <div className="mt-12 text-center pb-8">
          <Button
            onClick={onLoadMore}
            className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Charger plus de cartes ({cards.length - visibleCards} restantes)
          </Button>
        </div>
      )}
    </div>
  );
};

export default PokemonCardsList;
