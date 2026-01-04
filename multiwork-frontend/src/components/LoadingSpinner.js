import React from 'react';
import './LoadingSpinner.sass';

/**
 * Animated loading spinner component
 * Replaces plain text loading messages with a beautiful animation
 */
const LoadingSpinner = ({ message, size = 'medium' }) => {
  const sizeClass = size === 'small' ? 'small' : size === 'large' ? 'large' : '';
  
  return (
    <div className="loading-container" role="status" aria-live="polite" aria-label="Loading">
      <div className={`spinner ${sizeClass}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {message && (
        <p className="loading-message">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
