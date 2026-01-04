import { apiFetch } from './client';
import { logError } from '../utils/logger';
import { handleApiError } from '../utils/errorHandler';

export const getUserById = async (userId) => {
  const response = await apiFetch(`/user/${userId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to fetch user:', error);
    throw new Error(error.message || 'Failed to fetch user');
  }

  const data = await response.json();
  return data;
};

export const getCurrentUser = async () => {
  const response = await apiFetch('/user/me', {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to fetch current user:', error);
    throw new Error(error.message || 'Failed to fetch current user');
  }

  const data = await response.json();
  return data;
};

export const getCurrentUserProjects = async () => {
  const response = await apiFetch('/user/me/projects', {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to fetch user projects:', error);
    throw new Error(error.message || 'Failed to fetch user projects');
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    const text = await response.text();
    throw new Error(text || 'Failed to fetch user projects');
  }

  return data;
};

export const updateUser = async (userData) => {
  const response = await apiFetch('/user', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to update user:', error);
    throw new Error(error.message || 'Failed to update user');
  }

  const data = await response.json();
  return data;
};

