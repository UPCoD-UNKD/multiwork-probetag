import { login, register } from './auth.api';
import { apiFetch } from './client';
import * as storage from '../utils/storage';

jest.mock('./client');

// Mock sessionStorage
const mockSessionStorage = (() => {
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
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
});

// Mock storage module
jest.mock('../utils/storage', () => {
  const mockStore = {};
  return {
    setToken: jest.fn((token) => {
      mockStore.token = token;
      return true;
    }),
    getToken: jest.fn(() => mockStore.token || null),
    removeToken: jest.fn(() => {
      delete mockStore.token;
      return true;
    }),
    isAuthenticated: jest.fn(() => !!mockStore.token),
  };
});

describe('auth.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
  });

  describe('login', () => {
    test('successfully logs in and stores token', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: () => 'application/json',
        },
        json: async () => ({ token: 'test-token-123' }),
      };

      apiFetch.mockResolvedValue(mockResponse);

      const result = await login('test@example.com', 'password123');

      expect(apiFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      });
      expect(result).toEqual({ token: 'test-token-123' });
      // Check that setToken was called (token is stored via setToken)
      expect(storage.setToken).toHaveBeenCalledWith('test-token-123');
    });

    test('throws error on failed login', async () => {
      const mockResponse = {
        ok: false,
        headers: {
          get: () => 'application/json',
        },
        json: async () => ({ message: 'Invalid credentials' }),
      };

      apiFetch.mockResolvedValue(mockResponse);

      await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });

    test('handles non-JSON error response', async () => {
      const mockResponse = {
        ok: false,
        headers: {
          get: () => 'text/plain',
        },
        text: async () => 'Server error',
      };

      apiFetch.mockResolvedValue(mockResponse);

      await expect(login('test@example.com', 'password123')).rejects.toThrow('Server error');
    });
  });

  describe('register', () => {
    test('successfully registers user', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: () => 'application/json',
        },
        json: async () => ({ message: 'User created successfully' }),
      };

      apiFetch.mockResolvedValue(mockResponse);

      const result = await register('test@example.com', 'testuser', 'password123');

      expect(apiFetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', username: 'testuser', password: 'password123' }),
      });
      expect(result).toEqual({ message: 'User created successfully' });
    });

    test('throws error on failed registration', async () => {
      const mockResponse = {
        ok: false,
        headers: {
          get: () => 'application/json',
        },
        json: async () => ({ message: 'Email already exists' }),
      };

      apiFetch.mockResolvedValue(mockResponse);

      await expect(register('existing@example.com', 'testuser', 'password123')).rejects.toThrow('Email already exists');
    });
  });
});
