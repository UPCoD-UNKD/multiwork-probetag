import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import * as storage from '../utils/storage';

// Mock storage module
jest.mock('../utils/storage', () => ({
  setToken: jest.fn((token) => {
    mockStorage.token = token;
    return true;
  }),
  getToken: jest.fn(() => mockStorage.token || null),
  removeToken: jest.fn(() => {
    delete mockStorage.token;
  }),
  isAuthenticated: jest.fn(() => !!mockStorage.token),
}));

// Mock Sentry
jest.mock('../config/sentry', () => ({
  clearSentryUser: jest.fn(),
}));

const mockStorage = {};

const TestComponent = () => {
  const { isAuth, setIsAuth, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="isAuth">{isAuth ? 'authenticated' : 'not authenticated'}</div>
      <button onClick={() => setIsAuth(true)}>Set Auth</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete mockStorage.token;
    storage.isAuthenticated.mockReturnValue(false);
  });

  test('provides default auth state when no token', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('isAuth')).toHaveTextContent('not authenticated');
  });

  test('provides authenticated state when token exists', () => {
    storage.isAuthenticated.mockReturnValue(true);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('isAuth')).toHaveTextContent('authenticated');
  });

  test('setIsAuth updates auth state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('isAuth')).toHaveTextContent('not authenticated');
    
    act(() => {
      screen.getByText('Set Auth').click();
    });

    expect(screen.getByTestId('isAuth')).toHaveTextContent('authenticated');
  });

  test('logout clears token and sets auth to false', () => {
    storage.isAuthenticated.mockReturnValue(true);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('isAuth')).toHaveTextContent('authenticated');
    
    act(() => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('isAuth')).toHaveTextContent('not authenticated');
    expect(storage.removeToken).toHaveBeenCalled();
  });
});
