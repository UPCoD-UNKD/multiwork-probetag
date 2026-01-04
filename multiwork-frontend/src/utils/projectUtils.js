import cameraPlaceholder from '../assets/svg/projects/camera-placeholder.svg';
import { getCachedImage } from './imageCache';

/**
 * Utility functions for project-related operations.
 * Centralized to avoid code duplication across components.
 */

/**
 * Gets status color based on project status
 * @param {string} status - Project status
 * @returns {string} - Color hex code
 */
export const getStatusColor = (status) => {
  const statusStr = status?.toUpperCase() || '';
  switch (statusStr) {
    case 'IN_PROGRESS':
      return '#39AA8F'; // green
    case 'DONE':
      return '#FEB700'; // golden
    case 'CANCELLED':
      return '#D1085B'; // magenta
    default:
      return '#4ED9EC'; // blue
  }
};

/**
 * Formats status text from Set or Array
 * @param {Set|Array} statusSet - Status set or array
 * @returns {string} - Formatted status text
 */
export const formatStatus = (statusSet) => {
  if (!statusSet || (Array.isArray(statusSet) && statusSet.length === 0)) {
    return 'New';
  }
  const status = Array.isArray(statusSet) ? statusSet[0] : Array.from(statusSet)[0];
  return status?.replace(/_/g, ' ') || 'New';
};

/**
 * Converts byte array or base64 string to base64 image data URL
 * Uses image cache to avoid re-processing the same images
 * @param {Array|string} projectPhoto - Project photo as byte array or base64 string
 * @returns {string} - Data URL for image or placeholder
 */
export const getProjectLogo = (projectPhoto) => {
  return getCachedImage(projectPhoto, cameraPlaceholder);
};

/**
 * Gets members count from project members (handles both Array and Set)
 * @param {Array|Set} members - Project members
 * @returns {number} - Members count
 */
export const getMembersCount = (members) => {
  if (!members) return 0;
  
  if (Array.isArray(members)) {
    return members.length;
  }
  
  if (members.size !== undefined) {
    return members.size;
  }
  
  return 0;
};

/**
 * Maps project data to ProjectCard props format
 * @param {Object} project - Project object from API
 * @returns {Object} - Mapped project data for ProjectCard
 */
export const mapProjectToCard = (project) => {
  const membersCount = getMembersCount(project.members);
  const status = formatStatus(project.projectStatuses);
  
  // Get original status for color lookup (before formatting)
  const originalStatus = project.projectStatuses && (
    Array.isArray(project.projectStatuses) 
      ? project.projectStatuses[0] 
      : Array.from(project.projectStatuses)[0]
  );
  
  return {
    id: project.id,
    logo: getProjectLogo(project.projectPhoto),
    title: project.projectName || 'Untitled Project',
    desc: project.description || '',
    status: status,
    members: membersCount,
    preferredTeamSize: project.preferredTeamSize,
    color: getStatusColor(originalStatus)
  };
};
