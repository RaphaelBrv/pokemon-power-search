import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine et fusionne des noms de classes avec tailwind-merge
 * Fonction utilitaire pour combiner des noms de classes conditionnelles
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
