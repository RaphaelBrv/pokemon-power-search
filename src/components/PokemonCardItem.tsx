import React from "react";
import { formatImageUrl, formatSymbolUrl } from "../lib/imageUtils";
import { PokemonCard } from "@/types/pokemon";

interface PokemonCardItemProps {
  card: PokemonCard;
  onClick: (card: PokemonCard) => void;
}

const PokemonCardItem: React.FC<PokemonCardItemProps> = ({ card, onClick }) => {
  const [imageError, setImageError] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 2;

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    console.error(`Erreur de chargement de l'image: ${target.src}`);

    if (retryCount >= maxRetries) {
      setImageError(true);
      return;
    }

    setRetryCount((prev) => prev + 1);

    const cardId = card.id;
    const [setId, localId] = cardId.split("-");
    if (setId && localId) {
      const quality = retryCount === 0 ? "high" : "low";
      const extension = retryCount === 0 ? "png" : "webp";
      const baseUrl = `/fr/${setId.split(".")[0]}/${setId}/${localId}`;
      target.src = formatImageUrl(baseUrl, quality, extension);
    } else {
      setImageError(true);
    }
  };

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
          {card.set?.name} · {card.localId}/{card.set?.cardCount?.total || "?"}
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

export default PokemonCardItem;
