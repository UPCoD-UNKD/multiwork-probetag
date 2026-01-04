import { useQuery } from '@tanstack/react-query';
import { getNotificationCount } from '../api/notifications.api';
import { getCurrentUser } from '../api/users.api';

/**
 * React Query hook for notifications with caching and polling
 */
export const notificationKeys = {
  all: ['notifications'],
  count: () => [...notificationKeys.all, 'count'],
};

/**
 * Hook to fetch notification count with automatic polling
 * Polls every 30 seconds when user is online
 * 
 * @param {Object} options - Query options
 */
export const useNotifications = (options = {}) => {
  return useQuery({
    queryKey: notificationKeys.count(),
    queryFn: async () => {
      // First check if user is logged in
      try {
        const user = await getCurrentUser();
        if (!user || !user.id) {
          return { applications: 0, comments: 0, total: 0 };
        }
        return await getNotificationCount();
      } catch (error) {
        // User not logged in or error
        return { applications: 0, comments: 0, total: 0 };
      }
    },
    staleTime: 1000 * 10, // 10 seconds - data becomes stale quickly for better reactivity
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 15, // Poll every 15 seconds (like Telegram)
    refetchIntervalInBackground: true, // Continue polling in background
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Always refetch on mount
    refetchOnReconnect: true, // Refetch when connection restored
    retry: 1, // Only retry once on error
    ...options,
  });
};
