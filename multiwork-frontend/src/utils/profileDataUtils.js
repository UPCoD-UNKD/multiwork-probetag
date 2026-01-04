/**
 * Utility functions for profile data transformation.
 * Handles conversion between different data formats (arrays, Sets, etc.)
 */

/**
 * Converts skills to array format
 * @param {Array|Set} skills - Skills in any format
 * @returns {Array} - Skills as array
 */
export const normalizeSkills = (skills) => {
  if (!skills) return [];
  return Array.isArray(skills) ? skills : Array.from(skills);
};

/**
 * Converts social media to array format
 * @param {Array|Set} socialMedia - Social media in any format
 * @returns {Array} - Social media as array
 */
export const normalizeSocialMedia = (socialMedia) => {
  if (!socialMedia) return [];
  return Array.isArray(socialMedia) ? socialMedia : Array.from(socialMedia);
};

/**
 * Converts links to array format
 * @param {Array|Set} links - Links in any format
 * @returns {Array} - Links as array
 */
export const normalizeLinks = (links) => {
  if (!links) return [];
  return Array.isArray(links) ? links : Array.from(links);
};

/**
 * Prepares user data for form initialization
 * @param {Object} user - User object from API
 * @returns {Object} - Form data object
 */
export const prepareFormData = (user) => {
  if (!user) return {
    fullName: '',
    bio: '',
    avatar: '',
    skills: [],
    socialMediaSet: [],
    links: []
  };

  return {
    fullName: user.fullName || '',
    bio: user.bio || '',
    avatar: user.avatar || '',
    skills: normalizeSkills(user.skills),
    socialMediaSet: normalizeSocialMedia(user.socialMediaSet),
    links: normalizeLinks(user.links)
  };
};

/**
 * Prepares user data for API update
 * @param {Object} user - Current user object
 * @param {Object} formData - Form data object
 * @returns {Object} - Data ready for API update
 */
export const prepareUpdateData = (user, formData) => {
  // Filter out empty social media and links
  const validSocialMedia = (formData.socialMediaSet || []).filter(
    sm => sm.referenceSocialMedia && sm.referenceSocialMedia.trim() !== ''
  );
  
  const validLinks = (formData.links || []).filter(
    link => link.title && link.title.trim() !== '' && link.reference && link.reference.trim() !== ''
  );

  return {
    id: user.id,
    fullName: formData.fullName || null,
    username: user.username,
    email: user.email,
    bio: formData.bio || null,
    avatar: formData.avatar || null,
    skills: formData.skills || [],
    socialMediaSet: validSocialMedia,
    links: validLinks
  };
};
