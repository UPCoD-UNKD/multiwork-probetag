import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { renderWithProviders } from '../test-utils/testHelpers';
import * as storage from '../utils/storage';

// Mock storage
jest.mock('../utils/storage', () => ({
  isAuthenticated: jest.fn(),
  getToken: jest.fn(),
  setToken: jest.fn(),
  removeToken: jest.fn(),
}));

const TestComponent = () => <div>Protected Content</div>;
const LoginComponent = () => <div>Login Page</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.isAuthenticated.mockReturnValue(false);
  });

  test('renders children when user is authenticated', async () => {
    storage.isAuthenticated.mockReturnValue(true);
    renderWithProviders(
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        } />
      </Routes>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('redirects to login when user is not authenticated', async () => {
    storage.isAuthenticated.mockReturnValue(false);
    renderWithProviders(
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginComponent />} />
      </Routes>
    );
    
    await waitFor(() => {
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check login page is shown
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('allows access when authenticated', async () => {
    storage.isAuthenticated.mockReturnValue(true);
    
    renderWithProviders(
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        } />
      </Routes>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('allows access when requireAuth is false', () => {
    storage.isAuthenticated.mockReturnValue(false);
    renderWithProviders(
      <Routes>
        <Route path="/" element={
          <ProtectedRoute requireAuth={false}>
            <TestComponent />
          </ProtectedRoute>
        } />
      </Routes>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects when not authenticated', async () => {
    storage.isAuthenticated.mockReturnValue(false);
    renderWithProviders(
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginComponent />} />
      </Routes>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
