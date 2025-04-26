import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { SearchHistoryItem } from "@/types/pokemon";

interface SearchHistoryContextProps {
  searchHistory: SearchHistoryItem[];
  addSearchToHistory: (query: string, resultCount: number) => void;
  clearHistory: () => void;
  removeSearchItem: (id: string) => void;
}

const SearchHistoryContext = createContext<
  SearchHistoryContextProps | undefined
>(undefined);

export const useSearchHistory = () => {
  const context = useContext(SearchHistoryContext);
  if (!context) {
    throw new Error(
      "useSearchHistory doit être utilisé à l'intérieur d'un SearchHistoryProvider"
    );
  }
  return context;
};

export const SearchHistoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  // Charger l'historique depuis le localStorage au montage
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("pokemonSearchHistory");
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        // Convertir les timestamps en objets Date
        const formattedHistory = parsedHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setSearchHistory(formattedHistory);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
    }
  }, []);

  // Sauvegarder l'historique dans le localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(
        "pokemonSearchHistory",
        JSON.stringify(searchHistory)
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'historique:", error);
    }
  }, [searchHistory]);

  const addSearchToHistory = (query: string, resultCount: number) => {
    const newItem: SearchHistoryItem = {
      id: uuidv4(),
      query,
      timestamp: new Date(),
      resultCount,
    };

    // Limiter l'historique à 20 entrées en conservant les plus récentes
    setSearchHistory((prev) => [newItem, ...prev].slice(0, 20));
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const removeSearchItem = (id: string) => {
    setSearchHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <SearchHistoryContext.Provider
      value={{
        searchHistory,
        addSearchToHistory,
        clearHistory,
        removeSearchItem,
      }}
    >
      {children}
    </SearchHistoryContext.Provider>
  );
};

export default SearchHistoryProvider;
