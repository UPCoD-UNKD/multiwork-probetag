import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { FormLogin } from './FormLogin';
import { renderWithProviders, mockNavigate } from '../../test-utils/testHelpers';
import * as authApi from '../../api/auth.api';

// Mock the auth API
jest.mock('../../api/auth.api');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('FormLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockNavigate.mockClear();
  });

  test('renders login form', () => {
    renderWithProviders(<FormLogin />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  test('submits form with valid credentials', async () => {
    authApi.login.mockResolvedValue({ token: 'test-token' });

    renderWithProviders(<FormLogin />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    
    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(passwordInput, {
      target: { value: 'password123' },
    });
    
    const submitButton = screen.getByRole('button', { name: /sign in|signing in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith('test@example.com', 'password123');
    }, { timeout: 5000 });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    }, { timeout: 5000 });
  });

  test('displays error message on login failure', async () => {
    authApi.login.mockRejectedValue(new Error('Invalid credentials'));

    renderWithProviders(<FormLogin />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('disables submit button while loading', async () => {
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    authApi.login.mockImplementation(() => promise);

    renderWithProviders(<FormLogin />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });

    const submitButton = screen.getByRole('button', { name: /sign in|signing in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    }, { timeout: 2000 });
    
    // Resolve promise to prevent hanging
    resolvePromise({});
    await promise;
  });
});
