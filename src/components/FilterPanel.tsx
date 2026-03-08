import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PokemonFilters } from "@/types/pokemon";
import { Filter, RotateCcw, Zap, Star, Layout } from "lucide-react";
import { motion } from "framer-motion";

interface FilterPanelProps {
  filters: PokemonFilters;
  availableOptions: {
    types: string[];
    rarities: string[];
    sets: string[];
    maxHp: number;
  };
  updateTypeFilter: (type: string, isSelected: boolean) => void;
  updateRarityFilter: (rarity: string, isSelected: boolean) => void;
  updateSetFilter: (set: string, isSelected: boolean) => void;
  updateHpRange: (min: number, max: number) => void;
  resetFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  availableOptions,
  updateTypeFilter,
  updateRarityFilter,
  updateSetFilter,
  updateHpRange,
  resetFilters,
}) => {
  return (
    <div className="poke-card p-6 border-b-4 border-black/10 bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-[#3B4CCA] p-2 rounded-lg shadow-lg">
            <Filter className="w-5 h-5 text-white stroke-[3px]" />
          </div>
          <h3 className="text-2xl font-black italic tracking-tighter text-[#3B4CCA]">FILTRES</h3>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="poke-button-yellow h-10 px-4 text-xs tracking-tighter flex items-center gap-2 border-none"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[3px]" />
            RÉINITIALISER
          </Button>
        </motion.div>
      </div>

      <Accordion type="multiple" defaultValue={["types", "hp"]} className="space-y-2">
        {/* Filtre par type */}
        <AccordionItem value="types" className="border-2 border-[#3B4CCA]/10 rounded-2xl px-4 bg-white/50 overflow-hidden">
          <AccordionTrigger className="text-sm font-black uppercase tracking-widest text-[#3B4CCA] hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 fill-[#FFDE00] text-[#FFDE00]" />
              Types de Pokémon
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-[#3B4CCA]/20">
              {availableOptions.types.map((type) => (
                <div key={type} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[#3B4CCA]/5 transition-colors cursor-pointer group">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.types.includes(type)}
                    onCheckedChange={(checked) =>
                      updateTypeFilter(type, checked === true)
                    }
                    className="border-2 border-[#3B4CCA]/30 data-[state=checked]:bg-[#3B4CCA] data-[state=checked]:border-[#3B4CCA]"
                  />
                  <Label
                    htmlFor={`type-${type}`}
                    className="text-xs font-bold uppercase tracking-tight cursor-pointer flex-1 text-gray-600 group-hover:text-[#3B4CCA] transition-colors"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Filtre par rareté */}
        <AccordionItem value="rarity" className="border-2 border-[#3B4CCA]/10 rounded-2xl px-4 bg-white/50 overflow-hidden">
          <AccordionTrigger className="text-sm font-black uppercase tracking-widest text-[#3B4CCA] hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 fill-[#FFDE00] text-[#FFDE00]" />
              Raretés
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 pb-4">
              {availableOptions.rarities.map((rarity) => (
                <div key={rarity} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[#3B4CCA]/5 transition-colors cursor-pointer group">
                  <Checkbox
                    id={`rarity-${rarity}`}
                    checked={filters.rarities.includes(rarity)}
                    onCheckedChange={(checked) =>
                      updateRarityFilter(rarity, checked === true)
                    }
                    className="border-2 border-[#3B4CCA]/30 data-[state=checked]:bg-[#3B4CCA] data-[state=checked]:border-[#3B4CCA]"
                  />
                  <Label
                    htmlFor={`rarity-${rarity}`}
                    className="text-xs font-bold uppercase tracking-tight cursor-pointer flex-1 text-gray-600 group-hover:text-[#3B4CCA]"
                  >
                    {rarity}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Filtre par extension */}
        <AccordionItem value="sets" className="border-2 border-[#3B4CCA]/10 rounded-2xl px-4 bg-white/50 overflow-hidden">
          <AccordionTrigger className="text-sm font-black uppercase tracking-widest text-[#3B4CCA] hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <Layout className="w-4 h-4 text-[#3B4CCA]" />
              Extensions
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 pb-4">
              {availableOptions.sets.map((set) => (
                <div key={set} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[#3B4CCA]/5 transition-colors cursor-pointer group">
                  <Checkbox
                    id={`set-${set}`}
                    checked={filters.sets.includes(set)}
                    onCheckedChange={(checked) =>
                      updateSetFilter(set, checked === true)
                    }
                    className="border-2 border-[#3B4CCA]/30 data-[state=checked]:bg-[#3B4CCA] data-[state=checked]:border-[#3B4CCA]"
                  />
                  <Label
                    htmlFor={`set-${set}`}
                    className="text-xs font-bold uppercase tracking-tight cursor-pointer flex-1 text-gray-600 group-hover:text-[#3B4CCA]"
                  >
                    {set}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Filtre par points de vie */}
        <AccordionItem value="hp" className="border-2 border-[#3B4CCA]/10 rounded-2xl px-4 bg-white/50 overflow-hidden">
          <AccordionTrigger className="text-sm font-black uppercase tracking-widest text-[#3B4CCA] hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white">HP</div>
              Points de vie
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-2 pt-4 pb-6">
              <Slider
                defaultValue={[filters.minHp, filters.maxHp]}
                min={0}
                max={availableOptions.maxHp}
                step={10}
                value={[filters.minHp, filters.maxHp]}
                onValueChange={(values) => updateHpRange(values[0], values[1])}
                className="mb-6"
              />
              <div className="flex justify-between items-center">
                <div className="bg-[#3B4CCA]/5 px-3 py-1 rounded-lg border border-[#3B4CCA]/10">
                  <span className="text-[10px] font-black text-[#3B4CCA] uppercase opacity-40 mr-2">Min</span>
                  <span className="text-sm font-black text-[#3B4CCA]">{filters.minHp}</span>
                </div>
                <div className="h-px w-4 bg-[#3B4CCA]/20" />
                <div className="bg-[#3B4CCA]/5 px-3 py-1 rounded-lg border border-[#3B4CCA]/10">
                  <span className="text-[10px] font-black text-[#3B4CCA] uppercase opacity-40 mr-2">Max</span>
                  <span className="text-sm font-black text-[#3B4CCA]">{filters.maxHp}</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterPanel;
