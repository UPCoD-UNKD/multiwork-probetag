/**
 * Sentry configuration for error tracking and performance monitoring.
 * Only initializes in production or when REACT_APP_SENTRY_DSN is set.
 */

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

/**
 * Initialize Sentry
 */
export const initSentry = () => {
  const dsn = process.env.REACT_APP_SENTRY_DSN;
  const environment = process.env.NODE_ENV || 'development';

  // Only initialize if DSN is provided
  if (!dsn) {
    // In development, this is expected and not an error
    // Only log in production if DSN is missing (which would be a configuration issue)
    if (environment === 'production') {
      console.warn('Sentry DSN not provided. Error tracking disabled.');
    } else {
      // Use debug level in development to avoid console noise
      console.debug('Sentry DSN not provided. Error tracking disabled (expected in development).');
    }
    return;
  }

  Sentry.init({
    dsn,
    environment,
    integrations: [
      new BrowserTracing({
        // Set tracing origins
        tracingOrigins: [
          'localhost',
          /^\//, // All relative URLs
          process.env.REACT_APP_API_URL || 'http://localhost:8080',
        ],
      }),
    ],
    
    // Performance Monitoring
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0, // 10% in production, 100% in dev
    
    // Session Replay (optional, can be enabled later)
    // replaysSessionSampleRate: 0.1,
    // replaysOnErrorSampleRate: 1.0,
    
    // Release tracking
    release: process.env.REACT_APP_VERSION || '0.1.0',
    
    // Error filtering
    beforeSend(event, hint) {
      // Filter out known non-critical errors
      if (event.exception) {
        const error = hint.originalException;
        
        // Ignore network errors (handled separately)
        if (error && error.message && error.message.includes('Failed to fetch')) {
          return null;
        }
        
        // Ignore AbortError (cancelled requests)
        if (error && error.name === 'AbortError') {
          return null;
        }
      }
      
      return event;
    },
    
    // User context (will be set when user logs in)
    initialScope: {
      tags: {
        component: 'frontend',
      },
    },
  });

  // Only log in development
  if (environment === 'development') {
    console.log('Sentry initialized for', environment);
  }
};

/**
 * Set user context for Sentry
 * @param {Object} user - User object with id, email, username
 */
export const setSentryUser = (user) => {
  if (!user) {
    Sentry.setUser(null);
    return;
  }

  Sentry.setUser({
    id: user.id?.toString(),
    email: user.email,
    username: user.username,
  });
};

/**
 * Clear user context
 */
export const clearSentryUser = () => {
  Sentry.setUser(null);
};

/**
 * Add breadcrumb for debugging
 * @param {string} message - Breadcrumb message
 * @param {string} category - Breadcrumb category
 * @param {Object} data - Additional data
 */
export const addBreadcrumb = (message, category = 'default', data = {}) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level: 'info',
    data,
  });
};
