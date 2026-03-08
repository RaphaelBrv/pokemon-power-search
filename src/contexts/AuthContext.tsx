/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useEffect, useState } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase, Profile } from "@/lib/supabase";
import { queryClient } from "@/lib/queryClient";
import { authCache } from "@/lib/authCache";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    name?: string
  ) => Promise<{ error: AuthError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (
    updates: Partial<Profile>
  ) => Promise<{ error: Error | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string, retryCount = 0) => {
    try {
      console.log("🔍 Récupération du profil pour:", userId);

      // Vérifier d'abord le cache local
      const cachedProfile = authCache.getProfile(userId);
      if (cachedProfile) {
        setProfile(cachedProfile);
        setLoading(false);
        return;
      }

      // Timeout pour éviter l'attente trop longue
      const profilePromise = supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Profile fetch timeout")), 2000)
      );

      const { data, error } = (await Promise.race([
        profilePromise,
        timeoutPromise,
      ])) as any;

      if (error) {
        console.error("Erreur lors de la récupération du profil:", error);

        // Retry une fois en cas d'erreur réseau
        if (
          retryCount === 0 &&
          (error.message?.includes("timeout") ||
            error.message?.includes("network"))
        ) {
          console.log("🔄 Retry de récupération du profil...");
          return fetchProfile(userId, 1);
        }

        // En cas d'erreur persistante, continuer sans profil
        setProfile(null);
      } else {
        console.log("✅ Profil récupéré:", data?.name || data?.email);
        setProfile(data);
        // Mettre en cache le profil récupéré
        authCache.setProfile(userId, data);
      }
    } catch (error) {
      console.error("Erreur générale:", error);

      // Retry une fois en cas de timeout
      if (retryCount === 0) {
        console.log("🔄 Retry après timeout...");
        return fetchProfile(userId, 1);
      }

      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Récupérer la session actuelle avec timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Session timeout")), 3000)
        );

        const {
          data: { session },
        } = (await Promise.race([sessionPromise, timeoutPromise])) as any;

        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Précharger le profil en parallèle
          fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch {
        console.warn(
          "Timeout lors de la récupération de session, continuons sans session"
        );
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log("🔄 Auth state change:", event);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Optimisation: ne pas refetch le profil si on l'a déjà
        if (
          event === "SIGNED_IN" ||
          !profile ||
          profile.id !== session.user.id
        ) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, profile]);

  const signUp = async (email: string, password: string, name?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || "",
        },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔐 Tentative de connexion pour:", email);

      // Timeout pour éviter l'attente trop longue
      const signInPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connexion timeout")), 8000)
      );

      const { error } = (await Promise.race([
        signInPromise,
        timeoutPromise,
      ])) as any;

      if (error) {
        console.error("❌ Erreur de connexion:", error.message);
      } else {
        console.log("✅ Connexion réussie");
      }

      return { error };
    } catch (error: any) {
      console.error("❌ Timeout ou erreur de connexion:", error.message);
      return {
        error: {
          message: "Connexion trop lente, veuillez réessayer",
        } as AuthError,
      };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);

      // Timeout pour éviter d'attendre indéfiniment
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout de déconnexion")), 5000)
      );

      try {
        const { error } = (await Promise.race([
          signOutPromise,
          timeoutPromise,
        ])) as any;

        // Force la réinitialisation des états même en cas d'erreur
        setUser(null);
        setProfile(null);
        setSession(null);

        // Invalider tout le cache TanStack Query lors de la déconnexion
        queryClient.clear();
        // Vider le cache d'authentification
        authCache.clear();

        return { error };
      } catch {
        console.warn(
          "Timeout lors de la déconnexion, forçage de la déconnexion locale"
        );
        // En cas de timeout, on force la déconnexion locale
        setUser(null);
        setProfile(null);
        setSession(null);

        // Invalider tout le cache TanStack Query lors de la déconnexion
        queryClient.clear();
        // Vider le cache d'authentification
        authCache.clear();

        return { error: null };
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // En cas d'erreur, force quand même la déconnexion côté client
      setUser(null);
      setProfile(null);
      setSession(null);

      // Invalider tout le cache TanStack Query lors de la déconnexion
      queryClient.clear();
      // Vider le cache d'authentification
      authCache.clear();

      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      // Mettre à jour le profil local
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
