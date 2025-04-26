import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { PokemonDeck } from "@/types/pokemon";

interface DeckContextProps {
  decks: PokemonDeck[];
  createDeck: (name: string, description: string) => PokemonDeck;
  updateDeck: (updatedDeck: PokemonDeck) => void;
  deleteDeck: (deckId: string) => void;
  addCardToDeck: (deckId: string, cardId: string, quantity?: number) => void;
  removeCardFromDeck: (deckId: string, cardId: string) => void;
  updateCardQuantity: (
    deckId: string,
    cardId: string,
    quantity: number
  ) => void;
  getDeckById: (deckId: string) => PokemonDeck | undefined;
}

const DeckContext = createContext<DeckContextProps | undefined>(undefined);

export const useDecks = () => {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error(
      "useDecks doit être utilisé à l'intérieur d'un DeckProvider"
    );
  }
  return context;
};

export const DeckProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [decks, setDecks] = useState<PokemonDeck[]>([]);

  // Charger les decks depuis le localStorage au montage
  useEffect(() => {
    try {
      const storedDecks = localStorage.getItem("pokemonDecks");
      if (storedDecks) {
        const parsedDecks = JSON.parse(storedDecks);
        // Convertir les timestamps en objets Date
        const formattedDecks = parsedDecks.map((deck: any) => ({
          ...deck,
          createdAt: new Date(deck.createdAt),
          updatedAt: new Date(deck.updatedAt),
        }));
        setDecks(formattedDecks);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des decks:", error);
    }
  }, []);

  // Sauvegarder les decks dans le localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem("pokemonDecks", JSON.stringify(decks));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des decks:", error);
    }
  }, [decks]);

  const createDeck = (name: string, description: string): PokemonDeck => {
    const now = new Date();
    const newDeck: PokemonDeck = {
      id: uuidv4(),
      name,
      description,
      createdAt: now,
      updatedAt: now,
      cards: [],
    };

    setDecks((prev) => [...prev, newDeck]);
    return newDeck;
  };

  const updateDeck = (updatedDeck: PokemonDeck) => {
    const now = new Date();
    setDecks((prev) =>
      prev.map((deck) =>
        deck.id === updatedDeck.id ? { ...updatedDeck, updatedAt: now } : deck
      )
    );
  };

  const deleteDeck = (deckId: string) => {
    setDecks((prev) => prev.filter((deck) => deck.id !== deckId));
  };

  const getDeckById = (deckId: string) => {
    return decks.find((deck) => deck.id === deckId);
  };

  const addCardToDeck = (deckId: string, cardId: string, quantity = 1) => {
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== deckId) return deck;

        const existingCardIndex = deck.cards.findIndex(
          (c) => c.cardId === cardId
        );
        const now = new Date();

        if (existingCardIndex >= 0) {
          // Mettre à jour la quantité si la carte existe déjà
          const updatedCards = [...deck.cards];
          updatedCards[existingCardIndex].quantity += quantity;

          return {
            ...deck,
            cards: updatedCards,
            updatedAt: now,
          };
        } else {
          // Ajouter la carte si elle n'existe pas encore
          return {
            ...deck,
            cards: [...deck.cards, { cardId, quantity }],
            updatedAt: now,
          };
        }
      })
    );
  };

  const removeCardFromDeck = (deckId: string, cardId: string) => {
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== deckId) return deck;

        return {
          ...deck,
          cards: deck.cards.filter((c) => c.cardId !== cardId),
          updatedAt: new Date(),
        };
      })
    );
  };

  const updateCardQuantity = (
    deckId: string,
    cardId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeCardFromDeck(deckId, cardId);
      return;
    }

    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== deckId) return deck;

        return {
          ...deck,
          cards: deck.cards.map((c) =>
            c.cardId === cardId ? { ...c, quantity } : c
          ),
          updatedAt: new Date(),
        };
      })
    );
  };

  return (
    <DeckContext.Provider
      value={{
        decks,
        createDeck,
        updateDeck,
        deleteDeck,
        addCardToDeck,
        removeCardFromDeck,
        updateCardQuantity,
        getDeckById,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
};

export default DeckProvider;
