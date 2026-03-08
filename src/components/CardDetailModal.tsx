import * as React from "react";
import { X, Shield, Zap, Info, Layers, User, Hash, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatImageUrl } from "../lib/imageUtils";
import { PokemonCard } from "@/types/pokemon";
import PokemonExtraInfo from "./PokemonExtraInfo";
import HoloCard from "./HoloCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface CardDetailModalProps {
  selectedCard: PokemonCard | null;
  onClose: () => void;
}

const typeColors: Record<string, string> = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-600",
  electric: "bg-yellow-400 text-black",
  psychic: "bg-pink-500",
  fighting: "bg-orange-700",
  colorless: "bg-slate-400",
  darkness: "bg-slate-800 text-white",
  metal: "bg-gray-500",
  dragon: "bg-indigo-600",
  fairy: "bg-pink-300 text-black",
};

const CardDetailModal: React.FC<CardDetailModalProps> = ({
  selectedCard,
  onClose,
}) => {
  if (!selectedCard) return null;

  const mainType = selectedCard.types?.[0]?.toLowerCase() || "colorless";

  // Nettoyage du nom pour PokeAPI (ex: "Grimalin de Rosemary" -> "Grimalin")
  const cleanName = selectedCard.name.split(' ')[0].replace(/[^a-zA-Z]/g, '');

  return (
    <Dialog open={!!selectedCard} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[95%] md:max-w-[90%] lg:max-w-[1000px] p-0 bg-white rounded-2xl overflow-hidden border-none shadow-2xl max-h-[92vh]">
        <VisuallyHidden.Root>
          <DialogTitle>{selectedCard.name}</DialogTitle>
          <DialogDescription>Détails complets de la carte Pokémon {selectedCard.name}</DialogDescription>
        </VisuallyHidden.Root>
        
        <div className="flex flex-col md:flex-row h-full">
          {/* Partie gauche - Image avec effet Holographique */}
          <div className={cn(
            "md:w-[45%] p-6 md:p-10 flex items-center justify-center min-h-[450px] md:min-h-0 relative overflow-hidden",
            typeColors[mainType] || "bg-slate-100"
          )}>
            {/* Effet de fond subtil */}
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            
            <div className="relative z-20 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <HoloCard 
                image={formatImageUrl(selectedCard.image, "high", "webp")} 
                name={selectedCard.name} 
              />
            </div>
          </div>

          {/* Partie droite - Informations */}
          <div className="md:w-[55%] flex flex-col h-[500px] md:h-[92vh] overflow-hidden bg-white">
            {/* Header fixe */}
            <div className="p-6 pb-4 border-b flex justify-between items-start flex-none bg-white/80 backdrop-blur-md z-30">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {selectedCard.types?.map((type, idx) => (
                    <Badge key={idx} className={cn("text-[10px] uppercase font-black", typeColors[type.toLowerCase()] || "bg-gray-500")}>
                      {type}
                    </Badge>
                  ))}
                  {selectedCard.hp && (
                    <span className="text-red-600 font-black text-sm ml-2">
                      {selectedCard.hp} HP
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
                  {selectedCard.name}
                </h2>
              </div>
              <DialogClose className="rounded-full h-10 w-10 flex items-center justify-center hover:bg-slate-100 transition-colors">
                <X size={24} className="text-slate-500" />
              </DialogClose>
            </div>

            {/* Contenu scrollable */}
            <div className="p-6 pt-4 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
              {/* Infos Rapides */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <InfoCard icon={<Layers size={14} />} label="Set" value={selectedCard.set?.name || "?"} />
                <InfoCard icon={<Hash size={14} />} label="Numéro" value={`${selectedCard.localId}/${selectedCard.set?.cardCount?.total || "?"}`} />
                <InfoCard icon={<Zap size={14} />} label="Rareté" value={selectedCard.rarity || "Commune"} />
                <InfoCard icon={<User size={14} />} label="Artiste" value={selectedCard.illustrator || "?"} />
              </div>

              {/* Capacités Spéciales */}
              {selectedCard.abilities && selectedCard.abilities.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Shield size={16} className="text-blue-500" /> Talents Spéciaux
                  </h3>
                  <div className="space-y-3">
                    {selectedCard.abilities.map((ability, index) => (
                      <div key={index} className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-black text-blue-900 uppercase text-sm">
                            {ability.name}
                          </span>
                          <Badge variant="outline" className="text-[9px] bg-white border-blue-200 text-blue-700">
                            {ability.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {ability.effect}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attaques */}
              {selectedCard.attacks && selectedCard.attacks.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-red-500" /> Attaques de Combat
                  </h3>
                  <div className="space-y-4">
                    {selectedCard.attacks.map((attack, index) => (
                      <div key={index} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="flex">
                              {attack.cost?.map((c, i) => (
                                <div key={i} className={cn("w-5 h-5 rounded-full border border-black/10 -ml-1 first:ml-0 flex items-center justify-center text-[8px] font-bold shadow-sm bg-white")}>
                                  {c.charAt(0)}
                                </div>
                              ))}
                            </div>
                            <span className="font-black text-slate-800 uppercase group-hover:text-red-600 transition-colors">
                              {attack.name}
                            </span>
                          </div>
                          {attack.damage && (
                            <span className="text-xl font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                              {attack.damage}
                            </span>
                          )}
                        </div>
                        {attack.effect && (
                          <p className="text-xs text-slate-500 pl-2 border-l-2 border-slate-100 italic">
                            {attack.effect}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Données Pokédex (RPG) */}
              <div className="mt-10 pt-8 border-t border-slate-100">
                <PokemonExtraInfo 
                  dexId={selectedCard.dexId} 
                  name={cleanName} 
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-1">
    <div className="flex items-center gap-1.5 text-slate-400">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-[11px] font-bold text-slate-700 truncate">{value}</span>
  </div>
);

export default CardDetailModal;
