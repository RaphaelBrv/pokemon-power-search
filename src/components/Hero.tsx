
import React from 'react';
import { Card } from "./ui/card";

const Hero = () => {
  return (
    <div className="text-center space-y-6 mb-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        La Grande Aventure Pokédex : Votre Portail vers le Monde des Pokémon
      </h1>
      
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Bienvenue, cher Dresseur, dans le monde extraordinaire des Pokémon ! 
        Que vous soyez un Champion d'Arène expérimenté ou que vous receviez aujourd'hui votre tout premier Pokémon, 
        ce Pokédex interactif sera votre compagnon fidèle. Explorez les caractéristiques, découvrez les types 
        et plongez dans l'univers fascinant de ces créatures merveilleuses. 
        Votre quête de connaissance commence maintenant !
      </p>

      <Card className="bg-yellow-50 p-6 max-w-2xl mx-auto">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-2xl">✨</span>
          <h3 className="text-xl font-semibold">Le Saviez-vous ?</h3>
        </div>
        <p className="text-gray-700">
          Saviez-vous que Rondoudou, avec sa voix mélodieuse, peut endormir n'importe quel Pokémon en quelques secondes ? 
          Même les plus puissants Dracolosse ne peuvent résister à sa berceuse ! 
          Quelle autre merveille allez-vous découvrir aujourd'hui ?
        </p>
      </Card>
    </div>
  );
};

export default Hero;

