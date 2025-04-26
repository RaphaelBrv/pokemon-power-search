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
      <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[800px] p-0 overflow-hidden bg-white rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* Partie gauche - Image */}
          <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-50">
            <img
              src={formatImageUrl(selectedCard.image, "high", "webp")}
              alt={selectedCard.name}
              className="max-h-[80vh] object-contain"
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
          <div className="md:w-1/2 p-6 overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold capitalize">
                {selectedCard.name}
              </h2>
              <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-200">
                <X size={18} />
              </DialogClose>
            </div>

            <div className="mb-4">
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
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Types</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCard.types.map((type, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm capitalize"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedCard.abilities && selectedCard.abilities.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Capacités</h3>
                {selectedCard.abilities.map((ability, index) => (
                  <div key={index} className="mb-3 p-3 bg-blue-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{ability.name}</span>
                      <span className="text-xs bg-blue-100 px-2 py-1 rounded-full">
                        {ability.type}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">
                      {ability.effect}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {selectedCard.attacks && selectedCard.attacks.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Attaques</h3>
                {selectedCard.attacks.map((attack, index) => (
                  <div key={index} className="mb-3 p-3 bg-red-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{attack.name}</span>
                      {attack.damage && (
                        <span className="font-bold">{attack.damage}</span>
                      )}
                    </div>
                    <div className="flex items-center mt-1 mb-2">
                      {attack.cost &&
                        attack.cost.map((costType, i) => (
                          <span
                            key={i}
                            className="mr-1 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            {costType}
                          </span>
                        ))}
                    </div>
                    {attack.effect && (
                      <p className="text-sm text-gray-700">{attack.effect}</p>
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
