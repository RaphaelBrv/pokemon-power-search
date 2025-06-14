import React, { Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserPokedex from "./UserPokedex";
import "./Hero.css";

// Lazy load du composant 3D lourd (Three.js)
const Pokeball3D = lazy(() => import("./Pokeball3D"));

const Hero: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="text-center py-8 sm:py-12">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
        Pokémon Power Search
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto px-4">
        Découvrez et collectionnez vos cartes Pokémon préférées avec notre
        moteur de recherche puissant et intuitif.
      </p>

      {/* Lazy loading du composant 3D avec fallback */}
      <Suspense
        fallback={
          <div className="w-full h-64 sm:h-80 mx-auto max-w-xl my-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
            <div className="text-white text-xl font-bold">🔴</div>
          </div>
        }
      >
        <Pokeball3D className="w-full h-64 sm:h-80 mx-auto max-w-xl my-8" />
      </Suspense>

      {/* Bouton vers le pokédex */}
      {user ? (
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>Votre collection personnelle vous attend !</span>
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </div>

          <div className="hero-pokedex-wrapper">
            <UserPokedex />
          </div>

          <p className="text-xs text-gray-500 max-w-md">
            Consultez votre collection, gérez vos cartes et suivez vos
            statistiques
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <span>Connectez-vous pour créer votre pokédex personnel</span>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            disabled
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Pokédex Personnel
          </Button>

          <p className="text-xs text-gray-500 max-w-md">
            Créez un compte pour sauvegarder vos cartes préférées et suivre
            votre collection
          </p>
        </div>
      )}
    </div>
  );
};

export default Hero;
