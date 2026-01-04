import {
  setSecureItem,
  getSecureItem,
  removeSecureItem,
  clearSecureStorage,
  setToken,
  getToken,
  removeToken,
  isAuthenticated,
  STORAGE_KEYS,
} from './storage';

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
});

describe('storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
  });

  describe('setSecureItem', () => {
    test('sets item in sessionStorage', () => {
      const result = setSecureItem('test-key', 'test-value');
      expect(result).toBe(true);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');
    });

    test('handles storage errors gracefully', () => {
      mockSessionStorage.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      const result = setSecureItem('test-key', 'test-value');
      expect(result).toBe(false);
    });
  });

  describe('getSecureItem', () => {
    test('gets item from sessionStorage', () => {
      mockSessionStorage.getItem.mockReturnValue('test-value');
      const result = getSecureItem('test-key');
      expect(result).toBe('test-value');
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    test('returns null for non-existent item', () => {
      mockSessionStorage.getItem.mockReturnValue(null);
      const result = getSecureItem('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('removeSecureItem', () => {
    test('removes item from sessionStorage', () => {
      const result = removeSecureItem('test-key');
      expect(result).toBe(true);
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('test-key');
    });
  });

  describe('clearSecureStorage', () => {
    test('clears all sessionStorage', () => {
      const result = clearSecureStorage();
      expect(result).toBe(true);
      expect(mockSessionStorage.clear).toHaveBeenCalled();
    });
  });

  describe('token management', () => {
    test('setToken stores token', () => {
      const result = setToken('test-token-123');
      expect(result).toBe(true);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.TOKEN, 'test-token-123');
    });

    test('getToken retrieves token', () => {
      mockSessionStorage.getItem.mockReturnValue('test-token-123');
      const result = getToken();
      expect(result).toBe('test-token-123');
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.TOKEN);
    });

    test('removeToken removes token', () => {
      const result = removeToken();
      expect(result).toBe(true);
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.TOKEN);
    });

    test('isAuthenticated returns true when token exists', () => {
      mockSessionStorage.getItem.mockReturnValue('test-token-123');
      expect(isAuthenticated()).toBe(true);
    });

    test('isAuthenticated returns false when token is missing', () => {
      mockSessionStorage.getItem.mockReturnValue(null);
      expect(isAuthenticated()).toBe(false);
    });

    test('isAuthenticated returns false when token is empty string', () => {
      mockSessionStorage.getItem.mockReturnValue('');
      expect(isAuthenticated()).toBe(false);
    });
  });
});
