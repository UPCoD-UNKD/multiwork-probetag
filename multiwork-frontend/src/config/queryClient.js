import { QueryClient } from '@tanstack/react-query';

/**
 * React Query client configuration.
 * Provides caching, background updates, and error handling for API requests.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache time: how long unused/inactive cache data remains in memory
      gcTime: 1000 * 60 * 10, // 10 minutes - keep data in cache longer
      
      // Stale time: how long data is considered fresh (no refetch needed)
      staleTime: 1000 * 60 * 5, // 5 minutes - data is fresh for 5 minutes
      
      // Retry failed requests
      retry: 1,
      
      // Don't refetch on mount if data is fresh (from cache)
      refetchOnMount: false,
      
      // Don't refetch on window focus (saves bandwidth)
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect (good for offline scenarios)
      refetchOnReconnect: true,
      
      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry failed mutations
      retry: 0,
    },
  },
});
