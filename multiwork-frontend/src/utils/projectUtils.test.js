import {
  getProjectLogo,
  getStatusColor,
  formatStatus,
  getMembersCount,
  mapProjectToCard,
} from './projectUtils';

describe('projectUtils', () => {
  describe('getProjectLogo', () => {
    test('returns placeholder for null/undefined', () => {
      expect(getProjectLogo(null)).toContain('camera-placeholder');
      expect(getProjectLogo(undefined)).toContain('camera-placeholder');
    });

    test('returns data URL for base64 image', () => {
      const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const result = getProjectLogo(base64Image);
      expect(result).toContain('data:image');
    });

    test('handles empty string', () => {
      expect(getProjectLogo('')).toContain('camera-placeholder');
    });
  });

  describe('getStatusColor', () => {
    test('returns correct color for IN_PROGRESS status', () => {
      expect(getStatusColor('IN_PROGRESS')).toBe('#39AA8F');
    });

    test('returns correct color for DONE status', () => {
      expect(getStatusColor('DONE')).toBe('#FEB700');
    });

    test('returns correct color for CANCELLED status', () => {
      expect(getStatusColor('CANCELLED')).toBe('#D1085B');
    });

    test('returns default color for unknown status', () => {
      expect(getStatusColor('UNKNOWN')).toBe('#4ED9EC');
    });
  });

  describe('formatStatus', () => {
    test('returns formatted status from array', () => {
      const statuses = ['IN_PROGRESS'];
      expect(formatStatus(statuses)).toBe('IN PROGRESS');
    });

    test('returns first status from array', () => {
      const statuses = ['IN_PROGRESS', 'DONE'];
      expect(formatStatus(statuses)).toBe('IN PROGRESS');
    });

    test('returns default for empty array', () => {
      expect(formatStatus([])).toBe('New');
    });

    test('returns default for null/undefined', () => {
      expect(formatStatus(null)).toBe('New');
      expect(formatStatus(undefined)).toBe('New');
    });

    test('handles Set format', () => {
      const statusSet = new Set(['IN_PROGRESS']);
      expect(formatStatus(statusSet)).toBe('IN PROGRESS');
    });
  });

  describe('getMembersCount', () => {
    test('returns count from array', () => {
      const members = [{ id: 1 }, { id: 2 }, { id: 3 }];
      expect(getMembersCount(members)).toBe(3);
    });

    test('returns size from Set-like object', () => {
      const members = { size: 5 };
      expect(getMembersCount(members)).toBe(5);
    });

    test('returns 0 for empty/null/undefined', () => {
      expect(getMembersCount([])).toBe(0);
      expect(getMembersCount(null)).toBe(0);
      expect(getMembersCount(undefined)).toBe(0);
    });
  });

  describe('mapProjectToCard', () => {
    test('maps project to card format', () => {
      const project = {
        id: 1,
        projectName: 'Test Project',
        description: 'Test description',
        projectPhoto: null,
        projectStatuses: ['IN_PROGRESS'],
        members: [{ id: 1 }, { id: 2 }],
        preferredTeamSize: 5,
      };

      const result = mapProjectToCard(project);

      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Project');
      expect(result.desc).toBe('Test description');
      expect(result.status).toBe('IN PROGRESS');
      expect(result.members).toBe(2);
      expect(result.preferredTeamSize).toBe(5);
      // getStatusColor uses original 'IN_PROGRESS' status
      expect(result.color).toBe('#39AA8F'); // green color for 'IN_PROGRESS'
    });

    test('handles missing optional fields', () => {
      const project = {
        id: 1,
        projectName: 'Test',
        projectStatuses: [],
        members: [],
      };

      const result = mapProjectToCard(project);

      expect(result.desc).toBe('');
      expect(result.status).toBe('New');
      expect(result.members).toBe(0);
    });
  });
});
