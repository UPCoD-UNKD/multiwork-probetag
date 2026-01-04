import { apiFetch } from './client';
import { logError } from '../utils/logger';
import { handleApiError } from '../utils/errorHandler';

/**
 * Creates a new project application.
 * 
 * @param {number} projectId - Project ID
 * @param {string} message - Optional message from applicant
 * @returns {Promise<Object>} Created application
 */
export const createApplication = async (projectId, message = '') => {
  const response = await apiFetch('/api/project-application', {
    method: 'POST',
    body: JSON.stringify({
      projectId: projectId,
      message: message || null
    }),
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to create application:', error);
    throw new Error(error.message || 'Failed to create application');
  }

  const data = await response.json();
  return data;
};

/**
 * Gets all applications for a project (project creator only).
 * 
 * @param {number} projectId - Project ID
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Page size (default: 20)
 * @returns {Promise<Object>} PageResponse with applications
 */
export const getApplicationsByProject = async (projectId, page = 0, size = 20) => {
  const response = await apiFetch(
    `/api/project-application/project/${projectId}?page=${page}&size=${size}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to fetch applications:', error);
    throw new Error(error.message || 'Failed to fetch applications');
  }

  const data = await response.json();
  return data;
};

/**
 * Gets all applications for a project by status (project creator only).
 * 
 * @param {number} projectId - Project ID
 * @param {string} status - Application status (PENDING, APPROVED, REJECTED)
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Page size (default: 20)
 * @returns {Promise<Object>} PageResponse with applications
 */
export const getApplicationsByProjectAndStatus = async (projectId, status, page = 0, size = 20) => {
  const response = await apiFetch(
    `/api/project-application/project/${projectId}/status/${status}?page=${page}&size=${size}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to fetch applications by status:', error);
    throw new Error(error.message || 'Failed to fetch applications');
  }

  const data = await response.json();
  return data;
};

/**
 * Gets all applications by current user.
 * 
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Page size (default: 20)
 * @returns {Promise<Object>} PageResponse with applications
 */
export const getMyApplications = async (page = 0, size = 20) => {
  const response = await apiFetch(
    `/api/project-application/my-applications?page=${page}&size=${size}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to fetch my applications:', error);
    throw new Error(error.message || 'Failed to fetch my applications');
  }

  const data = await response.json();
  return data;
};

/**
 * Gets all applications by current user with specific status.
 * 
 * @param {string} status - Application status (PENDING, APPROVED, REJECTED)
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Page size (default: 20)
 * @returns {Promise<Object>} PageResponse with applications
 */
export const getMyApplicationsByStatus = async (status, page = 0, size = 20) => {
  const response = await apiFetch(
    `/api/project-application/my-applications/status/${status}?page=${page}&size=${size}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to fetch my applications by status:', error);
    throw new Error(error.message || 'Failed to fetch my applications');
  }

  const data = await response.json();
  return data;
};

/**
 * Gets a specific application by ID.
 * 
 * @param {number} applicationId - Application ID
 * @returns {Promise<Object>} Application DTO
 */
export const getApplicationById = async (applicationId) => {
  const response = await apiFetch(`/api/project-application/${applicationId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to fetch application:', error);
    throw new Error(error.message || 'Failed to fetch application');
  }

  const data = await response.json();
  return data;
};

/**
 * Gets count of pending applications for a project (project creator only).
 * 
 * @param {number} projectId - Project ID
 * @returns {Promise<number>} Count of pending applications
 */
export const getPendingCount = async (projectId) => {
  const response = await apiFetch(`/api/project-application/project/${projectId}/pending-count`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to fetch pending count:', error);
    throw new Error(error.message || 'Failed to fetch pending count');
  }

  const data = await response.json();
  return data;
};

/**
 * Approves a project application (project creator only).
 * 
 * @param {number} applicationId - Application ID
 * @returns {Promise<Object>} Updated application
 */
export const approveApplication = async (applicationId) => {
  const response = await apiFetch(`/api/project-application/${applicationId}/approve`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to approve application:', error);
    throw new Error(error.message || 'Failed to approve application');
  }

  const data = await response.json();
  return data;
};

/**
 * Rejects a project application (project creator only).
 * 
 * @param {number} applicationId - Application ID
 * @returns {Promise<Object>} Updated application
 */
export const rejectApplication = async (applicationId) => {
  const response = await apiFetch(`/api/project-application/${applicationId}/reject`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to reject application:', error);
    throw new Error(error.message || 'Failed to reject application');
  }

  const data = await response.json();
  return data;
};

/**
 * Cancels a project application (applicant only).
 * 
 * @param {number} applicationId - Application ID
 * @returns {Promise<Object>} Updated application
 */
export const cancelApplication = async (applicationId) => {
  const response = await apiFetch(`/api/project-application/${applicationId}/cancel`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    logError('Failed to cancel application:', error);
    throw new Error(error.message || 'Failed to cancel application');
  }

  const data = await response.json();
  return data;
};
