import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        'Variables d\'environnement Supabase manquantes. Vérifiez que VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définies dans votre fichier .env'
    )
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types pour la base de données
export type Profile = {
    id: string
    email: string
    name?: string
    avatar_url?: string
    created_at: string
    updated_at: string
}

export type UserPokemonCard = {
    id: string
    user_id: string
    card_id: string
    card_name: string
    card_image_url?: string
    card_set?: string
    card_rarity?: string
    card_type?: string
    hp?: number
    market_price?: number
    quantity: number
    added_at: string
    notes?: string
} 