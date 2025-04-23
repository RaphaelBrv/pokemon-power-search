
import React from 'react';
import { Separator } from "./ui/separator";

const Footer = () => {
  return (
    <footer className="mt-20 pb-8 text-gray-600">
      <Separator className="mb-8" />
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <p className="text-sm">
          © 2025 - Pokédex Passionné - Tous droits réservés comme une Poké Ball bien lancée.
        </p>
        <p className="text-xs">
          Données fournies avec passion par PokeAPI V2 - Aussi fiable que le Professeur Chen !
        </p>
        <p className="text-sm font-medium text-gray-700 mt-4">
          N'oubliez jamais : pour devenir Maître Pokémon, il faut observer, apprendre et surtout... s'amuser. 
          Votre aventure ne fait que commencer, Dresseurs !
        </p>
      </div>
    </footer>
  );
};

export default Footer;

