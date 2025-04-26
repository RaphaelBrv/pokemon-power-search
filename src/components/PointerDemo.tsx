import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pointer } from "@/components/ui/pointer";
import { motion } from "framer-motion";
import { useCursor, CursorStyleId } from "@/contexts/CursorContext";
import { Button } from "@/components/ui/button";

const getCursorVisual = (id: CursorStyleId): React.ReactNode => {
  switch (id) {
    case "pokeball":
      return (
        <svg
          width="30"
          height="30"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="18" fill="#FF0000" />
          <rect x="1" y="18" width="38" height="4" fill="#000000" />
          <circle
            cx="20"
            cy="20"
            r="6"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2"
          />
          <circle
            cx="20"
            cy="20"
            r="3"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="1"
          />
        </svg>
      );
    case "rotating":
      return (
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="18" fill="#FF0000" />
            <rect x="1" y="18" width="38" height="4" fill="#000000" />
            <circle
              cx="20"
              cy="20"
              r="6"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="2"
            />
            <circle
              cx="20"
              cy="20"
              r="3"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      );
    case "masterball":
      return (
        <svg
          width="30"
          height="30"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="18" fill="#7B2CBF" />
          <rect x="1" y="18" width="38" height="4" fill="#000000" />
          <circle
            cx="20"
            cy="20"
            r="6"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2"
          />
          <circle cx="20" cy="20" r="2" fill="#FFFFFF" />
          <path d="M8 12 L12 8 L16 12 L12 16 Z" fill="#FF0000" />
          <path d="M28 12 L32 8 L36 12 L32 16 Z" fill="#FF0000" />
        </svg>
      );
    case "safari":
      return (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="18" fill="#4D924B" />
            <rect x="1" y="18" width="38" height="4" fill="#000000" />
            <path d="M10 10 L14 6 L18 10 L14 14 Z" fill="#7A542E" />
            <path d="M22 10 L26 6 L30 10 L26 14 Z" fill="#7A542E" />
            <circle
              cx="20"
              cy="20"
              r="6"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="2"
            />
            <circle
              cx="20"
              cy="20"
              r="3"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      );
    default:
      return null;
  }
};

export function PointerDemo() {
  const { selectedCursorId, setSelectedCursorId } = useCursor();

  const renderCard = (
    id: CursorStyleId,
    title: string,
    description: string,
    gradient: string,
    textColor: string
  ) => {
    const isSelected = selectedCursorId === id;
    return (
      <Card
        className={`col-span-1 row-span-1 overflow-hidden border transition-all shadow-sm cursor-pointer hover:shadow-lg ${gradient} ${
          isSelected ? "ring-2 ring-offset-2 ring-yellow-400" : ""
        }`}
        onClick={() => setSelectedCursorId(id)}
      >
        <CardHeader className="relative pb-2">
          <CardTitle className={`text-xl font-bold ${textColor}`}>
            {title}
          </CardTitle>
          <CardDescription className={`text-sm ${textColor}/80`}>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative flex h-24 items-center justify-center p-6">
          {getCursorVisual(id)}
        </CardContent>
        <div className="p-4 pt-0 text-center">
          <Button
            variant={isSelected ? "secondary" : "outline"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCursorId(id);
            }}
          >
            {isSelected ? "Sélectionné" : "Choisir ce curseur"}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {renderCard(
          "pokeball",
          "Pokeball Classique",
          "Le curseur Pokeball standard animé.",
          "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800",
          "text-red-800 dark:text-red-200"
        )}
        {renderCard(
          "rotating",
          "Pokeball Rotative",
          "Une Pokeball qui tourne sur elle-même.",
          "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800",
          "text-blue-800 dark:text-blue-200"
        )}
        {renderCard(
          "masterball",
          "Masterball",
          "Le curseur Masterball personnalisé.",
          "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800",
          "text-purple-800 dark:text-purple-200"
        )}
        {renderCard(
          "safari",
          "Safari Ball",
          "Curseur Safari Ball avec pulsation.",
          "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800",
          "text-green-800 dark:text-green-200"
        )}
      </div>
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => setSelectedCursorId(null)}
          disabled={selectedCursorId === null}
        >
          Désactiver le curseur personnalisé
        </Button>
      </div>
    </div>
  );
}
