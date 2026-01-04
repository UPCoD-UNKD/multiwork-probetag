import * as usersApi from './users.api';
import { apiFetch } from './client';
import { handleApiError } from '../utils/errorHandler';

jest.mock('./client');
jest.mock('../utils/errorHandler');
jest.mock('../utils/logger', () => ({
  logError: jest.fn(),
}));

describe('users.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    test('fetches user by id successfully', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      });

      const result = await usersApi.getUserById(1);

      expect(apiFetch).toHaveBeenCalledWith('/api/user/1', {
        method: 'GET',
      });
      expect(result).toEqual(mockUser);
    });

    test('handles error response', async () => {
      const mockError = { message: 'User not found' };
      apiFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ message: 'User not found' }),
      });
      handleApiError.mockResolvedValue(mockError);

      await expect(usersApi.getUserById(999)).rejects.toThrow('User not found');
    });
  });

  describe('getCurrentUser', () => {
    test('fetches current user successfully', async () => {
      const mockUser = { id: 1, username: 'currentuser', email: 'current@example.com' };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      });

      const result = await usersApi.getCurrentUser();

      expect(apiFetch).toHaveBeenCalledWith('/api/user/me', {
        method: 'GET',
      });
      expect(result).toEqual(mockUser);
    });

    test('handles error response', async () => {
      const mockError = { message: 'Unauthorized' };
      apiFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ message: 'Unauthorized' }),
      });
      handleApiError.mockResolvedValue(mockError);

      await expect(usersApi.getCurrentUser()).rejects.toThrow('Unauthorized');
    });
  });

  describe('getCurrentUserProjects', () => {
    test('fetches current user projects successfully', async () => {
      const mockProjects = [{ id: 1, projectName: 'Project 1' }];
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockProjects,
      });

      const result = await usersApi.getCurrentUserProjects();

      expect(apiFetch).toHaveBeenCalledWith('/api/user/me/projects', {
        method: 'GET',
      });
      expect(result).toEqual(mockProjects);
    });

    test('handles non-JSON response', async () => {
      apiFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: {
          get: jest.fn().mockReturnValue('text/plain'),
        },
        text: jest.fn().mockResolvedValue('Error message'),
      });
      handleApiError.mockResolvedValue({ message: 'Error message' });

      await expect(usersApi.getCurrentUserProjects()).rejects.toThrow();
    });

    test('handles error response', async () => {
      const mockError = { message: 'Failed to fetch projects' };
      apiFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ message: 'Failed to fetch projects' }),
      });
      handleApiError.mockResolvedValue(mockError);

      await expect(usersApi.getCurrentUserProjects()).rejects.toThrow('Failed to fetch projects');
    });
  });

  describe('updateUser', () => {
    test('updates user successfully', async () => {
      const mockUser = { id: 1, username: 'updateduser', fullName: 'Updated Name' };
      const updateData = { id: 1, fullName: 'Updated Name' };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      });

      const result = await usersApi.updateUser(updateData);

      expect(apiFetch).toHaveBeenCalledWith('/api/user', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(mockUser);
    });

    test('handles error response', async () => {
      const mockError = { message: 'Failed to update user' };
      apiFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ message: 'Failed to update user' }),
      });
      handleApiError.mockResolvedValue(mockError);

      await expect(usersApi.updateUser({})).rejects.toThrow('Failed to update user');
    });
  });
});
