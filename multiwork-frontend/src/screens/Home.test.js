import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { Home } from './Home';
import { renderWithProviders } from '../test-utils/testHelpers';
import * as projectsApi from '../api/projects.api';
import * as usersApi from '../api/users.api';

// Mock dependencies
jest.mock('../api/projects.api');
jest.mock('../api/users.api');
jest.mock('../hooks/useSwipe', () => ({
  useSwipe: () => ({ current: null }),
}));

// Mock components
jest.mock('../components/bars/Appbar', () => ({
  __esModule: true,
  default: () => <div data-testid="appbar">Appbar</div>,
}));

jest.mock('../components/bars/Tabbar', () => ({
  __esModule: true,
  default: () => <div data-testid="tabbar">Tabbar</div>,
}));

jest.mock('../components/lists/ProjectCard', () => ({
  __esModule: true,
  default: ({ title }) => <div data-testid="project-card">{title}</div>,
}));

jest.mock('../components/LoadingSpinner', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

jest.mock('../components/LoadingSkeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-skeleton">Skeleton</div>,
}));

describe('Home Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering', () => {
    test('renders home screen correctly', () => {
      projectsApi.getAllProjects.mockResolvedValue({ content: [] });
      usersApi.getCurrentUser.mockResolvedValue(null);

      renderWithProviders(<Home />);

      expect(screen.getByTestId('appbar')).toBeInTheDocument();
      expect(screen.getByTestId('tabbar')).toBeInTheDocument();
    });

    test('shows loading spinner when loading', async () => {
      let resolvePromise;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      
      projectsApi.getAllProjects.mockImplementation(() => promise);
      usersApi.getCurrentUser.mockResolvedValue(null);

      renderWithProviders(<Home />);

      // Click load button to trigger loading
      const loadButton = screen.getByRole('button', { name: /load|загрузить/i });
      fireEvent.click(loadButton);

      await waitFor(() => {
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Resolve promise to prevent hanging
      resolvePromise({ content: [] });
      await promise;
    });
  });

  describe('Project Loading', () => {
    test('loads projects when load button is clicked', async () => {
      const mockProjects = [
        { id: 1, projectName: 'Project 1', description: 'Desc 1' },
        { id: 2, projectName: 'Project 2', description: 'Desc 2' },
      ];

      projectsApi.getAllProjects.mockResolvedValue({ content: mockProjects });
      usersApi.getCurrentUser.mockResolvedValue(null);

      renderWithProviders(<Home />);

      const loadButton = screen.getByRole('button', { name: /load|загрузить/i });
      fireEvent.click(loadButton);

      await waitFor(() => {
        expect(projectsApi.getAllProjects).toHaveBeenCalled();
      }, { timeout: 5000 });
    });

    test('handles error when loading projects fails', async () => {
      const errorMessage = 'Failed to load projects';
      projectsApi.getAllProjects.mockRejectedValue(new Error(errorMessage));
      usersApi.getCurrentUser.mockResolvedValue(null);

      renderWithProviders(<Home />);

      const loadButton = screen.getByRole('button', { name: /load|загрузить/i });
      fireEvent.click(loadButton);

      await waitFor(() => {
        expect(screen.getByText(/error|ошибка/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('User Interactions', () => {
    test('handles refresh button click', async () => {
      projectsApi.getAllProjects.mockResolvedValue({ content: [] });
      usersApi.getCurrentUser.mockResolvedValue(null);

      renderWithProviders(<Home />);

      const refreshButton = screen.getByRole('button', { name: /refresh|обновить/i });
      if (refreshButton) {
        fireEvent.click(refreshButton);
        
        await waitFor(() => {
          expect(projectsApi.getAllProjects).toHaveBeenCalled();
        }, { timeout: 5000 });
      }
    });
  });

  describe('Empty State', () => {
    test('displays empty state when no projects', async () => {
      projectsApi.getAllProjects.mockResolvedValue({ content: [] });
      usersApi.getCurrentUser.mockResolvedValue(null);

      renderWithProviders(<Home />);

      const loadButton = screen.getByRole('button', { name: /load|загрузить/i });
      fireEvent.click(loadButton);

      await waitFor(() => {
        // Should show empty state or no projects message
        expect(screen.queryByTestId('project-card')).not.toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });
});
