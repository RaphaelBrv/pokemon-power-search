import React, { createContext, useContext, useState, useEffect } from "react";
import { PokemonCard } from "@/types/pokemon";

interface FavoritesContextProps {
  favorites: PokemonCard[];
  addFavorite: (card: PokemonCard) => void;
  removeFavorite: (cardId: string) => void;
  isFavorite: (cardId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(
  undefined
);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error(
      "useFavorites doit être utilisé à l'intérieur d'un FavoritesProvider"
    );
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<PokemonCard[]>([]);

  // Charger les favoris depuis le localStorage au montage
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("pokemonFavorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
    }
  }, []);

  // Sauvegarder les favoris dans le localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem("pokemonFavorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des favoris:", error);
    }
  }, [favorites]);

  const addFavorite = (card: PokemonCard) => {
    if (!isFavorite(card.id)) {
      setFavorites((prev) => [...prev, card]);
    }
  };

  const removeFavorite = (cardId: string) => {
    setFavorites((prev) => prev.filter((card) => card.id !== cardId));
  };

  const isFavorite = (cardId: string) => {
    return favorites.some((card) => card.id === cardId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
