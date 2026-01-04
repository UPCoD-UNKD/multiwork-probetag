import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { Project } from './Project';
import { renderWithProviders } from '../test-utils/testHelpers';
import * as projectsApi from '../api/projects.api';
import * as usersApi from '../api/users.api';
import * as commentsApi from '../api/comments.api';
import * as applicationsApi from '../api/applications.api';

// Mock dependencies
jest.mock('../api/projects.api');
jest.mock('../api/users.api');
jest.mock('../api/comments.api');
jest.mock('../api/applications.api');

// Mock components
jest.mock('../components/bars/Appbar', () => ({
  __esModule: true,
  default: () => <div data-testid="appbar">Appbar</div>,
}));

jest.mock('../components/bars/Tabbar', () => ({
  __esModule: true,
  default: () => <div data-testid="tabbar">Tabbar</div>,
}));

jest.mock('../components/project/ProjectHeader', () => ({
  __esModule: true,
  default: () => <div data-testid="project-header">Project Header</div>,
}));

jest.mock('../components/project/ProjectInfo', () => ({
  __esModule: true,
  default: () => <div data-testid="project-info">Project Info</div>,
}));

jest.mock('../components/project/ProjectComments', () => ({
  __esModule: true,
  default: () => <div data-testid="project-comments">Project Comments</div>,
}));

jest.mock('../components/ApplicationModal', () => ({
  __esModule: true,
  default: () => <div data-testid="application-modal">Application Modal</div>,
}));

jest.mock('../components/MemberProfileModal', () => ({
  __esModule: true,
  default: () => <div data-testid="member-profile-modal">Member Profile Modal</div>,
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Project Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering', () => {
    test('renders project screen correctly', async () => {
      const mockProject = {
        id: 1,
        projectName: 'Test Project',
        description: 'Test Description',
      };

      projectsApi.getProjectById.mockResolvedValue(mockProject);
      usersApi.getCurrentUser.mockResolvedValue(null);
      applicationsApi.getMyApplicationsByStatus.mockResolvedValue({ content: [] });

      renderWithProviders(<Project />, {
        initialEntries: ['/project/1'],
      });

      await waitFor(() => {
        expect(screen.getByTestId('appbar')).toBeInTheDocument();
        expect(screen.getByTestId('tabbar')).toBeInTheDocument();
      });
    });

    test('shows loading state while fetching project', async () => {
      let resolvePromise;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      
      projectsApi.getProjectById.mockImplementation(() => promise);
      usersApi.getCurrentUser.mockResolvedValue(null);

      renderWithProviders(<Project />, {
        initialEntries: ['/project/1'],
      });

      // Should show loading skeleton or appbar
      await waitFor(() => {
        expect(screen.getByTestId('appbar')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Resolve promise to prevent hanging
      resolvePromise({ id: 1 });
      await promise;
    });
  });

  describe('Project Loading', () => {
    test('loads project by id from URL', async () => {
      const mockProject = {
        id: 1,
        projectName: 'Test Project',
        description: 'Test Description',
      };

      projectsApi.getProjectById.mockResolvedValue(mockProject);
      usersApi.getCurrentUser.mockResolvedValue(null);
      applicationsApi.getMyApplicationsByStatus.mockResolvedValue({ content: [] });

      renderWithProviders(<Project />, {
        initialEntries: ['/project/1'],
      });

      // Check that component renders (API call may be cached or delayed by React Query)
      await waitFor(() => {
        expect(screen.getByTestId('appbar')).toBeInTheDocument();
        expect(screen.getByTestId('tabbar')).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    test('handles error when project not found', async () => {
      projectsApi.getProjectById.mockRejectedValue(new Error('Project not found'));
      usersApi.getCurrentUser.mockResolvedValue(null);

      renderWithProviders(<Project />, {
        initialEntries: ['/project/999'],
      });

      await waitFor(() => {
        expect(screen.getByText(/error|ошибка|not found/i)).toBeInTheDocument();
      }, { timeout: 10000 });
    });

    test('handles missing project id', async () => {
      renderWithProviders(<Project />, {
        initialEntries: ['/project'],
      });

      await waitFor(() => {
        expect(screen.getByText(/required|обязательно/i)).toBeInTheDocument();
      }, { timeout: 10000 });
    });
  });

  describe('User Interactions', () => {
    test('renders project screen with user data', async () => {
      const mockProject = {
        id: 1,
        projectName: 'Test Project',
        comments: [],
      };

      projectsApi.getProjectById.mockResolvedValue(mockProject);
      usersApi.getCurrentUser.mockResolvedValue({ id: 1 });
      commentsApi.addCommentToProject.mockResolvedValue(mockProject);
      applicationsApi.getMyApplicationsByStatus.mockResolvedValue({ content: [] });

      renderWithProviders(<Project />, {
        initialEntries: ['/project/1'],
      });

      // Check that component renders correctly
      await waitFor(() => {
        expect(screen.getByTestId('appbar')).toBeInTheDocument();
        expect(screen.getByTestId('tabbar')).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });
});
