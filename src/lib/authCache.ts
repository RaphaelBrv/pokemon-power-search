import { Profile } from './supabase';

// Cache local pour les données d'authentification
class AuthCache {
  private static instance: AuthCache;
  private profileCache = new Map<string, { profile: Profile; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): AuthCache {
    if (!AuthCache.instance) {
      AuthCache.instance = new AuthCache();
    }
    return AuthCache.instance;
  }

  // Mettre en cache un profil
  setProfile(userId: string, profile: Profile): void {
    this.profileCache.set(userId, {
      profile,
      timestamp: Date.now(),
    });
    console.log('📦 Profil mis en cache pour:', userId);
  }

  // Récupérer un profil du cache
  getProfile(userId: string): Profile | null {
    const cached = this.profileCache.get(userId);
    
    if (!cached) {
      return null;
    }

    // Vérifier si le cache n'est pas expiré
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.profileCache.delete(userId);
      console.log('🗑️ Cache expiré pour:', userId);
      return null;
    }

    console.log('⚡ Profil récupéré du cache pour:', userId);
    return cached.profile;
  }

  // Vider le cache
  clear(): void {
    this.profileCache.clear();
    console.log('🧹 Cache d\'authentification vidé');
  }

  // Supprimer un profil spécifique du cache
  removeProfile(userId: string): void {
    this.profileCache.delete(userId);
    console.log('🗑️ Profil supprimé du cache:', userId);
  }

  // Précharger les données fréquemment utilisées
  preloadUserData(userId: string): void {
    // Cette fonction peut être étendue pour précharger d'autres données
    console.log('🚀 Préchargement des données pour:', userId);
  }
}

export const authCache = AuthCache.getInstance(); 