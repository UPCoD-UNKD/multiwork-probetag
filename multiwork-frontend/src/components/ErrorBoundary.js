import React from 'react';
import * as Sentry from '@sentry/react';
import { logError } from '../utils/logger';

/**
 * Error Boundary component to catch React errors and display fallback UI.
 * Prevents the entire app from crashing when a component throws an error.
 * Integrates with Sentry for error tracking.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    logError('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Send to Sentry
    try {
      Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
        tags: {
          errorBoundary: true,
        },
      });
    } catch (sentryError) {
      // If Sentry fails, at least log to console
      console.error('Failed to send error to Sentry:', sentryError);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Optionally reload the page
    // window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Fallback UI component displayed when an error occurs.
 * Uses simple translations (can be enhanced with context later).
 */
const ErrorFallback = ({ error, errorInfo, onReset }) => {
  // Simple fallback translations (can be enhanced with LanguageContext if needed)
  const t = (key) => {
    const translations = {
      'error.boundary.title': 'Oops! Something went wrong',
      'error.boundary.message': 'We\'re sorry, but something unexpected happened. Please try refreshing the page.',
      'error.boundary.details': 'Error Details (Development Only)',
      'error.boundary.tryAgain': 'Try Again',
      'error.boundary.reload': 'Reload Page'
    };
    return translations[key] || key;
  };

  return (
    <div 
      role="alert"
      aria-live="assertive"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#1a1a2e',
        color: '#ffffff',
        textAlign: 'center'
      }}
    >
      <div style={{
        maxWidth: '600px',
        padding: '2rem',
        backgroundColor: 'rgba(255, 68, 68, 0.1)',
        borderRadius: '16px',
        border: '2px solid rgba(255, 68, 68, 0.3)'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '1rem',
          color: '#ff6b6b'
        }}>
          {t('error.boundary.title') || 'Oops! Something went wrong'}
        </h1>
        
        <p style={{ 
          fontSize: '1.1rem', 
          marginBottom: '1.5rem',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          {t('error.boundary.message') || 'We\'re sorry, but something unexpected happened. Please try refreshing the page.'}
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            textAlign: 'left',
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            <summary style={{ 
              cursor: 'pointer',
              marginBottom: '0.5rem',
              color: '#4ED9EC'
            }}>
              {t('error.boundary.details') || 'Error Details (Development Only)'}
            </summary>
            <pre style={{
              fontSize: '0.85rem',
              color: '#ff6b6b',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {error.toString()}
              {errorInfo && errorInfo.componentStack}
            </pre>
          </details>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onReset}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4ED9EC',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#3bc4d6';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#4ED9EC';
              e.target.style.transform = 'translateY(0)';
            }}
            aria-label={t('error.boundary.tryAgain') || 'Try again'}
          >
            {t('error.boundary.tryAgain') || 'Try Again'}
          </button>
          
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            aria-label={t('error.boundary.reload') || 'Reload page'}
          >
            {t('error.boundary.reload') || 'Reload Page'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
