import React, { createContext, useState, useContext, ReactNode } from "react";

// Définir les types d'identifiants de curseur possibles
export type CursorStyleId =
  | "pokeball"
  | "rotating"
  | "masterball"
  | "safari"
  | null;

// Définir la forme du contexte
interface CursorContextProps {
  selectedCursorId: CursorStyleId;
  setSelectedCursorId: (id: CursorStyleId) => void;
}

// Créer le contexte avec une valeur par défaut
const CursorContext = createContext<CursorContextProps | undefined>(undefined);

// Créer le fournisseur de contexte
export const CursorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedCursorId, setSelectedCursorId] = useState<CursorStyleId>(null); // Pas de curseur personnalisé par défaut

  return (
    <CursorContext.Provider value={{ selectedCursorId, setSelectedCursorId }}>
      {children}
    </CursorContext.Provider>
  );
};

// Créer un hook personnalisé pour utiliser le contexte
export const useCursor = () => {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return context;
};
