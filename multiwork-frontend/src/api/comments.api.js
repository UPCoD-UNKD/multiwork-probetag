import { apiFetch } from './client';
import { logError } from '../utils/logger';
import { handleApiError } from '../utils/errorHandler';

export const getComment = async (commentId) => {
  const response = await apiFetch(`/comment/${commentId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to fetch comment:', error);
    throw new Error(error.message || 'Failed to fetch comment');
  }

  const data = await response.json();
  return data;
};

export const createComment = async (text) => {
  const response = await apiFetch('/comment/', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to create comment:', error);
    throw new Error(error.message || 'Failed to create comment');
  }

  const data = await response.json();
  return data;
};

export const addCommentToProject = async (projectId, text) => {
  // Validate projectId before making the request
  if (!projectId || projectId === 'undefined' || projectId === 'null') {
    throw new Error('Invalid project ID');
  }

  const response = await apiFetch(`/project/${projectId}/comment`, {
    method: 'PATCH',
    body: JSON.stringify({
      text: text,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0]
    }),
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to add comment to project:', error);
    throw new Error(error.message || 'Failed to add comment to project');
  }

  const data = await response.json();
  return data;
};

