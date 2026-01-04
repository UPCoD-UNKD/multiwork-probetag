/**
 * Client-side validation schemas and utilities.
 * Uses simple validation functions (can be replaced with yup if needed).
 */

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password validation rules
 */
export const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 100,
  requireUppercase: false,
  requireLowercase: false,
  requireNumbers: false,
  requireSpecialChars: false
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'Email is required' };
  }
  
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true, error: null };
};

/**
 * Validates password
 * @param {string} password - Password to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return { valid: false, error: 'Password is required' };
  }
  
  if (password.length < PASSWORD_RULES.minLength) {
    return { 
      valid: false, 
      error: `Password must be at least ${PASSWORD_RULES.minLength} characters` 
    };
  }
  
  if (password.length > PASSWORD_RULES.maxLength) {
    return { 
      valid: false, 
      error: `Password must be no more than ${PASSWORD_RULES.maxLength} characters` 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Validates username
 * @param {string} username - Username to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return { valid: false, error: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  
  if (username.length > 50) {
    return { valid: false, error: 'Username must be no more than 50 characters' };
  }
  
  // Check for valid characters (alphanumeric, underscore, hyphen)
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { 
      valid: false, 
      error: 'Username can only contain letters, numbers, underscores, and hyphens' 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Validates project name
 * @param {string} projectName - Project name to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateProjectName = (projectName) => {
  if (!projectName || projectName.trim() === '') {
    return { valid: false, error: 'Project name is required' };
  }
  
  if (projectName.length < 1) {
    return { valid: false, error: 'Project name cannot be empty' };
  }
  
  if (projectName.length > 200) {
    return { valid: false, error: 'Project name must be no more than 200 characters' };
  }
  
  return { valid: true, error: null };
};

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateUrl = (url) => {
  if (!url || url.trim() === '') {
    return { valid: true, error: null }; // URL is optional
  }
  
  try {
    new URL(url);
    return { valid: true, error: null };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
};

/**
 * Validates bio length
 * @param {string} bio - Bio text to validate
 * @param {number} maxLength - Maximum length (default: 1000)
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateBio = (bio, maxLength = 1000) => {
  if (!bio) {
    return { valid: true, error: null }; // Bio is optional
  }
  
  if (bio.length > maxLength) {
    return { valid: false, error: `Bio must be no more than ${maxLength} characters` };
  }
  
  return { valid: true, error: null };
};

/**
 * Validates login form
 * @param {Object} data - { email, password }
 * @returns {Object} - { valid: boolean, errors: Object }
 */
export const validateLoginForm = (data) => {
  const errors = {};
  
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.error;
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.error;
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates registration form
 * @param {Object} data - { email, username, password }
 * @returns {Object} - { valid: boolean, errors: Object }
 */
export const validateRegistrationForm = (data) => {
  const errors = {};
  
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.error;
  }
  
  const usernameValidation = validateUsername(data.username);
  if (!usernameValidation.valid) {
    errors.username = usernameValidation.error;
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.error;
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
