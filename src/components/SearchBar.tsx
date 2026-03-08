import * as React from "react";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

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
      className="flex flex-col sm:flex-row gap-3 mx-auto max-w-3xl"
    >
      <div className="relative flex-grow group">
        <motion.div 
          whileFocus={{ scale: 1.01 }}
          className="relative"
        >
          <Input
            ref={inputRef}
            type="text"
            placeholder="Pikachu, Dracaufeu, #25..."
            value={query}
            onChange={handleQueryChange}
            className="w-full h-14 pl-5 pr-12 rounded-2xl border-2 border-[#3B4CCA]/20 focus:border-[#3B4CCA] focus:ring-4 focus:ring-[#3B4CCA]/10 shadow-lg text-lg font-bold placeholder:text-gray-300 transition-all bg-white"
            disabled={isLoading}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FF0000] transition-colors"
              disabled={isLoading}
            >
              <X size={20} className="stroke-[3px]" />
            </button>
          )}
        </motion.div>
      </div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          type="submit"
          className="h-14 px-8 font-black text-lg bg-[#3B4CCA] hover:bg-[#2A3990] text-white rounded-2xl shadow-[0_4px_0_rgb(42,57,144)] active:shadow-none active:translate-y-1 transition-all flex items-center gap-2"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Search className="h-5 w-5 stroke-[3px]" />
              ATTRAPER
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
};

export default SearchBar;
