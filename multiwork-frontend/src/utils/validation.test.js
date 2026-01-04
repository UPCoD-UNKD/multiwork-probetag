import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateProjectName,
  validateUrl,
  validateBio,
  validateLoginForm,
  validateRegistrationForm,
  PASSWORD_RULES,
} from './validation';

describe('validation', () => {
  describe('validateEmail', () => {
    test('validates correct email', () => {
      expect(validateEmail('test@example.com')).toEqual({ valid: true, error: null });
    });

    test('rejects empty email', () => {
      expect(validateEmail('')).toEqual({ valid: false, error: 'Email is required' });
      expect(validateEmail('   ')).toEqual({ valid: false, error: 'Email is required' });
    });

    test('rejects invalid email format', () => {
      expect(validateEmail('invalid')).toEqual({ valid: false, error: 'Invalid email format' });
      expect(validateEmail('test@')).toEqual({ valid: false, error: 'Invalid email format' });
      expect(validateEmail('@example.com')).toEqual({ valid: false, error: 'Invalid email format' });
    });
  });

  describe('validatePassword', () => {
    test('validates password with minimum length', () => {
      expect(validatePassword('12345678')).toEqual({ valid: true, error: null });
    });

    test('rejects password shorter than minimum', () => {
      expect(validatePassword('1234567')).toEqual({
        valid: false,
        error: `Password must be at least ${PASSWORD_RULES.minLength} characters`,
      });
    });

    test('rejects password longer than maximum', () => {
      const longPassword = 'a'.repeat(PASSWORD_RULES.maxLength + 1);
      expect(validatePassword(longPassword)).toEqual({
        valid: false,
        error: `Password must be no more than ${PASSWORD_RULES.maxLength} characters`,
      });
    });

    test('rejects empty password', () => {
      expect(validatePassword('')).toEqual({ valid: false, error: 'Password is required' });
    });
  });

  describe('validateUsername', () => {
    test('validates correct username', () => {
      expect(validateUsername('user123')).toEqual({ valid: true, error: null });
      expect(validateUsername('user_name')).toEqual({ valid: true, error: null });
      expect(validateUsername('user-name')).toEqual({ valid: true, error: null });
    });

    test('rejects username shorter than 3 characters', () => {
      expect(validateUsername('ab')).toEqual({ valid: false, error: 'Username must be at least 3 characters' });
    });

    test('rejects username longer than 50 characters', () => {
      const longUsername = 'a'.repeat(51);
      expect(validateUsername(longUsername)).toEqual({
        valid: false,
        error: 'Username must be no more than 50 characters',
      });
    });

    test('rejects username with invalid characters', () => {
      expect(validateUsername('user@name')).toEqual({
        valid: false,
        error: 'Username can only contain letters, numbers, underscores, and hyphens',
      });
    });
  });

  describe('validateProjectName', () => {
    test('validates correct project name', () => {
      expect(validateProjectName('My Project')).toEqual({ valid: true, error: null });
    });

    test('rejects empty project name', () => {
      expect(validateProjectName('')).toEqual({ valid: false, error: 'Project name is required' });
    });

    test('rejects project name longer than 200 characters', () => {
      const longName = 'a'.repeat(201);
      expect(validateProjectName(longName)).toEqual({
        valid: false,
        error: 'Project name must be no more than 200 characters',
      });
    });
  });

  describe('validateUrl', () => {
    test('validates correct URL', () => {
      expect(validateUrl('https://example.com')).toEqual({ valid: true, error: null });
      expect(validateUrl('http://example.com')).toEqual({ valid: true, error: null });
    });

    test('allows empty URL (optional)', () => {
      expect(validateUrl('')).toEqual({ valid: true, error: null });
    });

    test('rejects invalid URL format', () => {
      expect(validateUrl('not-a-url')).toEqual({ valid: false, error: 'Invalid URL format' });
    });
  });

  describe('validateBio', () => {
    test('allows empty bio (optional)', () => {
      expect(validateBio('')).toEqual({ valid: true, error: null });
      expect(validateBio(null)).toEqual({ valid: true, error: null });
    });

    test('validates bio within max length', () => {
      const bio = 'a'.repeat(500);
      expect(validateBio(bio)).toEqual({ valid: true, error: null });
    });

    test('rejects bio longer than max length', () => {
      const bio = 'a'.repeat(1001);
      expect(validateBio(bio)).toEqual({
        valid: false,
        error: 'Bio must be no more than 1000 characters',
      });
    });
  });

  describe('validateLoginForm', () => {
    test('validates correct login form', () => {
      const result = validateLoginForm({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    test('rejects form with invalid email', () => {
      const result = validateLoginForm({
        email: 'invalid',
        password: 'password123',
      });
      expect(result.valid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    test('rejects form with invalid password', () => {
      const result = validateLoginForm({
        email: 'test@example.com',
        password: 'short',
      });
      expect(result.valid).toBe(false);
      expect(result.errors.password).toBeDefined();
    });
  });

  describe('validateRegistrationForm', () => {
    test('validates correct registration form', () => {
      const result = validateRegistrationForm({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      });
      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    test('rejects form with invalid fields', () => {
      const result = validateRegistrationForm({
        email: 'invalid',
        username: 'ab',
        password: 'short',
      });
      expect(result.valid).toBe(false);
      expect(result.errors.email).toBeDefined();
      expect(result.errors.username).toBeDefined();
      expect(result.errors.password).toBeDefined();
    });
  });
});
