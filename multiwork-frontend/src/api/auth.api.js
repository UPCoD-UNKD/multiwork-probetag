import { apiFetch } from './client';
import { setToken } from '../utils/storage';

export const login = async (email, password) => {
  const response = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  let data;
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || 'Login failed');
    }
  } catch (e) {
    // If parsing fails, use the error message
    if (e instanceof Error && e.message !== 'Login failed') {
      throw e;
    }
    throw new Error('Login failed');
  }

  if (!response.ok) {
    // Handle ErrorResponse format: { message: "..." }
    const errorMessage = typeof data === 'object' && data !== null
      ? (data.message || JSON.stringify(data))
      : (data || 'Login failed');
    throw new Error(errorMessage);
  }

  // Use secure storage instead of localStorage
  setToken(data.token);
  return data;
};
export const register = async (email, username, password) => {
  const response = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, username, password }),
  });

  let data;
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || 'Registration failed');
    }
  } catch (e) {
    // If parsing fails, use the error message
    if (e instanceof Error && e.message !== 'Registration failed') {
      throw e;
    }
    throw new Error('Registration failed');
  }

  if (!response.ok) {
    // Handle ErrorResponse format: { message: "..." }
    const errorMessage = typeof data === 'object' && data !== null
      ? (data.message || JSON.stringify(data))
      : (data || 'Registration failed');
    throw new Error(errorMessage);
  }

  // Save token if registration returns it (for auto-login after registration)
  if (data && data.token) {
    setToken(data.token);
  }

  return data;
};

