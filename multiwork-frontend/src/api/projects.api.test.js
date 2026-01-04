import * as projectsApi from './projects.api';
import { apiFetch } from './client';
import { handleApiError } from '../utils/errorHandler';

jest.mock('./client');
jest.mock('../utils/errorHandler');
jest.mock('../utils/logger', () => ({
  log: jest.fn(),
  logError: jest.fn(),
}));

describe('projects.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProjects', () => {
    test('fetches all projects successfully', async () => {
      const mockData = { content: [{ id: 1, projectName: 'Test' }] };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await projectsApi.getAllProjects();

      expect(apiFetch).toHaveBeenCalledWith('/api/project/?page=0&size=100', {
        method: 'GET',
      });
      expect(result).toEqual(mockData);
    });

    test('handles array response', async () => {
      const mockData = [{ id: 1, projectName: 'Test' }];
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await projectsApi.getAllProjects();

      expect(result).toEqual({ content: mockData });
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

      await expect(projectsApi.getAllProjects()).rejects.toThrow('Failed to fetch');
    });
  });

  describe('getProjectById', () => {
    test('fetches project by id successfully', async () => {
      const mockProject = { id: 1, projectName: 'Test Project' };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockProject,
      });

      const result = await projectsApi.getProjectById(1);

      expect(apiFetch).toHaveBeenCalledWith('/api/project/1', {
        method: 'GET',
      });
      expect(result).toEqual(mockProject);
    });

    test('throws error for invalid project id', async () => {
      await expect(projectsApi.getProjectById('undefined')).rejects.toThrow('Invalid project ID');
      await expect(projectsApi.getProjectById(null)).rejects.toThrow('Invalid project ID');
    });

    test('handles error response', async () => {
      const mockError = { message: 'Project not found' };
      apiFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ message: 'Project not found' }),
      });
      handleApiError.mockResolvedValue(mockError);

      await expect(projectsApi.getProjectById(999)).rejects.toThrow('Project not found');
    });
  });

  describe('createProject', () => {
    test('creates project successfully', async () => {
      const mockProject = { id: 1, projectName: 'New Project' };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockProject,
      });

      const result = await projectsApi.createProject('New Project', 'Description', 5);

      expect(apiFetch).toHaveBeenCalledWith('/api/project/', {
        method: 'POST',
        body: JSON.stringify({
          projectName: 'New Project',
          description: 'Description',
          preferredTeamSize: 5,
        }),
      });
      expect(result).toEqual(mockProject);
    });

    test('creates project without optional parameters', async () => {
      const mockProject = { id: 1, projectName: 'New Project' };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockProject,
      });

      const result = await projectsApi.createProject('New Project');

      expect(apiFetch).toHaveBeenCalledWith('/api/project/', {
        method: 'POST',
        body: JSON.stringify({
          projectName: 'New Project',
          description: '',
        }),
      });
      expect(result).toEqual(mockProject);
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

      await expect(projectsApi.createProject('Test')).rejects.toThrow('Failed to create');
    });
  });

  describe('updateProject', () => {
    test('updates project successfully', async () => {
      const mockProject = { id: 1, projectName: 'Updated Project' };
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockProject,
      });

      const updateData = { projectName: 'Updated Project' };
      const result = await projectsApi.updateProject(1, updateData);

      expect(apiFetch).toHaveBeenCalledWith('/api/project/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(mockProject);
    });

    test('handles error response', async () => {
      const mockError = { message: 'Failed to update' };
      apiFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ message: 'Failed to update' }),
      });
      handleApiError.mockResolvedValue(mockError);

      await expect(projectsApi.updateProject(1, {})).rejects.toThrow('Failed to update');
    });
  });

  describe('deleteProject', () => {
    test('deletes project successfully', async () => {
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ message: 'Project deleted successfully' }),
      });

      const result = await projectsApi.deleteProject(1);

      expect(apiFetch).toHaveBeenCalledWith('/api/project/1', {
        method: 'DELETE',
      });
      expect(result).toEqual({ message: 'Project deleted successfully' });
    });

    test('handles error response', async () => {
      const mockError = { message: 'Failed to delete' };
      apiFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ message: 'Failed to delete' }),
      });
      handleApiError.mockResolvedValue(mockError);

      await expect(projectsApi.deleteProject(1)).rejects.toThrow('Failed to delete');
    });
  });

  describe('getProjectsBySkillId', () => {
    test('fetches projects by skill id successfully', async () => {
      const mockData = [{ id: 1, projectName: 'Test' }];
      apiFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await projectsApi.getProjectsBySkillId(1);

      expect(apiFetch).toHaveBeenCalledWith('/api/project/find/1', {
        method: 'GET',
      });
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

      await expect(projectsApi.getProjectsBySkillId(1)).rejects.toThrow('Failed to fetch');
    });
  });
});
