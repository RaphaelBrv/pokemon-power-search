import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { SortOption, SortDirection, SortSettings } from "@/types/pokemon";

interface SortPanelProps {
  sortSettings: SortSettings;
  updateSortSettings: (newSettings: Partial<SortSettings>) => void;
}

const SortPanel: React.FC<SortPanelProps> = ({
  sortSettings,
  updateSortSettings,
}) => {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "name", label: "Nom" },
    { value: "hp", label: "Points de vie" },
    { value: "rarity", label: "Rareté" },
    { value: "releaseDate", label: "Date de sortie" },
  ];

  const toggleDirection = () => {
    updateSortSettings({
      direction: sortSettings.direction === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Trier par</h3>

      <div className="flex items-center space-x-2">
        <Select
          value={sortSettings.option}
          onValueChange={(value) =>
            updateSortSettings({ option: value as SortOption })
          }
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Sélectionner un critère" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleDirection}
          title={
            sortSettings.direction === "asc"
              ? "Ordre croissant"
              : "Ordre décroissant"
          }
        >
          {sortSettings.direction === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="mt-3 text-sm text-gray-500">
        <p className="flex items-center">
          <span>Tri actuel: </span>
          <span className="font-medium ml-1">
            {sortOptions.find((o) => o.value === sortSettings.option)?.label}
            {sortSettings.direction === "asc"
              ? " (croissant)"
              : " (décroissant)"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SortPanel;
