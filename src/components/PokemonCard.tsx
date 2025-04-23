import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


// Mapping des types de Pokémon aux couleurs
const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fighting: "bg-red-700",
  flying: "bg-indigo-300",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  rock: "bg-yellow-700",
  bug: "bg-green-500",
  ghost: "bg-purple-700",
  steel: "bg-gray-500",
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-600",
  electric: "bg-yellow-400",
  psychic: "bg-pink-500",
  ice: "bg-blue-300",
  dragon: "bg-indigo-600",
  dark: "bg-gray-800 text-white",
  fairy: "bg-pink-300",
  unknown: "bg-gray-300",
  shadow: "bg-purple-900 text-white",
};

// Fonction pour formater un nombre avec des zéros au début
const formatNumber = (num: number): string => {
  return num.toString().padStart(3, "0");
};

// Fonction pour convertir les hectogrammes en kg
const convertToKg = (weightInHg: number): string => {
  return (weightInHg / 10).toFixed(1);
};

// Fonction pour convertir les décimètres en mètres
const convertToM = (heightInDm: number): string => {
  return (heightInDm / 10).toFixed(1);
};

// Fonction pour capitaliser la première lettre d'une chaîne
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

interface PokemonCardProps {
  pokemon: {
    id: number;
    name: string;
    sprites: {
      front_default: string;
      other: {
        "official-artwork": {
          front_default: string;
        };
      };
    };
    types: Array<{
      type: {
        name: string;
      };
    }>;
    stats: Array<{
      base_stat: number;
      stat: {
        name: string;
      };
    }>;
    abilities: Array<{
      ability: {
        name: string;
      };
    }>;
    height: number;
    weight: number;
  };
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  // Statut du Pokémon
  const stats = {
    hp: pokemon.stats.find((stat) => stat.stat.name === "hp")?.base_stat || 0,
    attack:
      pokemon.stats.find((stat) => stat.stat.name === "attack")?.base_stat || 0,
    defense:
      pokemon.stats.find((stat) => stat.stat.name === "defense")?.base_stat ||
      0,
    specialAttack:
      pokemon.stats.find((stat) => stat.stat.name === "special-attack")
        ?.base_stat || 0,
    specialDefense:
      pokemon.stats.find((stat) => stat.stat.name === "special-defense")
        ?.base_stat || 0,
    speed:
      pokemon.stats.find((stat) => stat.stat.name === "speed")?.base_stat || 0,
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 transform hover:shadow-lg">
      <CardHeader className="relative pb-0 pt-6">
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="text-sm font-semibold">
            #{formatNumber(pokemon.id)}
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold capitalize">
          {pokemon.name}
        </CardTitle>
        <div className="flex space-x-2 mt-2">
          {pokemon.types.map((type, index) => (
            <Badge
              key={index}
              className={`${
                typeColors[type.type.name] || "bg-gray-500"
              } hover:${typeColors[type.type.name] || "bg-gray-600"}`}
            >
              {capitalize(type.type.name)}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row">
          <div className="text-center md:w-1/3">
            <div className="relative w-48 h-48 mx-auto">
              <img
                src={
                  pokemon.sprites.other["official-artwork"].front_default ||
                  pokemon.sprites.front_default
                }
                alt={pokemon.name}
                className="object-contain"
                width={192}
                height={192}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-100 p-2 rounded-lg">
                <p className="text-gray-500">Taille</p>
                <p className="font-semibold">{convertToM(pokemon.height)} m</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <p className="text-gray-500">Poids</p>
                <p className="font-semibold">
                  {convertToKg(pokemon.weight)} kg
                </p>
              </div>
            </div>
          </div>

          <div className="md:w-2/3 md:pl-6 mt-6 md:mt-0">
            <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
            <div className="space-y-3">
              <StatBar label="PV" value={stats.hp} color="bg-red-400" />
              <StatBar
                label="Attaque"
                value={stats.attack}
                color="bg-orange-400"
              />
              <StatBar
                label="Défense"
                value={stats.defense}
                color="bg-yellow-400"
              />
              <StatBar
                label="Att. Spé"
                value={stats.specialAttack}
                color="bg-blue-400"
              />
              <StatBar
                label="Déf. Spé"
                value={stats.specialDefense}
                color="bg-green-400"
              />
              <StatBar
                label="Vitesse"
                value={stats.speed}
                color="bg-pink-400"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4">
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">Capacités</h3>
          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map((ability, index) => (
              <Badge key={index} variant="secondary" className="capitalize">
                {ability.ability.name.replace("-", " ")}
              </Badge>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

interface StatBarProps {
  label: string;
  value: number;
  color: string;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, color }) => {
  // Calculer le pourcentage (en supposant que 255 est la valeur max pour les stats)
  const percentage = Math.min(100, (value / 255) * 100);

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-medium text-sm">{label}</span>
        <span className="text-sm font-semibold">{value}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default PokemonCard;
