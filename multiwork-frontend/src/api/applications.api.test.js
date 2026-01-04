import * as applicationsApi from './applications.api';
import { apiFetch } from './client';
import { handleApiError } from '../utils/errorHandler';

jest.mock('./client');
jest.mock('../utils/errorHandler');
jest.mock('../utils/logger', () => ({
  logError: jest.fn(),
}));

describe('applications.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createApplication', () => {
    test('creates application successfully', async () => {
      const mockApplication = { id: 1, projectId: 1, message: 'Test message' };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApplication,
      });

      const result = await applicationsApi.createApplication(1, 'Test message');

      expect(apiFetch).toHaveBeenCalledWith('/api/project-application', {
        method: 'POST',
        body: JSON.stringify({
          projectId: 1,
          message: 'Test message',
        }),
      });
      expect(result).toEqual(mockApplication);
    });

    test('creates application without message', async () => {
      const mockApplication = { id: 1, projectId: 1, message: null };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApplication,
      });

      const result = await applicationsApi.createApplication(1);

      expect(apiFetch).toHaveBeenCalledWith('/api/project-application', {
        method: 'POST',
        body: JSON.stringify({
          projectId: 1,
          message: null,
        }),
      });
      expect(result).toEqual(mockApplication);
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

      await expect(applicationsApi.createApplication(1)).rejects.toThrow('Failed to create');
    });
  });

  describe('getApplicationsByProject', () => {
    test('fetches applications by project successfully', async () => {
      const mockData = { content: [{ id: 1 }], totalElements: 1 };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await applicationsApi.getApplicationsByProject(1);

      expect(apiFetch).toHaveBeenCalledWith(
        '/api/project-application/project/1?page=0&size=20',
        { method: 'GET' }
      );
      expect(result).toEqual(mockData);
    });

    test('handles error response', async () => {
      const mockError = { message: 'Failed to fetch' };
      apiFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ message: 'Failed to fetch' }),
      });
      handleApiError.mockResolvedValue(mockError);

      await expect(applicationsApi.getApplicationsByProject(1)).rejects.toThrow('Failed to fetch');
    });
  });

  describe('approveApplication', () => {
    test('approves application successfully', async () => {
      const mockApplication = { id: 1, status: 'APPROVED' };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApplication,
      });

      const result = await applicationsApi.approveApplication(1);

      expect(apiFetch).toHaveBeenCalledWith('/api/project-application/1/approve', {
        method: 'POST',
      });
      expect(result).toEqual(mockApplication);
    });

    test('handles error response', async () => {
      const mockError = { message: 'Failed to approve' };
      apiFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ message: 'Failed to approve' }),
      });
      handleApiError.mockResolvedValue(mockError);

      await expect(applicationsApi.approveApplication(1)).rejects.toThrow('Failed to approve');
    });
  });

  describe('rejectApplication', () => {
    test('rejects application successfully', async () => {
      const mockApplication = { id: 1, status: 'REJECTED' };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApplication,
      });

      const result = await applicationsApi.rejectApplication(1);

      expect(apiFetch).toHaveBeenCalledWith('/api/project-application/1/reject', {
        method: 'POST',
      });
      expect(result).toEqual(mockApplication);
    });
  });

  describe('cancelApplication', () => {
    test('cancels application successfully', async () => {
      const mockApplication = { id: 1, status: 'CANCELLED' };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApplication,
      });

      const result = await applicationsApi.cancelApplication(1);

      expect(apiFetch).toHaveBeenCalledWith('/api/project-application/1/cancel', {
        method: 'POST',
      });
      expect(result).toEqual(mockApplication);
    });
  });

  describe('getMyApplications', () => {
    test('fetches my applications successfully', async () => {
      const mockData = { content: [{ id: 1 }] };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await applicationsApi.getMyApplications();

      expect(apiFetch).toHaveBeenCalledWith(
        '/api/project-application/my-applications?page=0&size=20',
        { method: 'GET' }
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('getPendingCount', () => {
    test('fetches pending count successfully', async () => {
      const mockCount = 5;
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockCount,
      });

      const result = await applicationsApi.getPendingCount(1);

      expect(apiFetch).toHaveBeenCalledWith(
        '/api/project-application/project/1/pending-count',
        { method: 'GET' }
      );
      expect(result).toBe(5);
    });
  });
});
