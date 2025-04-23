
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import SearchBar from '@/components/SearchBar';
import PokemonCard from '@/components/PokemonCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import LoadingMessage from '@/components/LoadingMessage';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import FAQ from '@/components/FAQ';

const Index = () => {
  const [pokemon, setPokemon] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const searchPokemon = async (query: string) => {
    setIsLoading(true);
    setPokemon(null);

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokémon non trouvé');
      }
      const data = await response.json();
      setPokemon(data);
      toast({
        title: "Pokémon identifié !",
        description: `Votre aventure avec ${data.name} commence !`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hmm, nos détecteurs restent silencieux...",
        description: "Ce Pokémon semble se cacher dans les hautes herbes les plus reculées ! Vérifiez l'orthographe de votre recherche.",
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
            Quel Pokémon captive vos pensées aujourd'hui ? 
            Tapez son nom ou son numéro et laissez la magie opérer !
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
          {pokemon && !isLoading && <PokemonCard pokemon={pokemon} />}
        </div>

        <FAQ />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
