# Corrections des problèmes de déconnexion et fetch Supabase

## Problèmes identifiés et solutions

### 1. Problème de déconnexion (signOut)

**Problème :** La fonction de déconnexion pouvait rester bloquée indéfiniment ou ne pas réinitialiser correctement les états.

**Solutions apportées :**

- Ajout d'un timeout de 5 secondes pour éviter l'attente infinie
- Force la réinitialisation des états locaux même en cas d'erreur Supabase
- Meilleure gestion des erreurs avec logs détaillés

### 2. Problème de fetch Supabase pour le pokédex

**Problème :** Le timeout de 10 secondes pouvait causer des problèmes et masquer les vraies erreurs.

**Solutions apportées :**

- Suppression du timeout artificiel qui masquait les erreurs
- Ajout de logs détaillés pour identifier la source des problèmes
- Meilleure gestion des erreurs avec messages spécifiques
- Vérification de la présence de l'utilisateur avant le fetch

## Outils de débogage ajoutés

### 1. Utilitaire de test Supabase (`src/utils/supabase-test.ts`)

Fonctions disponibles :

- `testSupabaseConnection()`: Teste la connexion générale à Supabase
- `testSupabaseAuth(email, password)`: Teste l'authentification
- `debugSignOut()`: Teste spécifiquement la déconnexion

### 2. Boutons de débogage dans la Navbar

Ajout temporaire de boutons pour :

- Tester la connexion Supabase (bouton orange avec icône Bug)
- Déboguer la déconnexion (option dans le menu utilisateur)

## Comment utiliser les outils de débogage

1. **Connectez-vous** à votre application
2. **Ouvrez la console** du navigateur (F12)
3. **Cliquez sur le bouton orange** (Bug) pour tester Supabase
4. **Utilisez "Debug Déconnexion"** dans le menu utilisateur pour tester la déconnexion

## Logs à surveiller

Les logs suivants apparaîtront dans la console :

```
🔍 Test de connexion Supabase...
📝 Session actuelle: [email ou "Aucune session"]
✅ Profil récupéré: [nom du profil]
✅ Accès aux cartes OK ([nombre] cartes trouvées)
✅ Connexion Supabase OK
```

Pour la déconnexion :

```
🔧 Test de déconnexion Supabase...
✅ Déconnexion réussie
```

## Erreurs possibles et solutions

### Erreur : "Variables d'environnement Supabase manquantes"

- Vérifiez que votre fichier `.env` contient :
  ```
  VITE_SUPABASE_URL=https://daauiaxvmlrvterpfkod.supabase.co
  VITE_SUPABASE_ANON_KEY=votre_clé_anon
  ```

### Erreur : "Row Level Security policy violation"

- Vérifiez que les politiques RLS sont correctement configurées dans Supabase
- L'utilisateur doit être authentifié pour accéder à ses données

### Déconnexion qui ne fonctionne pas

- Le timeout de 5 secondes force maintenant la déconnexion locale
- Les états sont réinitialisés même en cas d'erreur réseau

## Suppression des outils de débogage

Une fois les problèmes résolus, supprimez :

1. Le fichier `src/utils/supabase-test.ts`
2. Les imports et boutons de débogage dans `src/components/Navbar.tsx`
3. Ce fichier `DEBUG_FIXES.md`

## Logs de production

En production, les logs de débogage peuvent être désactivés en modifiant les `console.log` en `console.debug` ou en les supprimant complètement.
