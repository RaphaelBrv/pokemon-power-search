import React from "react";
import { formatImageUrl } from "../lib/imageUtils";
import { PokemonCard } from "@/types/pokemon";
import { Button } from "@/components/ui/button";
import { Plus, Check, Star } from "lucide-react";
import {
  useAddCardToPokedex,
  usePokedexStats,
} from "@/hooks/usePokedexQueries";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PokemonCardItemProps {
  card: PokemonCard;
  onClick: (card: PokemonCard) => void;
}

const typeColors: Record<string, string> = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  psychic: "bg-purple-500",
  fighting: "bg-orange-700",
  colorless: "bg-gray-400",
  darkness: "bg-gray-800",
  metal: "bg-slate-500",
  dragon: "bg-indigo-600",
  fairy: "bg-pink-400",
};

const PokemonCardItem: React.FC<PokemonCardItemProps> = ({ card, onClick }) => {
  const [imageError, setImageError] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const [isAdding, setIsAdding] = React.useState(false);
  const maxRetries = 2;

  const { user } = useAuth();
  const { isCardInPokedex } = usePokedexStats();
  const addCardMutation = useAddCardToPokedex();
  const isInPokedex = isCardInPokedex(card.id);

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

  const handleAddToPokedex = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la propagation du clic vers la carte

    if (!user) {
      // L'utilisateur n'est pas connecté, on peut soit ouvrir le modal d'auth soit afficher un message
      return;
    }

    setIsAdding(true);
    addCardMutation.mutate(
      { card },
      {
        onSettled: () => {
          setIsAdding(false);
        },
      }
    );
  };

  if (imageError) {
    return null;
  }

  return (
    <motion.div
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
      className="poke-card poke-card-hover overflow-hidden cursor-pointer relative group flex flex-col h-full border-b-4 border-black/10"
      onClick={() => onClick(card)}
    >
      {/* Badge de rareté flottant */}
      {card.rarity && (
        <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest border border-white/20 flex items-center gap-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
          {card.rarity}
        </div>
      )}

      {/* Bouton d'ajout au pokédex */}
      <div className="absolute top-2 right-2 z-10">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            size="sm"
            variant={isInPokedex ? "secondary" : "default"}
            className={cn(
              "h-10 w-10 p-0 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] transition-all",
              isInPokedex 
                ? "bg-[#FFDE00] text-[#3B4CCA] hover:bg-[#F3CC00]" 
                : "bg-[#3B4CCA] text-white hover:bg-[#2A3990]"
            )}
            onClick={handleAddToPokedex}
            disabled={isAdding}
          >
            {isAdding ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            ) : isInPokedex ? (
              <Check className="h-5 w-5 stroke-[3px]" />
            ) : (
              <Plus className="h-5 w-5 stroke-[3px]" />
            )}
          </Button>
        </motion.div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-3">
          <h3 className="text-lg font-black text-[#3B4CCA] leading-tight mb-1 truncate group-hover:text-[#FF0000] transition-colors">
            {card.name}
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">#{card.localId}</span>
            <span className="truncate">{card.set?.name}</span>
          </div>
        </div>

        <div className="relative aspect-[3/4] mb-4 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-2 group-hover:bg-blue-50 transition-colors">
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_10px_15px_rgba(0,0,0,0.1)]"
            loading="lazy"
            onError={handleImageError}
          />
          {/* Overlay glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#3B4CCA]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {card.types?.map((type, index) => (
            <span
              key={index}
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider border-b-2 border-black/20",
                typeColors[type.toLowerCase()] || "bg-gray-500"
              )}
            >
              {type}
            </span>
          ))}
          
          {card.hp && (
            <span className="ml-auto text-xs font-black text-red-600 flex items-center gap-0.5">
              <span className="text-[10px] opacity-60">HP</span> {card.hp}
            </span>
          )}
        </div>
      </div>

      {card.set?.symbol && (
        <div className="px-4 pb-4 flex items-center gap-2 border-t border-dashed border-gray-100 pt-3">
          <img
            src={card.set.symbol}
            alt={card.set.name}
            className="w-5 h-5 object-contain grayscale group-hover:grayscale-0 transition-all"
          />
          <span className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-tighter">{card.set.name}</span>
        </div>
      )}
    </motion.div>
  );
};

export default PokemonCardItem;
