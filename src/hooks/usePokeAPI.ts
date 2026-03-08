
import { useQuery } from '@tanstack/react-query';
import pokeapi from '@/lib/pokeapi';

export const pokeKeys = {
  all: ['pokemon-extra'] as const,
  details: (idOrName: string | number) => [...pokeKeys.all, 'details', idOrName] as const,
  species: (idOrName: string | number) => [...pokeKeys.all, 'species', idOrName] as const,
  evolution: (url: string) => [...pokeKeys.all, 'evolution', url] as const,
};

export const usePokemonExtra = (dexId?: number[], name?: string) => {
  // On utilise le premier dexId s'il existe, sinon on se rabat sur le nom
  const identifier = dexId && dexId.length > 0 ? dexId[0] : (name?.toLowerCase() || '');

  const detailsQuery = useQuery({
    queryKey: pokeKeys.details(identifier),
    queryFn: () => pokeapi.getPokemon(identifier),
    enabled: !!identifier,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const speciesQuery = useQuery({
    queryKey: pokeKeys.species(identifier),
    queryFn: () => pokeapi.getSpecies(identifier),
    enabled: !!identifier,
    staleTime: 24 * 60 * 60 * 1000,
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
