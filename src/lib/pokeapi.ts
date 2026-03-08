
export interface PokeAPIPokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: Array<{
    is_hidden: boolean;
    slot: number;
    ability: { name: string; url: string };
  }>;
  forms: Array<{ name: string; url: string }>;
  game_indices: Array<{
    game_index: number;
    version: { name: string; url: string };
  }>;
  held_items: Array<{
    item: { name: string; url: string };
    version_details: Array<{
      rarity: number;
      version: { name: string; url: string };
    }>;
  }>;
  location_area_encounters: string;
  moves: Array<{
    move: { name: string; url: string };
    version_group_details: Array<{
      level_learned_at: number;
      version_group: { name: string; url: string };
      move_learn_method: { name: string; url: string };
    }>;
  }>;
  species: { name: string; url: string };
  sprites: {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    other?: {
      dream_world?: { front_default: string | null; front_female: string | null };
      home?: {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
      'official-artwork'?: { front_default: string | null; front_shiny: string | null };
      showdown?: {
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
    };
  };
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: { name: string; url: string };
  }>;
  types: Array<{
    slot: number;
    type: { name: string; url: string };
  }>;
  past_types: Array<{
    generation: { name: string; url: string };
    types: Array<{ slot: number; type: { name: string; url: string } }>;
  }>;
}

export interface PokeAPISpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: { name: string; url: string };
  pokedex_numbers: Array<{
    entry_number: number;
    pokedex: { name: string; url: string };
  }>;
  egg_groups: Array<{ name: string; url: string }>;
  color: { name: string; url: string };
  shape: { name: string; url: string };
  evolves_from_species: { name: string; url: string } | null;
  evolution_chain: { url: string };
  habitat: { name: string; url: string } | null;
  generation: { name: string; url: string };
  names: Array<{ name: string; language: { name: string; url: string } }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string; url: string };
    version: { name: string; url: string };
  }>;
  form_descriptions: Array<{
    description: string;
    language: { name: string; url: string };
  }>;
  genera: Array<{ genus: string; language: { name: string; url: string } }>;
  varieties: Array<{
    is_default: boolean;
    pokemon: { name: string; url: string };
  }>;
}

export interface PokeAPIEvolutionChain {
  id: number;
  baby_trigger_item: any;
  chain: ChainLink;
}

export interface ChainLink {
  is_baby: boolean;
  species: { name: string; url: string };
  evolution_details: any[];
  evolves_to: ChainLink[];
}

const BASE_URL = 'https://pokeapi.co/api/v2';

export const pokeapi = {
  async getPokemon(nameOrId: string | number): Promise<PokeAPIPokemon> {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId.toString().toLowerCase()}`);
    if (!response.ok) throw new Error(`Pokemon ${nameOrId} not found`);
    return response.json();
  },

  async getSpecies(nameOrId: string | number): Promise<PokeAPISpecies> {
    const response = await fetch(`${BASE_URL}/pokemon-species/${nameOrId.toString().toLowerCase()}`);
    if (!response.ok) throw new Error(`Pokemon Species ${nameOrId} not found`);
    return response.json();
  },

  async getEvolutionChain(url: string): Promise<PokeAPIEvolutionChain> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Evolution chain not found`);
    return response.json();
  },

  async getType(nameOrId: string | number) {
    const response = await fetch(`${BASE_URL}/type/${nameOrId}`);
    if (!response.ok) throw new Error(`Type ${nameOrId} not found`);
    return response.json();
  }
};

export default pokeapi;
