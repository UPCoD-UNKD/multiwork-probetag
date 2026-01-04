import { logError } from '../utils/logger';
import { handleApiError } from '../utils/errorHandler';
import { getToken, removeToken } from '../utils/storage';

// API URL from environment variable
// In development with proxy (npm start), use relative path (empty string) to use setupProxy.js
// In production build or when REACT_APP_API_URL is set, use full URL
// Note: setupProxy.js only works with 'npm start' (development server), not with production builds
const API_URL = process.env.REACT_APP_API_URL || '';

/**
 * Enhanced API fetch with error handling and logging
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - Fetch response
 */
export const apiFetch = async (url, options = {}) => {
  const token = getToken();
  const fullUrl = API_URL + url;

  try {
    const response = await fetch(fullUrl, {
      ...options,
      signal: options.signal, // Support AbortSignal for request cancellation
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    // Handle 401 Unauthorized - token might be expired
    if (response.status === 401) {
      // Clear invalid token
      removeToken();
      // Optionally redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return response;
  } catch (error) {
    // Network errors (offline, CORS, etc.)
    logError('API fetch error:', error);
    throw error;
  }
};

/**
 * Enhanced API fetch with automatic error parsing
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - Parsed response data or throws error
 */
export const apiFetchWithErrorHandling = async (url, options = {}) => {
  const response = await apiFetch(url, options);
  
  if (!response.ok) {
    const error = await handleApiError(response);
    throw new Error(error.message || 'API request failed');
  }

  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (e) {
    logError('Failed to parse response:', e);
    throw new Error('Failed to parse response');
  }
};
