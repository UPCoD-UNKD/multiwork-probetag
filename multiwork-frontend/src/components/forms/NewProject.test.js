import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { NewProject } from './NewProject';
import { renderWithProviders, mockNavigate } from '../../test-utils/testHelpers';
import * as projectsApi from '../../api/projects.api';
import { toast } from 'react-toastify';

// Mock dependencies
jest.mock('../../api/projects.api');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('NewProject', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form with all inputs', () => {
    renderWithProviders(<NewProject />);
    
    expect(screen.getByPlaceholderText(/project name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/размер команды/i)).toBeInTheDocument();
  });

  test('updates project name on input change', () => {
    renderWithProviders(<NewProject />);
    
    const nameInput = screen.getByPlaceholderText(/project name/i);
    fireEvent.change(nameInput, { target: { value: 'My Project' } });
    
    expect(nameInput).toHaveValue('My Project');
  });

  test('updates description on input change', () => {
    renderWithProviders(<NewProject />);
    
    const descInput = screen.getByPlaceholderText(/description/i);
    fireEvent.change(descInput, { target: { value: 'Project description' } });
    
    expect(descInput).toHaveValue('Project description');
  });

  test('shows error when project name is empty', async () => {
    const { container } = renderWithProviders(<NewProject />);
    
    // Button should be disabled when project name is empty
    const submitButton = screen.getByRole('button', { name: /save/i });
    expect(submitButton).toBeDisabled();
    
    // Fill in project name to enable button
    const nameInput = screen.getByPlaceholderText(/project name/i);
    fireEvent.change(nameInput, { target: { value: 'Test' } });
    
    // Now clear it and try to submit via form submit event
    fireEvent.change(nameInput, { target: { value: ' ' } }); // Space to make trim() empty
    const form = nameInput.closest('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      // Find error element by class name (more reliable than text in different languages)
      const errorElement = container.querySelector('.error') || 
                          screen.queryByRole('alert');
      expect(errorElement).toBeTruthy();
      expect(errorElement).toHaveTextContent(/.+/); // Should have some text content
    }, { timeout: 3000 });
  });

  test('creates project successfully', async () => {
    const mockProject = { id: 1, name: 'Test Project' };
    projectsApi.createProject.mockResolvedValue(mockProject);
    
    renderWithProviders(<NewProject />);
    
    const nameInput = screen.getByPlaceholderText(/project name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Project' } });
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(projectsApi.createProject).toHaveBeenCalledWith(
        'Test Project',
        '',
        null
      );
      expect(toast.success).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/project/1/onboarding');
    }, { timeout: 5000 });
  });

  test('handles creation error', async () => {
    const errorMessage = 'Failed to create project';
    projectsApi.createProject.mockRejectedValue(new Error(errorMessage));
    
    renderWithProviders(<NewProject />);
    
    const nameInput = screen.getByPlaceholderText(/project name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Project' } });
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    }, { timeout: 5000 });
  });

  test('validates team size as positive number', async () => {
    renderWithProviders(<NewProject />);
    
    const nameInput = screen.getByPlaceholderText(/project name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Project' } });
    
    const teamSizeInput = screen.getByPlaceholderText(/размер команды/i);
    fireEvent.change(teamSizeInput, { target: { value: '-1' } });
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/положительным числом/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('disables submit button when loading', async () => {
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    projectsApi.createProject.mockImplementation(() => promise);
    
    renderWithProviders(<NewProject />);
    
    const nameInput = screen.getByPlaceholderText(/project name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Project' } });
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    }, { timeout: 1000 });
    
    // Resolve promise to prevent hanging
    resolvePromise({ id: 1 });
    await promise;
  });
});
