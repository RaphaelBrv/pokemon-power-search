import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine et fusionne des noms de classes avec tailwind-merge
 * Fonction utilitaire pour combiner des noms de classes conditionnelles
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Nettoie le nom d'un Pokémon pour l'API (ex: "Bulbizarre" -> "bulbasaur", "Dracaufeu-GX" -> "charizard")
 * Note: PokeAPI utilise les noms anglais par défaut.
 */
export function sanitizePokemonName(name: string): string {
  if (!name) return "";
  
  return name
    .split(/[\s-(]/)[0]
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}
