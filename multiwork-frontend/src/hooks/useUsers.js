import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, getUserById, getCurrentUserProjects, updateUser } from '../api/users.api';

/**
 * React Query hooks for users with caching and optimization
 */

// Query keys
export const userKeys = {
  all: ['users'],
  current: () => [...userKeys.all, 'current'],
  detail: (id) => [...userKeys.all, 'detail', id],
  projects: () => [...userKeys.all, 'current', 'projects'],
};

/**
 * Hook to fetch current user with caching
 * @param {Object} options - Query options
 */
export const useCurrentUser = (options = {}) => {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes - user data doesn't change often
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: false, // Don't refetch if data is fresh
    refetchOnWindowFocus: false,
    retry: false, // Don't retry if user is not logged in
    ...options,
  });
};

/**
 * Hook to fetch user by ID with caching
 * @param {number|string} userId - User ID
 * @param {Object} options - Query options
 */
export const useUser = (userId, options = {}) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUserById(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Hook to fetch current user's projects with caching
 * @param {Object} options - Query options
 */
export const useCurrentUserProjects = (options = {}) => {
  return useQuery({
    queryKey: userKeys.projects(),
    queryFn: getCurrentUserProjects,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Hook to update current user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      // Update current user cache
      queryClient.setQueryData(userKeys.current(), data);
      // Invalidate user projects if they might have changed
      queryClient.invalidateQueries({ queryKey: userKeys.projects() });
    },
  });
};
