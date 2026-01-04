import * as commentsApi from './comments.api';
import { apiFetch } from './client';
import { handleApiError } from '../utils/errorHandler';

jest.mock('./client');
jest.mock('../utils/errorHandler');
jest.mock('../utils/logger', () => ({
  logError: jest.fn(),
}));

describe('comments.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getComment', () => {
    test('fetches comment successfully', async () => {
      const mockComment = { id: 1, text: 'Test comment' };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockComment,
      });

      const result = await commentsApi.getComment(1);

      expect(apiFetch).toHaveBeenCalledWith('/api/comment/1', {
        method: 'GET',
      });
      expect(result).toEqual(mockComment);
    });

    test('handles error response', async () => {
      const mockError = { message: 'Comment not found' };
      apiFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ message: 'Comment not found' }),
      });
      handleApiError.mockResolvedValue(mockError);

      await expect(commentsApi.getComment(999)).rejects.toThrow('Comment not found');
    });
  });

  describe('createComment', () => {
    test('creates comment successfully', async () => {
      const mockComment = { id: 1, text: 'New comment' };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockComment,
      });

      const result = await commentsApi.createComment('New comment');

      expect(apiFetch).toHaveBeenCalledWith('/api/comment/', {
        method: 'POST',
        body: JSON.stringify({ text: 'New comment' }),
      });
      expect(result).toEqual(mockComment);
    });

    test('handles error response', async () => {
      const mockError = { message: 'Failed to create' };
      apiFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ message: 'Failed to create' }),
      });
      handleApiError.mockResolvedValue(mockError);

      await expect(commentsApi.createComment('Test')).rejects.toThrow('Failed to create');
    });
  });

  describe('addCommentToProject', () => {
    test('adds comment to project successfully', async () => {
      const mockProject = { id: 1, comments: [{ id: 1, text: 'New comment' }] };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockProject,
      });

      const result = await commentsApi.addCommentToProject(1, 'New comment');

      expect(apiFetch).toHaveBeenCalledWith('/api/project/1/comment', {
        method: 'PATCH',
        body: expect.stringContaining('"text":"New comment"'),
      });
      expect(result).toEqual(mockProject);
    });

    test('throws error for invalid project id', async () => {
      await expect(commentsApi.addCommentToProject('undefined', 'Test')).rejects.toThrow('Invalid project ID');
      await expect(commentsApi.addCommentToProject(null, 'Test')).rejects.toThrow('Invalid project ID');
      await expect(commentsApi.addCommentToProject('null', 'Test')).rejects.toThrow('Invalid project ID');
    });

    test('handles error response', async () => {
      const mockError = { message: 'Failed to add comment' };
      apiFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ message: 'Failed to add comment' }),
      });
      handleApiError.mockResolvedValue(mockError);

      await expect(commentsApi.addCommentToProject(1, 'Test')).rejects.toThrow('Failed to add comment');
    });
  });
});
