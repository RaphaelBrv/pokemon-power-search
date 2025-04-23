
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const FAQ = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-[#3B4CCA]/10">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#3B4CCA]">Questions Fréquentes</h2>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Comment utiliser le Pokédex ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Il suffit de taper le nom ou le numéro d'un Pokémon dans la barre de recherche. 
                Notre Pokédex s'occupe du reste et vous affiche toutes les informations disponibles !
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>D'où viennent les données ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Nous utilisons l'API PokeAPI V2, la source la plus fiable et complète d'informations sur les Pokémon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Je ne trouve pas mon Pokémon ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Vérifiez l'orthographe du nom ou essayez d'utiliser le numéro du Pokédex. 
                Si le problème persiste, il se peut que ce Pokémon soit d'une génération très récente !
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
