import { apiFetch } from './client';
import { log, logError } from '../utils/logger';
import { handleApiError } from '../utils/errorHandler';

export const getAllProjects = async (page = 0, size = 100) => {
  const response = await apiFetch(`/project/?page=${page}&size=${size}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to fetch projects:', error);
    throw new Error(error.message || 'Failed to fetch projects');
  }

  const data = await response.json();

  // Handle paginated response
  if (data.content && Array.isArray(data.content)) {
    return data;
  }

  // Handle direct array response (fallback)
  return Array.isArray(data) ? { content: data } : data;
};

export const getProjectsBySkillId = async (skillId) => {
  const response = await apiFetch(`/project/find/${skillId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to fetch projects by skill:', error);
    throw new Error(error.message || 'Failed to fetch projects');
  }

  const data = await response.json();
  return data;
};

export const getProjectById = async (projectId) => {
  // Validate projectId before making the request
  if (!projectId || projectId === 'undefined' || projectId === 'null') {
    throw new Error('Invalid project ID');
  }

  log('Fetching project by ID:', projectId);
  const response = await apiFetch(`/project/${projectId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to fetch project:', error);
    throw new Error(error.message || 'Failed to fetch project');
  }

  const data = await response.json();

  log('Project fetched:', {
    id: data.id,
    projectName: data.projectName,
    hasPhoto: !!data.projectPhoto,
    photoLength: data.projectPhoto ? data.projectPhoto.length : 0
  });

  return data;
};

export const createProject = async (projectName, description = '', preferredTeamSize = null) => {
  const requestBody = {
    projectName: projectName,
    description: description || ''
  };
  if (preferredTeamSize !== null && preferredTeamSize > 0) {
    requestBody.preferredTeamSize = preferredTeamSize;
  }

  const response = await apiFetch('/project/', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to create project:', error);
    throw new Error(error.message || 'Failed to create project');
  }

  const data = await response.json();
  return data;
};

export const deleteProject = async (projectId) => {
  const response = await apiFetch(`/project/${projectId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to delete project:', error);
    throw new Error(error.message || 'Failed to delete project');
  }

  return await response.json().catch(() => ({ message: 'Project deleted successfully' }));
};

/**
 * Removes a team member from a project
 * @param {number|string} projectId - Project ID
 * @param {number|string} userId - User ID to remove
 * @returns {Promise<Object>} - Updated project data
 */
export const removeMemberFromProject = async (projectId, userId) => {
  const response = await apiFetch(`/project/member/${projectId}/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to remove member from project:', error);
    throw new Error(error.message || 'Failed to remove member from project');
  }

  const data = await response.json();
  return data;
};

export const updateProject = async (projectId, projectData) => {
  // Log what we're sending (without the full photo array to avoid log spam)
  const logData = {
    ...projectData,
    projectPhoto: projectData.projectPhoto
      ? `[Array(${projectData.projectPhoto.length})]`
      : null
  };
  log('Sending update request:', logData);

  const response = await apiFetch(`/project/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  });

  log('Response status:', response.status, 'ok:', response.ok);

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Update failed:', error);
    throw new Error(error.message || 'Failed to update project');
  }

  const data = await response.json();

  // Log what we received (only in development)
  log('Update response received:', {
    id: data.id,
    projectName: data.projectName,
    hasPhoto: !!data.projectPhoto,
    photoLength: data.projectPhoto ? data.projectPhoto.length : 0,
    photoType: data.projectPhoto ? typeof data.projectPhoto : 'null',
    isArray: Array.isArray(data.projectPhoto)
  });

  return data;
};
