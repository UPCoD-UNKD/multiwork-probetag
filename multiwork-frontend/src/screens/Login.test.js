import React from 'react';
import { screen } from '@testing-library/react';
import { Login } from './Login';
import { renderWithProviders } from '../test-utils/testHelpers';

// Mock FormLogin component
jest.mock('../components/forms/FormLogin', () => ({
  FormLogin: () => <div data-testid="form-login">Login Form</div>,
}));

describe('Login Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login screen correctly', () => {
    renderWithProviders(<Login />);
    expect(screen.getByTestId('form-login')).toBeInTheDocument();
  });
});
