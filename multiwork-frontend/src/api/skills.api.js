import { apiFetch } from './client';
import { logError } from '../utils/logger';
import { handleApiError } from '../utils/errorHandler';

export const getAllSkills = async () => {
  const response = await apiFetch('/skill/', {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to fetch skills:', error);
    throw new Error(error.message || 'Failed to fetch skills');
  }

  const data = await response.json();
  return data;
};

