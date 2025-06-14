import { supabase } from '@/lib/supabase';

export const testSupabaseConnection = async () => {
    console.log('🔍 Test de connexion Supabase...');

    try {
        // Test 1: Vérifier la session
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        console.log('📝 Session actuelle:', session?.session?.user?.email || 'Aucune session');

        if (sessionError) {
            console.error('❌ Erreur de session:', sessionError);
            return false;
        }

        // Test 2: Vérifier l'accès à la table profiles (si connecté)
        if (session?.session?.user) {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.session.user.id)
                .single();

            if (profileError) {
                console.error('❌ Erreur lors de la récupération du profil:', profileError);
            } else {
                console.log('✅ Profil récupéré:', profile?.name || profile?.email);
            }
        }

        // Test 3: Vérifier l'accès à la table user_pokemon_cards (si connecté)
        if (session?.session?.user) {
            const { data: cards, error: cardsError } = await supabase
                .from('user_pokemon_cards')
                .select('*')
                .eq('user_id', session.session.user.id)
                .limit(1);

            if (cardsError) {
                console.error('❌ Erreur lors de la récupération des cartes:', cardsError);
                return false;
            } else {
                console.log(`✅ Accès aux cartes OK (${cards?.length || 0} cartes trouvées)`);
            }
        }

        console.log('✅ Connexion Supabase OK');
        return true;

    } catch (error) {
        console.error('❌ Erreur générale lors du test Supabase:', error);
        return false;
    }
};

export const testSupabaseAuth = async (email: string, password: string) => {
    console.log('🔍 Test d\'authentification Supabase...');

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('❌ Erreur d\'authentification:', error);
            return false;
        }

        console.log('✅ Authentification réussie:', data.user?.email);
        return true;

    } catch (error) {
        console.error('❌ Erreur générale lors de l\'authentification:', error);
        return false;
    }
};

// Fonction pour déboguer les problèmes de déconnexion
export const debugSignOut = async () => {
    console.log('🔍 Test de déconnexion...');

    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('❌ Erreur lors de la déconnexion:', error);
            return false;
        }

        console.log('✅ Déconnexion réussie');
        return true;

    } catch (error) {
        console.error('❌ Erreur générale lors de la déconnexion:', error);
        return false;
    }
}; 