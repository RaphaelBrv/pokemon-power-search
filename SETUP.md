# Configuration de l'environnement

## Variables d'environnement requises

Ce projet nécessite les variables d'environnement suivantes pour fonctionner correctement :

### Supabase

- `VITE_SUPABASE_URL` : L'URL de votre projet Supabase
- `VITE_SUPABASE_ANON_KEY` : La clé publique anonyme de votre projet Supabase

## Configuration

1. Copiez le fichier `.env.example` vers `.env` :

   ```bash
   cp .env.example .env
   ```

2. Ouvrez le fichier `.env` et remplacez les valeurs par vos vraies clés Supabase :

   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Redémarrez le serveur de développement :
   ```bash
   npm run dev
   ```

## Obtenir les clés Supabase

1. Connectez-vous à votre [tableau de bord Supabase](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Copiez l'**URL** et la **anon public key**

## Sécurité

- Le fichier `.env` est déjà inclus dans `.gitignore` pour éviter de commiter vos clés
- Ne partagez jamais vos clés Supabase publiquement
- Utilisez des variables d'environnement différentes pour la production

## Structure de la base de données

Le projet utilise les tables suivantes dans Supabase :

- `profiles` : Profils utilisateurs
- `user_pokemon_cards` : Cartes Pokemon des utilisateurs

Les migrations sont appliquées automatiquement lors de la première utilisation.
