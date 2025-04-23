import React from "react";
import { useToast } from "@/hooks/use-toast";
import SearchBar from "@/components/SearchBar";
import PokemonCard from "@/components/PokemonCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingMessage from "@/components/LoadingMessage";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import FAQ from "@/components/FAQ";

// Logs pour le débogage
console.log("Initialisation du composant Index");

// Définition du type pour un Pokémon
interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
  species: {
    url: string;
    name: string;
  };
}

// Interface pour les informations de l'espèce
interface PokemonSpecies {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
  evolution_chain: {
    url: string;
  };
  genera: Array<{
    genus: string;
    language: {
      name: string;
    };
  }>;
}

// Interface pour la chaîne d'évolution
interface EvolutionChain {
  chain: EvolutionStage;
}

interface EvolutionStage {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionStage[];
}

// Interface pour les données complètes du Pokémon
interface PokemonWithDetails {
  pokemon: Pokemon;
  species: PokemonSpecies;
  evolutions: Array<{
    name: string;
    id: number;
    image: string;
  }>;
  description: string;
  category: string;
}

// Type pour les entrées de flavor text
interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
  };
}

// Type pour les genera
interface GenusEntry {
  genus: string;
  language: {
    name: string;
  };
}

const Index = () => {
  const [pokemonList, setPokemonList] = React.useState<PokemonWithDetails[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const searchPokemon = async (query: string) => {
    console.log("Recherche de Pokémon:", query);
    setIsLoading(true);
    setPokemonList([]);

    try {
      // Vérifier si la requête contient plusieurs Pokémon séparés par des virgules
      const pokemonQueries = query
        .split(",")
        .map((q) => q.trim().toLowerCase());

      // Tableau pour stocker les résultats
      const detailedResults: PokemonWithDetails[] = [];

      // Pour chaque Pokémon dans la requête
      for (const pokemonName of pokemonQueries) {
        console.log(`Recherche de ${pokemonName} via l'API fetch directe`);

        // Récupérer les données du Pokémon
        const pokemonResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );
        if (!pokemonResponse.ok) {
          console.error(
            `Erreur lors de la récupération de ${pokemonName}:`,
            pokemonResponse.statusText
          );
          throw new Error(`Pokémon ${pokemonName} non trouvé`);
        }
        const pokemonData = (await pokemonResponse.json()) as Pokemon;
        console.log(`Données de ${pokemonName} récupérées:`, pokemonData);

        // Récupérer les informations de l'espèce
        const speciesResponse = await fetch(pokemonData.species.url);
        if (!speciesResponse.ok) {
          console.error(
            `Erreur lors de la récupération des infos d'espèce pour ${pokemonName}:`,
            speciesResponse.statusText
          );
          throw new Error(
            `Informations d'espèce pour ${pokemonName} non trouvées`
          );
        }
        const speciesData = (await speciesResponse.json()) as PokemonSpecies;
        console.log(
          `Informations d'espèce pour ${pokemonName} récupérées:`,
          speciesData
        );

        // Obtenir la description en français
        const frenchDescription =
          speciesData.flavor_text_entries
            .find((entry: FlavorTextEntry) => entry.language.name === "fr")
            ?.flavor_text.replace(/\f/g, " ") || "Description non disponible";

        // Obtenir la catégorie en français
        const frenchCategory =
          speciesData.genera.find(
            (genus: GenusEntry) => genus.language.name === "fr"
          )?.genus || "Pokémon";

        // Récupérer la chaîne d'évolution
        const evolutionChainResponse = await fetch(
          speciesData.evolution_chain.url
        );
        if (!evolutionChainResponse.ok) {
          console.error(
            `Erreur lors de la récupération de la chaîne d'évolution pour ${pokemonName}:`,
            evolutionChainResponse.statusText
          );
          throw new Error(`Chaîne d'évolution pour ${pokemonName} non trouvée`);
        }
        const evolutionChainData =
          (await evolutionChainResponse.json()) as EvolutionChain;
        console.log(
          `Chaîne d'évolution pour ${pokemonName} récupérée:`,
          evolutionChainData
        );

        // Extraire les évolutions
        const evolutions: Array<{ name: string; id: number; image: string }> =
          [];

        // Fonction récursive pour parcourir la chaîne d'évolution
        const getEvolutionData = async (stage: EvolutionStage) => {
          const speciesUrl = stage.species.url;
          const speciesId = parseInt(
            speciesUrl.split("/").filter(Boolean).pop() || "0"
          );

          // Récupérer les données du Pokémon pour obtenir l'image
          try {
            const evoResponse = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${stage.species.name}`
            );
            if (evoResponse.ok) {
              const evoPokemon = (await evoResponse.json()) as Pokemon;
              evolutions.push({
                name: stage.species.name,
                id: speciesId,
                image: evoPokemon.sprites.front_default || "",
              });
            }
          } catch (error) {
            console.error(
              `Erreur lors de la récupération du Pokémon ${stage.species.name}:`,
              error
            );
          }

          // Récursion pour les évolutions suivantes
          if (stage.evolves_to && stage.evolves_to.length > 0) {
            for (const evolution of stage.evolves_to) {
              await getEvolutionData(evolution);
            }
          }
        };

        // Commencer par le premier stade d'évolution
        await getEvolutionData(evolutionChainData.chain);

        // Ajouter les détails au tableau des résultats
        detailedResults.push({
          pokemon: pokemonData,
          species: speciesData,
          evolutions,
          description: frenchDescription,
          category: frenchCategory,
        });
      }

      setPokemonList(detailedResults);
      toast({
        title:
          pokemonQueries.length > 1
            ? "Pokémon identifiés !"
            : "Pokémon identifié !",
        description:
          pokemonQueries.length > 1
            ? `${detailedResults.length} Pokémon trouvés.`
            : `Votre aventure avec ${detailedResults[0].pokemon.name} commence !`,
      });
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast({
        variant: "destructive",
        title: "Hmm, nos détecteurs restent silencieux...",
        description:
          "Ce(s) Pokémon semble(nt) se cacher dans les hautes herbes les plus reculées ! Vérifiez l'orthographe de votre recherche.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4">
        <Hero />

        <div className="text-center mb-8">
          <p className="text-xl text-gray-700 mb-6">
            Quel(s) Pokémon captive(nt) vos pensées aujourd'hui ? Tapez un nom,
            un numéro ou plusieurs Pokémon séparés par des virgules !
          </p>
          <SearchBar onSearch={searchPokemon} isLoading={isLoading} />
        </div>

        <div className="mt-8 mb-12">
          {isLoading && (
            <div className="space-y-4">
              <LoadingSpinner />
              <LoadingMessage />
            </div>
          )}

          {/* Affichage des Pokémon trouvés */}
          {pokemonList.length > 0 && !isLoading && (
            <div className="grid grid-cols-1 gap-8">
              {pokemonList.map((pokemonData, index) => (
                <div key={index} className="pokemon-container">
                  <PokemonCard pokemon={pokemonData.pokemon} />

                  {/* Affichage de la description */}
                  <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700">{pokemonData.description}</p>
                    <p className="text-gray-500 mt-1">{pokemonData.category}</p>
                  </div>

                  {/* Affichage des évolutions */}
                  {pokemonData.evolutions.length > 0 && (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-2">
                        Chaîne d'évolution
                      </h3>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {pokemonData.evolutions.map((evolution, idx) => (
                          <div key={idx} className="text-center">
                            <img
                              src={evolution.image}
                              alt={evolution.name}
                              className="w-24 h-24 mx-auto"
                            />
                            <p className="capitalize text-sm">
                              {evolution.name}
                            </p>
                            {idx < pokemonData.evolutions.length - 1 && (
                              <div className="mx-2 text-2xl">→</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <FAQ />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
