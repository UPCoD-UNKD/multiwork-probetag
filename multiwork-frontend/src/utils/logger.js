/**
 * Logger utility to replace console.log/error/warn.
 * Automatically disables logging in production builds.
 * Integrates with Sentry for error tracking in production.
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Get Sentry instance (lazy loaded to avoid issues if Sentry is not initialized)
 */
const getSentry = () => {
  try {
    return require('@sentry/react');
  } catch {
    return null;
  }
};

/**
 * Logs a message (only in development)
 */
export const log = (...args) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

/**
 * Logs an error and sends to Sentry in production
 */
export const logError = (...args) => {
  if (isDevelopment) {
    console.error(...args);
  } else {
    // In production, send to Sentry
    const Sentry = getSentry();
    if (Sentry && args[0]) {
      const error = args[0] instanceof Error 
        ? args[0] 
        : new Error(String(args[0]));
      
      Sentry.captureException(error, {
        extra: args.slice(1),
        level: 'error',
      });
    }
  }
};

/**
 * Logs a warning (only in development, but can be sent to Sentry)
 */
export const logWarn = (...args) => {
  if (isDevelopment) {
    console.warn(...args);
  } else {
    // Optionally send warnings to Sentry in production
    const Sentry = getSentry();
    if (Sentry && process.env.REACT_APP_SENTRY_LOG_WARNINGS === 'true') {
      Sentry.captureMessage(String(args[0]), {
        level: 'warning',
        extra: args.slice(1),
      });
    }
  }
};

/**
 * Logs debug information (only in development)
 */
export const logDebug = (...args) => {
  if (isDevelopment) {
    console.debug(...args);
  }
};

/**
 * Logs info (only in development)
 */
export const logInfo = (...args) => {
  if (isDevelopment) {
    console.info(...args);
  }
};

// Named exports (preferred over default export)
// If you need default export, use: import logger from '../utils/logger';
// const logger = { log, logError, logWarn, logDebug, logInfo };
// export default logger;
