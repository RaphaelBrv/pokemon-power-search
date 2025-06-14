import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
            retry: (failureCount, error: any) => {
                // Ne pas retry sur les erreurs d'authentification
                if (error?.code === 'PGRST301' || error?.message?.includes('JWT')) {
                    return false;
                }
                return failureCount < 3;
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 1,
        },
    },
}); 