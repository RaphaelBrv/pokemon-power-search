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
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Filtres</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="text-xs sm:text-sm w-full sm:w-auto"
        >
          Réinitialiser
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["types", "hp"]}>
        {/* Filtre par type */}
        <AccordionItem value="types">
          <AccordionTrigger className="text-sm font-medium py-2 sm:py-3">
            Types de Pokémon
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto pr-2">
              {availableOptions.types.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.types.includes(type)}
                    onCheckedChange={(checked) =>
                      updateTypeFilter(type, checked === true)
                    }
                  />
                  <Label
                    htmlFor={`type-${type}`}
                    className="text-xs sm:text-sm cursor-pointer flex-1"
                  >
                    {type}
                  </Label>
                </div>
              ))}
              {availableOptions.types.length === 0 && (
                <p className="text-xs sm:text-sm text-gray-500 italic">
                  Aucun type disponible
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Filtre par rareté */}
        <AccordionItem value="rarity">
          <AccordionTrigger className="text-sm font-medium py-2 sm:py-3">
            Raretés
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto pr-2">
              {availableOptions.rarities.map((rarity) => (
                <div key={rarity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rarity-${rarity}`}
                    checked={filters.rarities.includes(rarity)}
                    onCheckedChange={(checked) =>
                      updateRarityFilter(rarity, checked === true)
                    }
                  />
                  <Label
                    htmlFor={`rarity-${rarity}`}
                    className="text-xs sm:text-sm cursor-pointer flex-1"
                  >
                    {rarity}
                  </Label>
                </div>
              ))}
              {availableOptions.rarities.length === 0 && (
                <p className="text-xs sm:text-sm text-gray-500 italic">
                  Aucune rareté disponible
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Filtre par extension */}
        <AccordionItem value="sets">
          <AccordionTrigger className="text-sm font-medium py-2 sm:py-3">
            Extensions
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto pr-2">
              {availableOptions.sets.map((set) => (
                <div key={set} className="flex items-center space-x-2">
                  <Checkbox
                    id={`set-${set}`}
                    checked={filters.sets.includes(set)}
                    onCheckedChange={(checked) =>
                      updateSetFilter(set, checked === true)
                    }
                  />
                  <Label
                    htmlFor={`set-${set}`}
                    className="text-xs sm:text-sm cursor-pointer flex-1 break-words"
                  >
                    {set}
                  </Label>
                </div>
              ))}
              {availableOptions.sets.length === 0 && (
                <p className="text-xs sm:text-sm text-gray-500 italic">
                  Aucune extension disponible
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Filtre par points de vie */}
        <AccordionItem value="hp">
          <AccordionTrigger className="text-sm font-medium py-2 sm:py-3">
            Points de vie (HP)
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <Slider
                defaultValue={[filters.minHp, filters.maxHp]}
                min={0}
                max={availableOptions.maxHp}
                step={10}
                value={[filters.minHp, filters.maxHp]}
                onValueChange={(values) => updateHpRange(values[0], values[1])}
                className="mb-4"
              />
              <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                <span>Min: {filters.minHp}</span>
                <span>Max: {filters.maxHp}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterPanel;
