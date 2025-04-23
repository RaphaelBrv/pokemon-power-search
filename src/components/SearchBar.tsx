import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

// Liste des premiers 151 Pokémon pour l'autocomplétion
const popularPokemon = [
  "bulbasaur",
  "ivysaur",
  "venusaur",
  "charmander",
  "charmeleon",
  "charizard",
  "squirtle",
  "wartortle",
  "blastoise",
  "caterpie",
  "metapod",
  "butterfree",
  "weedle",
  "kakuna",
  "beedrill",
  "pidgey",
  "pidgeotto",
  "pidgeot",
  "rattata",
  "raticate",
  "spearow",
  "fearow",
  "ekans",
  "arbok",
  "pikachu",
  "raichu",
  "sandshrew",
  "sandslash",
  "nidoran-f",
  "nidorina",
  "nidoqueen",
  "nidoran-m",
  "nidorino",
  "nidoking",
  "clefairy",
  "clefable",
  "vulpix",
  "ninetales",
  "jigglypuff",
  "wigglytuff",
  "zubat",
  "golbat",
  "oddish",
  "gloom",
  "vileplume",
  "paras",
  "parasect",
  "venonat",
  "venomoth",
  "diglett",
  "dugtrio",
  "meowth",
  "persian",
  "psyduck",
  "golduck",
  "mankey",
  "primeape",
  "growlithe",
  "arcanine",
  "poliwag",
  "poliwhirl",
  "poliwrath",
  "abra",
  "kadabra",
  "alakazam",
  "machop",
  "machoke",
  "machamp",
  "bellsprout",
  "weepinbell",
  "victreebel",
  "tentacool",
  "tentacruel",
  "geodude",
  "graveler",
  "golem",
  "ponyta",
  "rapidash",
  "slowpoke",
  "slowbro",
  "magnemite",
  "magneton",
  "farfetchd",
  "doduo",
  "dodrio",
  "seel",
  "dewgong",
  "grimer",
  "muk",
  "shellder",
  "cloyster",
  "gastly",
  "haunter",
  "gengar",
  "onix",
  "drowzee",
  "hypno",
  "krabby",
  "kingler",
  "voltorb",
  "electrode",
  "exeggcute",
  "exeggutor",
  "cubone",
  "marowak",
  "hitmonlee",
  "hitmonchan",
  "lickitung",
  "koffing",
  "weezing",
  "rhyhorn",
  "rhydon",
  "chansey",
  "tangela",
  "kangaskhan",
  "horsea",
  "seadra",
  "goldeen",
  "seaking",
  "staryu",
  "starmie",
  "mr-mime",
  "scyther",
  "jynx",
  "electabuzz",
  "magmar",
  "pinsir",
  "tauros",
  "magikarp",
  "gyarados",
  "lapras",
  "ditto",
  "eevee",
  "vaporeon",
  "jolteon",
  "flareon",
  "porygon",
  "omanyte",
  "omastar",
  "kabuto",
  "kabutops",
  "aerodactyl",
  "snorlax",
  "articuno",
  "zapdos",
  "moltres",
  "dratini",
  "dragonair",
  "dragonite",
  "mewtwo",
  "mew",
];

// Traduction française des noms populaires pour l'affichage
const frenchNames: Record<string, string> = {
  bulbasaur: "Bulbizarre",
  ivysaur: "Herbizarre",
  venusaur: "Florizarre",
  charmander: "Salamèche",
  charmeleon: "Reptincel",
  charizard: "Dracaufeu",
  squirtle: "Carapuce",
  wartortle: "Carabaffe",
  blastoise: "Tortank",
  pikachu: "Pikachu",
  eevee: "Évoli",
  mew: "Mew",
  mewtwo: "Mewtwo",
  zapdos: "Électhor",
  articuno: "Artikodin",
  moltres: "Sulfura",
  dragonite: "Dracolosse",
  snorlax: "Ronflex",
  gengar: "Ectoplasma",
  gyarados: "Léviator",
  lapras: "Lokhlass",
  vaporeon: "Aquali",
  jolteon: "Voltali",
  flareon: "Pyroli",
  ditto: "Métamorph",
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Mettre à jour les suggestions quand la recherche change
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Filtrer les Pokémon qui correspondent à la requête
    // Si la requête contient des virgules, ne considérer que la dernière partie
    const currentQuery = query.split(",").pop()?.trim().toLowerCase() || "";

    if (currentQuery.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const filtered = popularPokemon
      .filter((pokemon) => pokemon.includes(currentQuery))
      .slice(0, 5); // Limiter à 5 suggestions

    setSuggestions(filtered);
    setIsOpen(filtered.length > 0);
  }, [query]);

  // Fermer les suggestions en cas de clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Si la recherche contient déjà des virgules, remplacer seulement la dernière partie
    const parts = query.split(",");
    if (parts.length > 1) {
      parts[parts.length - 1] = ` ${suggestion}`;
      setQuery(parts.join(","));
    } else {
      setQuery(suggestion);
    }
    setIsOpen(false);

    // Donner le focus à l'input après la sélection
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Fonction pour obtenir le nom français si disponible
  const getDisplayName = (pokemonName: string) => {
    return frenchNames[pokemonName]
      ? `${frenchNames[pokemonName]} (${pokemonName})`
      : pokemonName;
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-2 mx-auto max-w-2xl"
    >
      <div className="relative flex-grow">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Nom du Pokémon ou #ID (ex: pikachu, 25, dracaufeu,salamèche)"
                value={query}
                onChange={handleQueryChange}
                className="w-full h-12 pl-4 pr-10 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
                disabled={isLoading}
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent
            ref={popoverRef}
            className="p-0 w-[300px] sm:w-full"
            sideOffset={5}
            align="start"
          >
            <div className="py-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none capitalize"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {getDisplayName(suggestion)}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Button
        type="submit"
        className="h-12 px-6 font-medium bg-blue-600 hover:bg-blue-700"
        disabled={isLoading || !query.trim()}
      >
        <Search className="mr-2 h-4 w-4" />
        {isLoading ? "Recherche..." : "Rechercher"}
      </Button>
    </form>
  );
};

export default SearchBar;
