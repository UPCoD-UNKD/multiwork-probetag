import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { isAuthenticated } from '../utils/storage';

/**
 * ProtectedRoute component - protects routes that require authentication.
 * Redirects to login if user is not authenticated.
 * Includes additional security checks.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 * @param {Array<string>} props.allowedRoles - Optional array of allowed user roles
 */
const ProtectedRoute = ({ children, requireAuth = true, allowedRoles = null }) => {
  const { isAuth } = useAuth();
  const location = useLocation();
  const { t } = useLanguage();

  // Check authentication using secure storage
  const hasValidToken = isAuthenticated();

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuth && !hasValidToken) {
    // Save the location they were trying to go to
    // This allows redirecting back after login
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
        aria-label={t('auth.redirectToLogin') || 'Redirecting to login'}
      />
    );
  }

  // TODO: Add role-based access control when user roles are implemented
  // if (allowedRoles && !allowedRoles.includes(userRole)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
