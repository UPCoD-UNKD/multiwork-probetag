/**
 * Secure storage utility for sensitive data.
 * Uses sessionStorage instead of localStorage to reduce XSS attack surface.
 * Tokens are cleared when browser tab is closed.
 * 
 * For production, consider using httpOnly cookies managed by backend.
 */

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_PREFERENCES: 'user_preferences',
  VIEW_MODE: 'view_mode',
  LANGUAGE: 'language',
  LAST_VISIT_TIME: 'last_visit_time'
};

/**
 * Checks if storage is available
 * @returns {boolean}
 */
const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sets a value in secure storage (sessionStorage)
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 * @returns {boolean} - Success status
 */
export const setSecureItem = (key, value) => {
  if (!isStorageAvailable()) {
    console.warn('Storage is not available');
    return false;
  }

  try {
    sessionStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error('Failed to set storage item:', error);
    return false;
  }
};

/**
 * Gets a value from secure storage
 * @param {string} key - Storage key
 * @returns {string|null} - Stored value or null
 */
export const getSecureItem = (key) => {
  if (!isStorageAvailable()) {
    return null;
  }

  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    console.error('Failed to get storage item:', error);
    return null;
  }
};

/**
 * Removes a value from secure storage
 * @param {string} key - Storage key
 * @returns {boolean} - Success status
 */
export const removeSecureItem = (key) => {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to remove storage item:', error);
    return false;
  }
};

/**
 * Clears all secure storage
 * @returns {boolean} - Success status
 */
export const clearSecureStorage = () => {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.error('Failed to clear storage:', error);
    return false;
  }
};

/**
 * Token management functions
 */
export const setToken = (token) => {
  return setSecureItem(STORAGE_KEYS.TOKEN, token);
};

export const getToken = () => {
  return getSecureItem(STORAGE_KEYS.TOKEN);
};

export const removeToken = () => {
  return removeSecureItem(STORAGE_KEYS.TOKEN);
};

/**
 * Checks if user is authenticated (has valid token)
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = getToken();
  return !!token && token.trim() !== '';
};
