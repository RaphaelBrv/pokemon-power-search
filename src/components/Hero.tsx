import React, { Suspense, lazy } from "react";

// Lazy load du composant 3D lourd (Three.js)
const Pokeball3D = lazy(() => import("./Pokeball3D"));

const Hero: React.FC = () => {
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
    </div>
  );
};

export default Hero;
