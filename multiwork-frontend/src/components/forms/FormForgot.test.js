import React from 'react';
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { FormForgot } from './FormForgot';
import { renderWithProviders, mockNavigate } from '../../test-utils/testHelpers';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('FormForgot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    // Clear all timers to prevent hanging
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('renders form with email input', () => {
    renderWithProviders(<FormForgot />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('renders submit button', () => {
    renderWithProviders(<FormForgot />);
    
    const submitButton = screen.getByRole('button', { name: /recover/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  test('shows message after form submission', async () => {
    renderWithProviders(<FormForgot />);
    
    const form = screen.getByRole('button', { name: /recover/i }).closest('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText(/check your email/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('navigates to login after 2 seconds', async () => {
    jest.useFakeTimers();
    
    renderWithProviders(<FormForgot />);
    
    const form = screen.getByRole('button', { name: /recover/i }).closest('form');
    fireEvent.submit(form);
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }, { timeout: 1000 });
    
    jest.useRealTimers();
  });

  test('renders back to login link', () => {
    renderWithProviders(<FormForgot />);
    
    const backLink = screen.getByText(/back to login/i);
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/login');
  });

  test('handles form submission', () => {
    renderWithProviders(<FormForgot />);
    
    const form = screen.getByRole('button', { name: /recover/i }).closest('form');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    fireEvent(form, submitEvent);
    
    expect(submitEvent.defaultPrevented).toBe(true);
  });
});
