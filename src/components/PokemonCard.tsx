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
  electric: "bg-yellow-400 from-yellow-100",
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

  const mainType = pokemon.types[0]?.type.name || 'normal';
  const isElectric = mainType === 'electric';

  return (
    <Card className={`w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-200 rounded-xl overflow-hidden
      ${isElectric 
        ? 'bg-gradient-to-b from-yellow-100 via-yellow-50 to-yellow-100' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'} 
      border-8 border-gray-300 shadow-xl`}>
      <div className="relative p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
          <span className="font-bold">PV {pokemon.stats[0].base_stat}</span>
        </div>

        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-2 mb-4">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-48 h-48 mx-auto"
          />
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {pokemon.types.map(({ type }) => (
            <span
              key={type.name}
              className={`${typeColors[type.name]} px-3 py-1 rounded-full text-white text-sm font-semibold capitalize shadow`}
            >
              {type.name}
            </span>
          ))}
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            {pokemon.stats.map(({ base_stat, stat }) => (
              <div key={stat.name} className="text-left">
                <div className="text-sm font-semibold text-gray-700">
                  {translateStatName(stat.name)}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${(base_stat / 255) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold">{base_stat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 mt-4">
          #{pokemon.id.toString().padStart(3, '0')}
        </div>
      </div>
    </Card>
  );
};

export default PokemonCard;
