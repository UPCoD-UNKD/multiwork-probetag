// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure, cleanup } from '@testing-library/react';

// Set global test timeout to prevent hanging tests
jest.setTimeout(10000); // 10 seconds for all tests

// Configure default timeout for waitFor to prevent tests from hanging
// This is especially important for tests using React Query
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000, // 5 seconds default timeout for waitFor
});

// Cleanup after each test to prevent memory leaks and hanging queries
afterEach(() => {
  cleanup();
  
  // Clear all timers to prevent hanging tests
  try {
    jest.clearAllTimers();
    jest.useRealTimers();
  } catch (e) {
    // Ignore timer errors during cleanup
  }
  
  // Clear all QueryClient instances
  // This prevents queries from hanging between tests
  if (global.queryClientInstances) {
    global.queryClientInstances.forEach(client => {
      if (client) {
        try {
          client.clear();
          client.cancelQueries();
          client.removeQueries();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    });
    global.queryClientInstances = [];
  }
});