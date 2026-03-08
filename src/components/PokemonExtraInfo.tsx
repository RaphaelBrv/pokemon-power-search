
import React from 'react';
import { usePokemonExtra } from '@/hooks/usePokeAPI';
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from 'lucide-react';

interface PokemonExtraInfoProps {
  dexId?: number[];
  name?: string;
}

const PokemonExtraInfo: React.FC<PokemonExtraInfoProps> = ({ dexId, name }) => {
  const { details, species, evolution, isLoading, isError } = usePokemonExtra(dexId, name);

  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="space-y-2 mt-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !details) return null;

  // Trouver le texte de saveur en français
  const flavorText = species?.flavor_text_entries.find(e => e.language.name === 'fr')?.flavor_text 
    || species?.flavor_text_entries.find(e => e.language.name === 'en')?.flavor_text;

  // Trouver le genre en français
  const genus = species?.genera.find(g => g.language.name === 'fr')?.genus;

  const getStatLabel = (name: string) => {
    const labels: Record<string, string> = {
      'hp': 'PV',
      'attack': 'Attaque',
      'defense': 'Défense',
      'special-attack': 'Att. Spé.',
      'special-defense': 'Déf. Spé.',
      'speed': 'Vitesse'
    };
    return labels[name] || name;
  };

  const getStatColor = (name: string) => {
    const colors: Record<string, string> = {
      'hp': 'bg-red-500',
      'attack': 'bg-orange-500',
      'defense': 'bg-yellow-500',
      'special-attack': 'bg-blue-500',
      'special-defense': 'bg-green-500',
      'speed': 'bg-pink-500'
    };
    return colors[name] || 'bg-gray-500';
  };

  // Fonction récursive pour aplatir la chaîne d'évolution
  const flattenEvolution = (chain: any): any[] => {
    const speciesName = chain.species.name;
    const id = chain.species.url.split('/').filter(Boolean).pop();
    const result = [{ name: speciesName, id }];
    
    if (chain.evolves_to && chain.evolves_to.length > 0) {
      // Pour simplifier, on ne prend que la première branche d'évolution si multiple
      result.push(...flattenEvolution(chain.evolves_to[0]));
    }
    return result;
  };

  const evoChain = evolution ? flattenEvolution(evolution.chain) : [];

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="bg-[#3B4CCA] text-white px-2 py-0.5 rounded text-sm uppercase">Info Pokédex</span>
        {genus && <span className="text-sm font-normal text-gray-500 italic">{genus}</span>}
      </h3>
      
      {flavorText && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 italic text-gray-700 text-sm leading-relaxed border-l-4 border-[#3B4CCA] shadow-sm">
          "{flavorText.replace(/[\n\f]/g, ' ')}"
        </div>
      )}

      {evoChain.length > 1 && (
        <div className="mb-6">
          <h4 className="font-semibold text-sm uppercase text-gray-500 mb-3 tracking-wider text-center">Lignée d'évolution</h4>
          <div className="flex items-center justify-center gap-1 p-3 bg-white border rounded-xl shadow-sm overflow-x-auto">
            {evoChain.map((evo, index) => (
              <React.Fragment key={evo.id}>
                <div className={`flex flex-col items-center p-2 rounded-lg ${details.id.toString() === evo.id ? 'bg-[#3B4CCA]/10 border-[#3B4CCA] border' : 'border-transparent border'}`}>
                  <img 
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`} 
                    alt={evo.name}
                    className="w-14 h-14 object-contain"
                  />
                  <span className={`text-[10px] capitalize font-bold mt-1 ${details.id.toString() === evo.id ? 'text-[#3B4CCA]' : 'text-gray-600'}`}>
                    {evo.name}
                  </span>
                </div>
                {index < evoChain.length - 1 && <ChevronRight className="text-gray-300 flex-shrink-0" size={16} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <h4 className="font-semibold text-sm uppercase text-gray-500 mb-1 tracking-wider text-center">Statistiques de base</h4>
        <div className="space-y-3 bg-white p-4 border rounded-xl shadow-sm">
          {details.stats.map(stat => (
            <div key={stat.stat.name} className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                <span>{getStatLabel(stat.stat.name)}</span>
                <span>{stat.base_stat}</span>
              </div>
              <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden border-gray-50 border">
                <div 
                  className={`absolute top-0 left-0 h-full ${getStatColor(stat.stat.name)} transition-all duration-1000 ease-out`} 
                  style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-4 rounded-xl text-center border shadow-sm">
          <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Taille</p>
          <p className="text-xl font-black text-gray-800">{details.height / 10} <span className="text-sm font-normal text-gray-500">m</span></p>
        </div>
        <div className="bg-white p-4 rounded-xl text-center border shadow-sm">
          <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Poids</p>
          <p className="text-xl font-black text-gray-800">{details.weight / 10} <span className="text-sm font-normal text-gray-500">kg</span></p>
        </div>
      </div>
    </div>
  );
};

export default PokemonExtraInfo;
