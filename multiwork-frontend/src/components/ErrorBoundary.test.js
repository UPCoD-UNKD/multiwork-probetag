import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';
import * as Sentry from '@sentry/react';

// Mock Sentry
jest.mock('@sentry/react', () => ({
  captureException: jest.fn(),
}));

// Mock logger
jest.mock('../utils/logger', () => ({
  logError: jest.fn(),
}));

// Component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error for error boundary tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Safely restore console.error mock if it exists
    if (consoleErrorSpy && consoleErrorSpy.mockRestore) {
      consoleErrorSpy.mockRestore();
    }
  });

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('renders error fallback when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/Oops! Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/We're sorry/i)).toBeInTheDocument();
  });

  test('calls Sentry.captureException when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(Sentry.captureException).toHaveBeenCalled();
  });

  test('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    // Error details are in a <summary> element inside <details>
    const detailsElement = screen.getByText(/Error Details|Development Only/i);
    expect(detailsElement).toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });

  test('hides error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    const detailsButton = screen.queryByText(/Error Details/i);
    expect(detailsButton).not.toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });

  test('Try Again button is present and clickable', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/Oops! Something went wrong/i)).toBeInTheDocument();
    
    const tryAgainButton = screen.getByText(/Try Again/i);
    expect(tryAgainButton).toBeInTheDocument();
    
    // Button should be clickable
    fireEvent.click(tryAgainButton);
    expect(tryAgainButton).toBeInTheDocument();
  });

  test('Reload Page button is present', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    const reloadButton = screen.getByText(/Reload Page/i);
    expect(reloadButton).toBeInTheDocument();
  });

  test('has proper ARIA attributes', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });
});
