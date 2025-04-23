
import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import SearchBar from '@/components/SearchBar';
import PokemonCard from '@/components/PokemonCard';
import LoadingSpinner from '@/components/LoadingSpinner';

const Index = () => {
  const [pokemon, setPokemon] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const searchPokemon = async (query: string) => {
    setIsLoading(true);
    setPokemon(null);

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
      if (!response.ok) {
        throw new Error('Pokémon non trouvé');
      }
      const data = await response.json();
      setPokemon(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de trouver ce Pokémon. Vérifiez l'orthographe et réessayez.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Pokémon Search
        </h1>
        
        <SearchBar onSearch={searchPokemon} isLoading={isLoading} />
        
        <div className="mt-8">
          {isLoading && <LoadingSpinner />}
          {pokemon && !isLoading && <PokemonCard pokemon={pokemon} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
