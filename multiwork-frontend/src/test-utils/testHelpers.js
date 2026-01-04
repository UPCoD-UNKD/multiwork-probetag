/**
 * Test utilities and helpers for consistent testing across the application.
 * Provides reusable functions to reduce code duplication in tests.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '../i18n/LanguageContext';
import { ViewModeProvider } from '../viewmode/ViewModeContext';
import { AuthProvider } from '../auth/AuthContext';

/**
 * Creates a test QueryClient with fast timeouts and disabled retries
 * This prevents tests from hanging on failed requests
 * 
 * Note: Each test should create its own QueryClient to avoid cache pollution
 * The QueryClient is automatically cleaned up after each test
 */
export const createTestQueryClient = (options = {}) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry in tests
        gcTime: 0, // Clear cache immediately
        staleTime: Infinity, // Data never becomes stale (prevents infinite refetch loops)
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false, // Disable polling
        refetchIntervalInBackground: false,
        networkMode: 'offlineFirst', // Don't make network requests, use cache only
        ...options.queries,
      },
      mutations: {
        retry: false,
        networkMode: 'offlineFirst',
        ...options.mutations,
      },
    },
    logger: {
      log: () => {},
      warn: () => {},
      error: () => {},
    },
  });
  
  // Track QueryClient instances for cleanup
  if (!global.queryClientInstances) {
    global.queryClientInstances = [];
  }
  global.queryClientInstances.push(client);
  
  return client;
};

/**
 * Cleans up a QueryClient by clearing all queries and cancelling pending requests
 * Call this in afterEach hooks to prevent memory leaks
 * 
 * @param {QueryClient} queryClient - The QueryClient to clean up
 */
export const cleanupQueryClient = (queryClient) => {
  if (queryClient) {
    queryClient.clear();
    queryClient.cancelQueries();
  }
};

/**
 * Renders a component with all necessary providers.
 * This is the standard way to render components in tests.
 * 
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Render options
 * @param {Array<string>} options.initialEntries - Initial router entries (default: ['/'])
 * @param {string} options.routerType - Router type: 'memory' (default) or 'browser'
 * @param {boolean} options.useRouter - Whether to wrap with router (default: true)
 * @param {QueryClient} options.queryClient - Custom QueryClient (default: test client)
 * @returns {Object} Render result from @testing-library/react
 */
export const renderWithProviders = (
  ui,
  {
    initialEntries = ['/'],
    routerType = 'memory',
    useRouter = true,
    queryClient = createTestQueryClient(),
    ...options
  } = {}
) => {
  const AllTheProviders = ({ children }) => {
    let content = children;

    if (useRouter) {
      const Router = routerType === 'memory' ? MemoryRouter : BrowserRouter;
      content = (
        <Router initialEntries={initialEntries}>
          {content}
        </Router>
      );
    }

    // Match the provider order from App.js: QueryClientProvider -> LanguageProvider -> AuthProvider -> ViewModeProvider
    return (
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <ViewModeProvider>
              {content}
            </ViewModeProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    );
  };

  return render(ui, {
    wrapper: AllTheProviders,
    ...options,
  });
};

/**
 * Renders a component with router only (for simpler component tests).
 * 
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Render options
 * @param {Array<string>} options.initialEntries - Initial router entries (default: ['/'])
 * @param {string} options.routerType - Router type: 'memory' (default) or 'browser'
 * @returns {Object} Render result from @testing-library/react
 */
export const renderWithRouter = (
  ui,
  {
    initialEntries = ['/'],
    routerType = 'memory',
  } = {}
) => {
  const Router = routerType === 'memory' ? MemoryRouter : BrowserRouter;
  
  return render(
    <Router initialEntries={initialEntries}>
      {ui}
    </Router>
  );
};

/**
 * Common mock implementations for frequently used modules
 * These are reset in beforeEach hooks in tests
 */
export const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
};

// Create mockNavigate function that can be reset
export const mockNavigate = jest.fn();

/**
 * Creates a mock sessionStorage for tests
 * @returns {Object} Mock sessionStorage object
 */
export const createMockSessionStorage = () => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
};

/**
 * Creates a mock localStorage for tests
 * @returns {Object} Mock localStorage object
 */
export const createMockLocalStorage = () => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
};

/**
 * Safely restores a mock if it exists
 * @param {Object} mock - Mock object to restore
 */
export const safeMockRestore = (mock) => {
  if (mock && typeof mock.mockRestore === 'function') {
    mock.mockRestore();
  }
};

/**
 * Waits for a condition with timeout
 * Useful for async operations in tests
 * @param {Function} condition - Function that returns truthy when condition is met
 * @param {number} timeout - Timeout in milliseconds (default: 1000)
 * @returns {Promise} Promise that resolves when condition is met
 */
export const waitForCondition = (condition, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let timeoutId = null;
    
    const checkCondition = () => {
      if (condition()) {
        if (timeoutId) clearTimeout(timeoutId);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        if (timeoutId) clearTimeout(timeoutId);
        reject(new Error('Condition not met within timeout'));
      } else {
        timeoutId = setTimeout(checkCondition, 10);
      }
    };
    
    checkCondition();
    
    // Cleanup on promise resolution/rejection
    Promise.resolve().then(() => {
      if (timeoutId) clearTimeout(timeoutId);
    }).catch(() => {
      if (timeoutId) clearTimeout(timeoutId);
    });
  });
};
