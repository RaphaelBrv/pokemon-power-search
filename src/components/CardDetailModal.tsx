import * as React from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { formatImageUrl } from "../lib/imageUtils";
import { PokemonCard } from "@/types/pokemon";

interface CardDetailModalProps {
  selectedCard: PokemonCard | null;
  onClose: () => void;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({
  selectedCard,
  onClose,
}) => {
  if (!selectedCard) return null;

  return (
    <Dialog open={!!selectedCard} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[95%] md:max-w-[90%] lg:max-w-[800px] p-0 overflow-hidden bg-white rounded-lg max-h-[90vh]">
        <div className="flex flex-col md:flex-row h-full">
          {/* Partie gauche - Image */}
          <div className="md:w-1/2 p-3 md:p-6 flex items-center justify-center bg-gray-50 max-h-[40vh] md:max-h-none">
            <img
              src={formatImageUrl(selectedCard.image, "high", "webp")}
              alt={selectedCard.name}
              className="max-h-[38vh] md:max-h-[75vh] object-contain w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (
                  !target.src.includes("placeholder") &&
                  !target.getAttribute("data-retry")
                ) {
                  target.setAttribute("data-retry", "true");
                  // Essayer le format PNG si le WebP ne fonctionne pas
                  target.src = formatImageUrl(
                    selectedCard.image,
                    "high",
                    "png"
                  );
                } else if (
                  target.getAttribute("data-retry") === "true" &&
                  !target.getAttribute("data-retry-2")
                ) {
                  // Deuxième tentative avec une autre qualité
                  target.setAttribute("data-retry-2", "true");
                  target.src = formatImageUrl(selectedCard.image, "low", "png");
                } else {
                  // Si toutes les tentatives échouent, afficher un placeholder
                  target.src =
                    "https://via.placeholder.com/600x825?text=Image+non+disponible";
                }
              }}
            />
          </div>

          {/* Partie droite - Informations */}
          <div className="md:w-1/2 p-4 md:p-6 overflow-y-auto max-h-[50vh] md:max-h-[80vh]">
            <div className="flex justify-between items-start mb-3 sticky top-0 bg-white z-10 pb-2">
              <h2 className="text-xl md:text-2xl font-bold capitalize">
                {selectedCard.name}
              </h2>
              <DialogClose className="rounded-full h-10 w-10 flex items-center justify-center hover:bg-gray-200 -mt-1 -mr-2">
                <X size={20} />
              </DialogClose>
            </div>

            <div className="mb-3 text-sm md:text-base">
              <p className="text-gray-700">
                Set:{" "}
                <span className="font-semibold">{selectedCard.set?.name}</span>
              </p>
              <p className="text-gray-700">
                Numéro:{" "}
                <span className="font-semibold">
                  {selectedCard.localId}/
                  {selectedCard.set?.cardCount?.total || "?"}
                </span>
              </p>
              {selectedCard.rarity && (
                <p className="text-gray-700">
                  Rareté:{" "}
                  <span className="font-semibold">{selectedCard.rarity}</span>
                </p>
              )}
              {selectedCard.illustrator && (
                <p className="text-gray-700">
                  Illustrateur:{" "}
                  <span className="font-semibold">
                    {selectedCard.illustrator}
                  </span>
                </p>
              )}
            </div>

            {selectedCard.types && selectedCard.types.length > 0 && (
              <div className="mb-3">
                <h3 className="text-base md:text-lg font-semibold mb-1">
                  Types
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCard.types.map((type, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 rounded-full text-xs md:text-sm capitalize"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedCard.abilities && selectedCard.abilities.length > 0 && (
              <div className="mb-3">
                <h3 className="text-base md:text-lg font-semibold mb-1">
                  Capacités
                </h3>
                {selectedCard.abilities.map((ability, index) => (
                  <div
                    key={index}
                    className="mb-2 p-2 md:p-3 bg-blue-50 rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm md:text-base">
                        {ability.name}
                      </span>
                      <span className="text-xs bg-blue-100 px-2 py-0.5 rounded-full">
                        {ability.type}
                      </span>
                    </div>
                    <p className="mt-1 text-xs md:text-sm text-gray-700">
                      {ability.effect}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {selectedCard.attacks && selectedCard.attacks.length > 0 && (
              <div className="mb-3">
                <h3 className="text-base md:text-lg font-semibold mb-1">
                  Attaques
                </h3>
                {selectedCard.attacks.map((attack, index) => (
                  <div
                    key={index}
                    className="mb-2 p-2 md:p-3 bg-red-50 rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm md:text-base">
                        {attack.name}
                      </span>
                      {attack.damage && (
                        <span className="font-bold">{attack.damage}</span>
                      )}
                    </div>
                    <div className="flex items-center mt-1 mb-1">
                      {attack.cost &&
                        attack.cost.map((costType, i) => (
                          <span
                            key={i}
                            className="mr-1 bg-gray-200 rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs"
                          >
                            {costType}
                          </span>
                        ))}
                    </div>
                    {attack.effect && (
                      <p className="text-xs md:text-sm text-gray-700">
                        {attack.effect}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailModal;
