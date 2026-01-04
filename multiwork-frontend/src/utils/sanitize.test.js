import {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeEmail,
  sanitizeUsername,
  sanitizeProjectName,
  sanitizeComment,
  sanitizeBio,
} from './sanitize';

describe('sanitize', () => {
  describe('sanitizeHtml', () => {
    test('removes script tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      expect(sanitizeHtml(input)).toBe('Hello');
    });

    test('removes event handlers', () => {
      const input = '<div onclick="alert(\'xss\')">Test</div>';
      expect(sanitizeHtml(input)).not.toContain('onclick');
    });

    test('removes javascript: protocol', () => {
      const input = '<a href="javascript:alert(\'xss\')">Link</a>';
      expect(sanitizeHtml(input)).not.toContain('javascript:');
    });

    test('handles empty input', () => {
      expect(sanitizeHtml('')).toBe('');
      expect(sanitizeHtml(null)).toBe('');
    });
  });

  describe('sanitizeText', () => {
    test('removes HTML tags', () => {
      expect(sanitizeText('<p>Hello</p>')).toBe('Hello');
    });

    test('removes dangerous characters', () => {
      expect(sanitizeText('Hello<script>')).toBe('Hello');
      expect(sanitizeText('Hello<>')).toBe('Hello');
    });

    test('trims whitespace', () => {
      expect(sanitizeText('  Hello  ')).toBe('Hello');
    });
  });

  describe('sanitizeUrl', () => {
    test('allows http and https URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com/');
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com/');
    });

    test('rejects javascript: protocol', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
    });

    test('rejects data: protocol', () => {
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
    });

    test('handles invalid URLs', () => {
      expect(sanitizeUrl('not-a-url')).toBeNull();
      expect(sanitizeUrl('')).toBeNull();
    });
  });

  describe('sanitizeEmail', () => {
    test('sanitizes valid email', () => {
      expect(sanitizeEmail('Test@Example.COM')).toBe('test@example.com');
    });

    test('removes HTML tags', () => {
      expect(sanitizeEmail('<script>test@example.com</script>')).toBe('');
    });

    test('rejects invalid email format', () => {
      expect(sanitizeEmail('not-an-email')).toBe('');
    });
  });

  describe('sanitizeUsername', () => {
    test('allows alphanumeric, underscore, hyphen', () => {
      expect(sanitizeUsername('user_123-name')).toBe('user_123-name');
    });

    test('removes invalid characters', () => {
      expect(sanitizeUsername('user@name')).toBe('username');
      expect(sanitizeUsername('user name')).toBe('username');
    });

    test('limits length to 50', () => {
      const longUsername = 'a'.repeat(100);
      expect(sanitizeUsername(longUsername).length).toBe(50);
    });
  });

  describe('sanitizeProjectName', () => {
    test('removes HTML tags', () => {
      expect(sanitizeProjectName('<script>Project</script>')).toBe('Project');
    });

    test('removes dangerous characters', () => {
      expect(sanitizeProjectName('Project<>')).toBe('Project');
    });

    test('limits length to 200', () => {
      const longName = 'a'.repeat(300);
      expect(sanitizeProjectName(longName).length).toBe(200);
    });
  });

  describe('sanitizeComment', () => {
    test('removes HTML tags', () => {
      expect(sanitizeComment('<p>Comment</p>')).toBe('Comment');
    });

    test('limits length to 5000', () => {
      const longComment = 'a'.repeat(6000);
      expect(sanitizeComment(longComment).length).toBe(5000);
    });
  });

  describe('sanitizeBio', () => {
    test('removes HTML tags', () => {
      expect(sanitizeBio('<p>Bio</p>')).toBe('Bio');
    });

    test('limits length to 1000', () => {
      const longBio = 'a'.repeat(2000);
      expect(sanitizeBio(longBio).length).toBe(1000);
    });
  });
});
