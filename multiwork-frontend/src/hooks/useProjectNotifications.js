import { useQuery } from '@tanstack/react-query';
import { getPendingCount } from '../api/applications.api';

/**
 * Hook to get pending applications count for a specific project
 * @param {number|string} projectId - Project ID
 * @param {Object} options - Query options
 */
export const useProjectNotifications = (projectId, options = {}) => {
  return useQuery({
    queryKey: ['notifications', 'project', projectId, 'pending-count'],
    queryFn: () => getPendingCount(projectId),
    enabled: !!projectId && (options.enabled !== false),
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 30, // Poll every 30 seconds
    refetchOnWindowFocus: true,
    retry: 1,
    ...options,
  });
};
