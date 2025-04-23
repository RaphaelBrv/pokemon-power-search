
import React from 'react';
import { Card } from "@/components/ui/card";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

interface PokemonCardProps {
  pokemon: Pokemon;
}

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-200",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-blue-300",
  psychic: "bg-pink-500",
  bug: "bg-green-400",
  rock: "bg-yellow-700",
  ghost: "bg-purple-700",
  dragon: "bg-blue-600",
  dark: "bg-gray-700",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  const translateStatName = (name: string): string => {
    const translations: Record<string, string> = {
      "hp": "PV",
      "attack": "Attaque",
      "defense": "Défense",
      "special-attack": "Attaque Spé.",
      "special-defense": "Défense Spé.",
      "speed": "Vitesse"
    };
    return translations[name] || name;
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 transform hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-white to-gray-100 border-2 border-gray-200">
      <div className="text-center">
        <h2 className="text-2xl font-bold capitalize mb-4 text-gray-800">
          {pokemon.name} #{pokemon.id.toString().padStart(3, '0')}
        </h2>
        
        <div className="relative w-48 h-48 mx-auto mb-4">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {pokemon.types.map(({ type }) => (
            <span
              key={type.name}
              className={`${typeColors[type.name]} px-3 py-1 rounded-full text-white text-sm capitalize`}
            >
              {type.name}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {pokemon.stats.map(({ base_stat, stat }) => (
            <div key={stat.name} className="text-left">
              <div className="text-sm text-gray-600">{translateStatName(stat.name)}</div>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${(base_stat / 255) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{base_stat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PokemonCard;
