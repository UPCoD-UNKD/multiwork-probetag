/**
 * Input sanitization utilities to prevent XSS attacks.
 * Sanitizes user input before displaying or storing.
 */

/**
 * Sanitizes HTML content to prevent XSS
 * Removes potentially dangerous HTML tags and attributes
 * @param {string} dirty - Unsanitized HTML string
 * @returns {string} - Sanitized string
 */
export const sanitizeHtml = (dirty) => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  // Remove script tags and event handlers
  let clean = dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '');

  // Remove dangerous attributes
  clean = clean.replace(/\s*(on\w+|href|src|action|formaction)\s*=\s*["'][^"']*["']/gi, '');

  return clean.trim();
};

/**
 * Sanitizes plain text input
 * Removes HTML tags and potentially dangerous characters
 * @param {string} input - Unsanitized text
 * @returns {string} - Sanitized text
 */
export const sanitizeText = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags
  let clean = input.replace(/<[^>]*>/g, '');
  
  // Remove potentially dangerous characters
  clean = clean
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .trim();

  return clean;
};

/**
 * Sanitizes URL to prevent XSS and malicious redirects
 * @param {string} url - URL to sanitize
 * @returns {string|null} - Sanitized URL or null if invalid
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    
    // Only allow http, https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return null;
    }

    // Remove javascript: and data: protocols
    if (url.toLowerCase().includes('javascript:') || url.toLowerCase().includes('data:')) {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    // If URL parsing fails, return null
    return null;
  }
};

/**
 * Sanitizes email address
 * @param {string} email - Email to sanitize
 * @returns {string} - Sanitized email
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return '';
  }

  // Remove HTML tags and dangerous characters
  let clean = email
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .toLowerCase();

  // If HTML tags were present, reject the email
  if (email !== clean && /<[^>]*>/.test(email)) {
    return '';
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(clean)) {
    return '';
  }

  return clean;
};

/**
 * Sanitizes username
 * @param {string} username - Username to sanitize
 * @returns {string} - Sanitized username
 */
export const sanitizeUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return '';
  }

  // Only allow alphanumeric, underscore, hyphen
  let clean = username
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .trim()
    .substring(0, 50); // Max length

  return clean;
};

/**
 * Sanitizes project name
 * @param {string} projectName - Project name to sanitize
 * @returns {string} - Sanitized project name
 */
export const sanitizeProjectName = (projectName) => {
  if (!projectName || typeof projectName !== 'string') {
    return '';
  }

  // Remove HTML tags and dangerous characters
  let clean = projectName
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 200); // Max length

  return clean;
};

/**
 * Sanitizes comment text
 * @param {string} text - Comment text to sanitize
 * @returns {string} - Sanitized text
 */
export const sanitizeComment = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Remove HTML tags but preserve line breaks
  let clean = text
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 5000); // Max length

  return clean;
};

/**
 * Sanitizes bio text
 * @param {string} bio - Bio text to sanitize
 * @returns {string} - Sanitized bio
 */
export const sanitizeBio = (bio) => {
  if (!bio || typeof bio !== 'string') {
    return '';
  }

  // Remove HTML tags but preserve line breaks
  let clean = bio
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 1000); // Max length

  return clean;
};
