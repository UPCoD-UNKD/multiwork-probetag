import * as skillsApi from './skills.api';
import { apiFetch } from './client';
import { handleApiError } from '../utils/errorHandler';

jest.mock('./client');
jest.mock('../utils/errorHandler');
jest.mock('../utils/logger', () => ({
  logError: jest.fn(),
}));

describe('skills.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllSkills', () => {
    test('fetches all skills successfully', async () => {
      const mockSkills = [{ id: 1, name: 'JavaScript' }, { id: 2, name: 'React' }];
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockSkills,
      });

      const result = await skillsApi.getAllSkills();

      expect(apiFetch).toHaveBeenCalledWith('/api/skill/', {
        method: 'GET',
      });
      expect(result).toEqual(mockSkills);
    });

    test('handles error response', async () => {
      const mockError = { message: 'Failed to fetch skills' };
      apiFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ message: 'Failed to fetch skills' }),
      });
      handleApiError.mockResolvedValue(mockError);

      await expect(skillsApi.getAllSkills()).rejects.toThrow('Failed to fetch skills');
    });
  });
});
