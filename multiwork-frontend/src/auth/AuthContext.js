import { createContext, useContext, useState, useEffect } from 'react';
import { removeToken, setToken as setSecureToken, isAuthenticated } from '../utils/storage';
import { clearSentryUser } from '../config/sentry';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  const login = (token) => {
    if (setSecureToken(token)) {
      setIsAuth(true);
    }
  };

  const logout = () => {
    removeToken();
    setIsAuth(false);
    // Clear any other sensitive data
    sessionStorage.clear();
    // Clear Sentry user context
    try {
      clearSentryUser();
    } catch (e) {
      // Sentry might not be initialized in tests
      console.warn('Failed to clear Sentry user:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
