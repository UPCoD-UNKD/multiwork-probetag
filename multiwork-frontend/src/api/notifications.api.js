import { apiFetch } from './client';
import { logError } from '../utils/logger';
import { getSecureItem, setSecureItem, STORAGE_KEYS } from '../utils/storage';

// Key for storing last notification check time
const LAST_NOTIFICATION_CHECK_KEY = 'multiwork_last_notification_check';

/**
 * Gets the last time user checked notifications
 * @returns {Date|null} Last check time or null
 */
export const getLastNotificationCheck = () => {
  try {
    const stored = localStorage.getItem(LAST_NOTIFICATION_CHECK_KEY);
    return stored ? new Date(stored) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Updates the last notification check time to now
 */
export const updateLastNotificationCheck = () => {
  try {
    localStorage.setItem(LAST_NOTIFICATION_CHECK_KEY, new Date().toISOString());
  } catch (error) {
    // Ignore localStorage errors
  }
};

/**
 * Updates the last visit time to now (used for counting new comments)
 */
export const updateLastVisitTime = () => {
  setSecureItem(STORAGE_KEYS.LAST_VISIT_TIME, new Date().toISOString());
};

/**
 * Gets notification count for a specific project (applications + comments)
 * @param {number|string} projectId - Project ID
 * @returns {Promise<number>} Total notification count for the project
 */
export const getProjectNotificationCount = async (projectId) => {
  try {
    // Get pending applications count
    let applicationsCount = 0;
    try {
      const countResponse = await apiFetch(
        `/project-application/project/${projectId}/pending-count`,
        { method: 'GET' }
      );

      if (countResponse.ok) {
        const count = await countResponse.json();
        applicationsCount = typeof count === 'number' ? count : 0;
      }
    } catch (err) {
      logError('Failed to fetch pending count for project:', err);
    }

    // Get comments count
    let commentsCount = 0;
    try {
      const projectResponse = await apiFetch(`/project/${projectId}`, {
        method: 'GET',
      });

      if (projectResponse.ok) {
        const projectData = await projectResponse.json();
        const comments = projectData.comments || [];

        // Get last visit time to determine "new" comments
        const lastVisitTime = getSecureItem(STORAGE_KEYS.LAST_VISIT_TIME);

        if (Array.isArray(comments)) {
          if (lastVisitTime) {
            const lastVisit = new Date(lastVisitTime);
            commentsCount = comments.filter(comment => {
              if (!comment.date || !comment.time) return false;
              try {
                const commentDateTime = new Date(`${comment.date}T${comment.time}`);
                return commentDateTime > lastVisit;
              } catch {
                return true; // If we can't parse date, count as new
              }
            }).length;
          } else {
            // If no last visit time, count all comments
            commentsCount = comments.length;
          }
        }
      }
    } catch (err) {
      logError('Failed to fetch project comments:', err);
    }

    return applicationsCount + commentsCount;
  } catch (error) {
    logError('Failed to fetch project notification count:', error);
    return 0;
  }
};

/**
 * Gets notification count for current user (project creator)
 * Counts pending applications and new comments for user's projects
 * Currently counts all pending applications (can be enhanced to track new ones only)
 * 
 * @returns {Promise<Object>} Notification counts: { applications: number, comments: number, total: number }
 */
export const getNotificationCount = async () => {
  try {
    // Get user's created projects
    const userResponse = await apiFetch('/user/me', {
      method: 'GET',
    });

    if (!userResponse.ok) {
      return { applications: 0, comments: 0, total: 0 };
    }

    const userData = await userResponse.json();

    // Get creator projects
    let creatorProjects = [];
    if (userData.creatorProjects) {
      if (Array.isArray(userData.creatorProjects)) {
        creatorProjects = userData.creatorProjects;
      } else if (userData.creatorProjects.size !== undefined) {
        creatorProjects = Array.from(userData.creatorProjects);
      }
    }

    if (creatorProjects.length === 0) {
      return { applications: 0, comments: 0, total: 0 };
    }

    // Count pending applications for all creator projects
    let applicationsCount = 0;
    const applicationPromises = creatorProjects.map(async (project) => {
      try {
        const projectId = typeof project === 'object' ? project.id : project;
        if (!projectId) return 0;

        const countResponse = await apiFetch(
          `/project-application/project/${projectId}/pending-count`,
          { method: 'GET' }
        );

        if (countResponse.ok) {
          const count = await countResponse.json();
          return typeof count === 'number' ? count : 0;
        }
        return 0;
      } catch (err) {
        logError('Failed to fetch pending count for project:', err);
        return 0;
      }
    });

    const applicationCounts = await Promise.all(applicationPromises);
    applicationsCount = applicationCounts.reduce((sum, count) => sum + count, 0);

    // Count new comments for all creator projects
    // Get last visit time to determine "new" comments
    let commentsCount = 0;
    const lastVisitTime = getSecureItem(STORAGE_KEYS.LAST_VISIT_TIME);

    // Fetch all projects to count comments
    const projectDetailsPromises = creatorProjects.map(async (project) => {
      try {
        const projectId = typeof project === 'object' ? project.id : project;
        if (!projectId) return { commentsCount: 0 };

        const projectResponse = await apiFetch(`/project/${projectId}`, {
          method: 'GET',
        });

        if (!projectResponse.ok) {
          return { commentsCount: 0 };
        }

        const projectData = await projectResponse.json();
        const comments = projectData.comments || [];

        // Count comments (if lastVisitTime exists, count only newer comments)
        let newCommentsCount = 0;
        if (Array.isArray(comments)) {
          if (lastVisitTime) {
            const lastVisit = new Date(lastVisitTime);
            newCommentsCount = comments.filter(comment => {
              if (!comment.date || !comment.time) return false;
              try {
                const commentDateTime = new Date(`${comment.date}T${comment.time}`);
                return commentDateTime > lastVisit;
              } catch {
                return true; // If we can't parse date, count as new
              }
            }).length;
          } else {
            // If no last visit time, count all comments
            newCommentsCount = comments.length;
          }
        }

        return { commentsCount: newCommentsCount };
      } catch (err) {
        logError('Failed to fetch project comments:', err);
        return { commentsCount: 0 };
      }
    });

    const commentCounts = await Promise.all(projectDetailsPromises);
    commentsCount = commentCounts.reduce((sum, item) => sum + item.commentsCount, 0);

    return {
      applications: applicationsCount,
      comments: commentsCount,
      total: applicationsCount + commentsCount,
    };
  } catch (error) {
    logError('Failed to fetch notification count:', error);
    return { applications: 0, comments: 0, total: 0 };
  }
};
