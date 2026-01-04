import { logError } from './logger';

/**
 * Centralized error handling utility.
 * Provides consistent error handling across the application.
 */

/**
 * Error types for categorization
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  VALIDATION: 'VALIDATION',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN'
};

/**
 * Parses error from API response
 * @param {Response} response - Fetch response object
 * @returns {Promise<Object>} - Parsed error object
 */
export const parseApiError = async (response) => {
  let errorMessage = 'An error occurred';
  let errorData = null;

  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } else {
      const text = await response.text();
      errorMessage = text || errorMessage;
    }
  } catch (e) {
    logError('Failed to parse error response:', e);
  }

  return {
    message: errorMessage,
    status: response.status,
    statusText: response.statusText,
    data: errorData
  };
};

/**
 * Categorizes error by HTTP status code
 * @param {number} status - HTTP status code
 * @returns {string} - Error type
 */
export const categorizeError = (status) => {
  if (status === 0) {
    return ErrorTypes.NETWORK;
  }
  if (status >= 500) {
    return ErrorTypes.SERVER;
  }
  if (status === 401) {
    return ErrorTypes.AUTHENTICATION;
  }
  if (status === 403) {
    return ErrorTypes.AUTHORIZATION;
  }
  if (status === 404) {
    return ErrorTypes.NOT_FOUND;
  }
  if (status === 400 || status === 422) {
    return ErrorTypes.VALIDATION;
  }
  return ErrorTypes.UNKNOWN;
};

/**
 * Handles API errors consistently
 * @param {Error|Response} error - Error object or Response
 * @returns {Object} - Formatted error object
 */
export const handleApiError = async (error) => {
  // If it's a Response object (from fetch) or has Response-like properties
  if (error instanceof Response || (error && typeof error.status === 'number' && error.headers)) {
    const parsedError = await parseApiError(error);
    const errorType = categorizeError(parsedError.status);
    
    return {
      ...parsedError,
      type: errorType,
      isNetworkError: parsedError.status === 0,
      isAuthError: parsedError.status === 401,
      isNotFound: parsedError.status === 404
    };
  }

  // If it's a network error (no response)
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return {
      message: 'Network error. Please check your connection.',
      type: ErrorTypes.NETWORK,
      isNetworkError: true,
      isAuthError: false,
      isNotFound: false
    };
  }

  // If it's a regular Error object
  if (error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred',
      type: ErrorTypes.UNKNOWN,
      isNetworkError: false,
      isAuthError: false,
      isNotFound: false,
      originalError: error
    };
  }

  // Fallback
  return {
    message: 'An unexpected error occurred',
    type: ErrorTypes.UNKNOWN,
    isNetworkError: false,
    isAuthError: false,
    isNotFound: false
  };
};

/**
 * Gets user-friendly error message
 * @param {Object} error - Error object from handleApiError
 * @param {Object} translations - Translation function or object
 * @returns {string} - User-friendly error message
 */
export const getUserFriendlyMessage = (error, translations = {}) => {
  const t = typeof translations === 'function' ? translations : (key) => translations[key] || key;

  if (error.isNetworkError) {
    return t('error.network') || 'Network error. Please check your connection and try again.';
  }

  if (error.isAuthError) {
    return t('error.authentication') || 'Authentication failed. Please log in again.';
  }

  if (error.isNotFound) {
    return t('error.notFound') || 'The requested resource was not found.';
  }

  if (error.type === ErrorTypes.VALIDATION) {
    return error.message || t('error.validation') || 'Validation error. Please check your input.';
  }

  if (error.type === ErrorTypes.SERVER) {
    return t('error.server') || 'Server error. Please try again later.';
  }

  return error.message || t('error.unknown') || 'An unexpected error occurred. Please try again.';
};
