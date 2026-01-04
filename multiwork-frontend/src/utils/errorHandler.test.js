import { parseApiError, categorizeError, handleApiError, getUserFriendlyMessage, ErrorTypes } from './errorHandler';

describe('errorHandler', () => {
  describe('parseApiError', () => {
    test('parses JSON error response', async () => {
      const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ message: 'Validation error' }),
      };

      const result = await parseApiError(mockResponse);

      expect(result).toEqual({
        message: 'Validation error',
        status: 400,
        statusText: 'Bad Request',
        data: { message: 'Validation error' },
      });
    });

    test('parses text error response', async () => {
      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        headers: {
          get: jest.fn().mockReturnValue('text/plain'),
        },
        text: jest.fn().mockResolvedValue('Server error'),
      };

      const result = await parseApiError(mockResponse);

      expect(result.message).toBe('Server error');
      expect(result.status).toBe(500);
    });

    test('handles parsing errors gracefully', async () => {
      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockRejectedValue(new Error('Parse error')),
      };

      const result = await parseApiError(mockResponse);

      expect(result.message).toBe('An error occurred');
    });
  });

  describe('categorizeError', () => {
    test('categorizes 401 as AUTHENTICATION', () => {
      expect(categorizeError(401)).toBe(ErrorTypes.AUTHENTICATION);
    });

    test('categorizes 403 as AUTHORIZATION', () => {
      expect(categorizeError(403)).toBe(ErrorTypes.AUTHORIZATION);
    });

    test('categorizes 404 as NOT_FOUND', () => {
      expect(categorizeError(404)).toBe(ErrorTypes.NOT_FOUND);
    });

    test('categorizes 400/422 as VALIDATION', () => {
      expect(categorizeError(400)).toBe(ErrorTypes.VALIDATION);
      expect(categorizeError(422)).toBe(ErrorTypes.VALIDATION);
    });

    test('categorizes 500+ as SERVER', () => {
      expect(categorizeError(500)).toBe(ErrorTypes.SERVER);
      expect(categorizeError(503)).toBe(ErrorTypes.SERVER);
    });

    test('categorizes 0 as NETWORK', () => {
      expect(categorizeError(0)).toBe(ErrorTypes.NETWORK);
    });
  });

  describe('handleApiError', () => {
    test('handles Response object', async () => {
      // Create a Response-like object (mocked for testing)
      const mockResponse = {
        status: 404,
        statusText: 'Not Found',
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ message: 'Not found' }),
      };

      const result = await handleApiError(mockResponse);

      // categorizeError should return NOT_FOUND for 404
      expect(result.type).toBe(ErrorTypes.NOT_FOUND);
      expect(result.isNotFound).toBe(true);
      expect(result.status).toBe(404);
    });

    test('handles network errors', async () => {
      const networkError = new TypeError('Failed to fetch');
      const result = await handleApiError(networkError);

      expect(result.type).toBe(ErrorTypes.NETWORK);
      expect(result.isNetworkError).toBe(true);
    });

    test('handles regular Error objects', async () => {
      const error = new Error('Something went wrong');
      const result = await handleApiError(error);

      expect(result.type).toBe(ErrorTypes.UNKNOWN);
      expect(result.message).toBe('Something went wrong');
    });
  });

  describe('getUserFriendlyMessage', () => {
    test('returns network error message', () => {
      const error = { isNetworkError: true, type: ErrorTypes.NETWORK };
      const t = (key) => key === 'error.network' ? 'Network error' : undefined;
      
      const result = getUserFriendlyMessage(error, t);
      expect(result).toBe('Network error');
    });

    test('returns authentication error message', () => {
      const error = { isAuthError: true, type: ErrorTypes.AUTHENTICATION };
      const t = (key) => key === 'error.authentication' ? 'Auth error' : undefined;
      
      const result = getUserFriendlyMessage(error, t);
      expect(result).toBe('Auth error');
    });

    test('returns validation error message', () => {
      const error = { type: ErrorTypes.VALIDATION, message: 'Invalid input' };
      const t = () => undefined;
      
      expect(getUserFriendlyMessage(error, t)).toBe('Invalid input');
    });

    test('returns server error message', () => {
      const error = { type: ErrorTypes.SERVER };
      const t = (key) => key === 'error.server' ? 'Server error' : undefined;
      
      const result = getUserFriendlyMessage(error, t);
      expect(result).toBe('Server error');
    });

    test('returns default message for unknown errors', () => {
      const error = { type: ErrorTypes.UNKNOWN };
      const t = (key) => key === 'error.unknown' ? 'Unknown error' : undefined;
      
      const result = getUserFriendlyMessage(error, t);
      expect(result).toBe('Unknown error');
    });
  });
});
