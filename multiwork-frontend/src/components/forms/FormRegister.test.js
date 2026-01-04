import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { FormRegister } from './FormRegister';
import { renderWithProviders, mockNavigate } from '../../test-utils/testHelpers';
import * as authApi from '../../api/auth.api';

// Mock the auth API
jest.mock('../../api/auth.api');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('FormRegister', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockNavigate.mockClear();
  });

  test('renders registration form', () => {
    renderWithProviders(<FormRegister />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    authApi.register.mockResolvedValue({});

    renderWithProviders(<FormRegister />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });
    
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith('test@example.com', 'testuser', 'password123');
    }, { timeout: 5000 });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    }, { timeout: 5000 });
  });

  test('displays error message on registration failure', async () => {
    authApi.register.mockRejectedValue(new Error('Email already exists'));

    renderWithProviders(<FormRegister />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'existing@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
