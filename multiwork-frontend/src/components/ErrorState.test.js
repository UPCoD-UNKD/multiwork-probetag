import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorState from './ErrorState';
import { ViewModeProvider } from '../viewmode/ViewModeContext';

const renderWithProvider = (component) => {
  return render(
    <ViewModeProvider>
      {component}
    </ViewModeProvider>
  );
};

describe('ErrorState', () => {
  test('renders error message', () => {
    renderWithProvider(<ErrorState error="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  test('renders with title', () => {
    renderWithProvider(
      <ErrorState error="Error message" title="Error Title" />
    );
    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  test('renders retry button when onRetry is provided', () => {
    const handleRetry = jest.fn();
    renderWithProvider(
      <ErrorState error="Error" onRetry={handleRetry} />
    );
    
    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();
  });

  test('calls onRetry when retry button is clicked', () => {
    const handleRetry = jest.fn();
    renderWithProvider(
      <ErrorState error="Error" onRetry={handleRetry} />
    );
    
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  test('uses custom retry label', () => {
    const handleRetry = jest.fn();
    renderWithProvider(
      <ErrorState 
        error="Error" 
        onRetry={handleRetry} 
        retryLabel="Try Again" 
      />
    );
    
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  test('does not render retry button when onRetry is not provided', () => {
    renderWithProvider(<ErrorState error="Error" />);
    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });

  test('has proper ARIA attributes', () => {
    const { container } = renderWithProvider(
      <ErrorState error="Error message" />
    );
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });
});
