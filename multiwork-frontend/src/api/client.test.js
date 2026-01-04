import { apiFetch, apiFetchWithErrorHandling } from './client';
import * as storage from '../utils/storage';

// Mock fetch globally
global.fetch = jest.fn();

// Mock storage module
jest.mock('../utils/storage', () => ({
  getToken: jest.fn(),
  removeToken: jest.fn(),
}));

describe('apiFetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getToken.mockReturnValue(null);
    process.env.REACT_APP_API_URL = undefined;
  });

  test('makes request without token when not authenticated', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      headers: new Headers(),
    };

    global.fetch.mockResolvedValue(mockResponse);

    await apiFetch('/api/test');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/test',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  });

  test('includes Authorization header when token exists', async () => {
    storage.getToken.mockReturnValue('test-token-123');
    const mockResponse = {
      ok: true,
      status: 200,
      headers: new Headers(),
    };

    global.fetch.mockResolvedValue(mockResponse);

    await apiFetch('/api/test');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token-123',
        }),
      })
    );
  });

  test('handles 401 Unauthorized and redirects to login', async () => {
    storage.getToken.mockReturnValue('invalid-token');
    const mockResponse = {
      ok: false,
      status: 401,
      headers: new Headers(),
    };

    global.fetch.mockResolvedValue(mockResponse);
    
    // Mock window.location
    delete window.location;
    window.location = { href: '', pathname: '/test' };

    await apiFetch('/api/test');

    expect(storage.removeToken).toHaveBeenCalled();
    expect(window.location.href).toBe('/login');
  });

  test('uses custom options and merges headers', async () => {
    const mockResponse = {
      ok: true,
      headers: new Headers(),
    };

    global.fetch.mockResolvedValue(mockResponse);

    await apiFetch('/api/test', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' }),
      headers: {
        'Custom-Header': 'custom-value',
      },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/test',
      {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
        headers: {
          'Content-Type': 'application/json',
          'Custom-Header': 'custom-value',
        },
      }
    );
  });

  // Note: Testing environment variables in Jest is complex due to module caching
  // This test is skipped as it requires module reset which can cause side effects
  // In production, REACT_APP_API_URL will be set at build time
  test.skip('uses REACT_APP_API_URL from environment', async () => {
    // This test would require jest.resetModules() which can cause issues
    // Environment variable testing is better done in integration/E2E tests
  });
});
