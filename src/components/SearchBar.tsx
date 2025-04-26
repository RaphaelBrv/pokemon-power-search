import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const clearSearch = () => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-2 mx-auto max-w-2xl"
    >
      <div className="relative flex-grow">
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
