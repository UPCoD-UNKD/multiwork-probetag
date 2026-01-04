import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllProjects, getProjectsBySkillId, getProjectById, createProject, updateProject, deleteProject } from '../api/projects.api';

/**
 * React Query hooks for projects with caching and optimization
 */

// Query keys
export const projectKeys = {
  all: ['projects'],
  lists: () => [...projectKeys.all, 'list'],
  list: (filters) => [...projectKeys.lists(), { filters }],
  details: () => [...projectKeys.all, 'detail'],
  detail: (id) => [...projectKeys.details(), id],
  bySkill: (skillId) => [...projectKeys.all, 'skill', skillId],
};

/**
 * Hook to fetch all projects with caching
 * @param {number} page - Page number
 * @param {number} size - Page size
 * @param {Object} options - Query options
 */
export const useAllProjects = (page = 0, size = 100, options = {}) => {
  return useQuery({
    queryKey: projectKeys.list({ page, size }),
    queryFn: () => getAllProjects(page, size),
    staleTime: 1000 * 60 * 5, // 5 minutes - projects don't change often
    gcTime: 1000 * 60 * 10, // 10 minutes - keep in cache longer
    refetchOnMount: false, // Don't refetch if data is fresh
    refetchOnWindowFocus: false, // Don't refetch on window focus
    ...options,
  });
};

/**
 * Hook to fetch projects by skill with caching
 * @param {number} skillId - Skill ID
 * @param {Object} options - Query options
 */
export const useProjectsBySkill = (skillId, options = {}) => {
  return useQuery({
    queryKey: projectKeys.bySkill(skillId),
    queryFn: () => getProjectsBySkillId(skillId),
    enabled: !!skillId, // Only fetch if skillId is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Hook to fetch single project by ID with caching
 * @param {number|string} projectId - Project ID
 * @param {Object} options - Query options
 */
export const useProject = (projectId, options = {}) => {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId && projectId !== 'undefined' && projectId !== 'null',
    staleTime: 1000 * 60 * 10, // 10 minutes - single project changes less often
    gcTime: 1000 * 60 * 15, // 15 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Hook to create a new project
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectName, description, preferredTeamSize }) => 
      createProject(projectName, description, preferredTeamSize),
    onSuccess: () => {
      // Invalidate projects list to refetch
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};

/**
 * Hook to update a project
 */
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, projectData }) => 
      updateProject(projectId, projectData),
    onSuccess: (data, variables) => {
      // Update cache for the specific project
      queryClient.setQueryData(projectKeys.detail(variables.projectId), data);
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};

/**
 * Hook to delete a project
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (_, projectId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};
