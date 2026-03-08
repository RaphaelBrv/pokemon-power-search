
import { useQuery } from '@tanstack/react-query';
import pokeapi from '@/lib/pokeapi';

export const pokeKeys = {
  all: ['pokemon-extra'] as const,
  details: (idOrName: string | number) => [...pokeKeys.all, 'details', idOrName] as const,
  species: (idOrName: string | number) => [...pokeKeys.all, 'species', idOrName] as const,
  evolution: (url: string) => [...pokeKeys.all, 'evolution', url] as const,
};

export const usePokemonExtra = (dexId?: number[], name?: string) => {
  // On utilise le premier dexId s'il existe (priorité absolue car c'est un nombre stable)
  // Si pas d'ID, on utilise le nom, mais seulement s'il ne contient pas d'espaces (souvent signe d'un nom FR complexe)
  const identifier = (dexId && dexId.length > 0) 
    ? dexId[0] 
    : (name && !name.includes(' ') ? name.toLowerCase() : null);

  const detailsQuery = useQuery({
    queryKey: pokeKeys.details(identifier || ''),
    queryFn: () => pokeapi.getPokemon(identifier!),
    enabled: !!identifier,
    staleTime: 24 * 60 * 60 * 1000,
    retry: false, // Évite de boucler sur des 404
  });

  const speciesQuery = useQuery({
    queryKey: pokeKeys.species(identifier || ''),
    queryFn: () => pokeapi.getSpecies(identifier!),
    enabled: !!identifier,
    staleTime: 24 * 60 * 60 * 1000,
    retry: false,
  });

  const evolutionQuery = useQuery({
    queryKey: pokeKeys.evolution(speciesQuery.data?.evolution_chain.url || ''),
    queryFn: () => pokeapi.getEvolutionChain(speciesQuery.data!.evolution_chain.url),
    enabled: !!speciesQuery.data?.evolution_chain.url,
    staleTime: 24 * 60 * 60 * 1000,
  });

  return {
    details: detailsQuery.data,
    species: speciesQuery.data,
    evolution: evolutionQuery.data,
    isLoading: detailsQuery.isLoading || speciesQuery.isLoading,
    isError: detailsQuery.isError || (detailsQuery.isFetched && !detailsQuery.data),
  };
};
