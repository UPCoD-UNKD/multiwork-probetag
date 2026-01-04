import { renderHook, waitFor, act } from '@testing-library/react';
import { useProfile } from './useProfile';
import * as usersApi from '../api/users.api';
import * as skillsApi from '../api/skills.api';
import { AVAILABLE_SKILLS } from '../constants/skills';
import { createTestQueryClient } from '../test-utils/testHelpers';
import { QueryClientProvider } from '@tanstack/react-query';

jest.mock('../api/users.api');
jest.mock('../api/skills.api');
jest.mock('../utils/profileDataUtils', () => ({
  prepareFormData: (user) => ({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    skills: user?.skills || [],
    socialMediaSet: user?.socialMediaSet || [],
    links: user?.links || [],
  }),
  prepareUpdateData: (user, formData) => ({
    id: user.id,
    ...formData,
  }),
  normalizeSkills: (skills) => skills || [],
}));

describe('useProfile', () => {
  let queryClient;
  
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = createTestQueryClient();
  });
  
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  test('loads user data on mount', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      fullName: 'Test User',
      bio: 'Test bio',
      avatar: 'avatar.jpg',
      skills: [],
    };

    usersApi.getCurrentUser.mockResolvedValue(mockUser);
    skillsApi.getAllSkills.mockResolvedValue([]);

    const { result } = renderHook(() => useProfile(), { wrapper });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 5000 });

    expect(result.current.user).toEqual(mockUser);
    expect(usersApi.getCurrentUser).toHaveBeenCalledTimes(1);
  });

  test('handles error when loading user', async () => {
    const error = new Error('Failed to load user');
    usersApi.getCurrentUser.mockRejectedValue(error);
    skillsApi.getAllSkills.mockResolvedValue([]);

    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 5000 });

    expect(result.current.error).toBe('Failed to load user');
  });

  test('loads skills on mount', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    const mockSkills = [{ id: 1, name: 'JavaScript' }];

    usersApi.getCurrentUser.mockResolvedValue(mockUser);
    skillsApi.getAllSkills.mockResolvedValue(mockSkills);

    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.allSkills).toEqual(mockSkills);
    }, { timeout: 5000 });
  });

  test('uses AVAILABLE_SKILLS as fallback when skills API fails', async () => {
    const mockUser = { id: 1, username: 'testuser' };

    usersApi.getCurrentUser.mockResolvedValue(mockUser);
    skillsApi.getAllSkills.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.allSkills).toEqual(AVAILABLE_SKILLS);
    }, { timeout: 5000 });
  });

  test('updates form data on input change', async () => {
    const mockUser = { id: 1, username: 'testuser', fullName: 'Original' };
    usersApi.getCurrentUser.mockResolvedValue(mockUser);
    skillsApi.getAllSkills.mockResolvedValue([]);

    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    }, { timeout: 5000 });

    act(() => {
      const event = {
        target: { name: 'fullName', value: 'New Name' },
      };
      result.current.handleInputChange(event);
    });

    expect(result.current.formData.fullName).toBe('New Name');
  });

  test('saves user profile successfully', async () => {
    const mockUser = { id: 1, username: 'testuser', fullName: 'Old Name' };
    const updatedUser = { id: 1, username: 'testuser', fullName: 'New Name', bio: '', avatar: '', skills: [], socialMediaSet: [], links: [] };

    usersApi.getCurrentUser.mockResolvedValue(mockUser);
    usersApi.updateUser.mockResolvedValue(updatedUser);
    skillsApi.getAllSkills.mockResolvedValue([]);

    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    }, { timeout: 5000 });

    act(() => {
      result.current.setIsEditing(true);
      result.current.handleInputChange({
        target: { name: 'fullName', value: 'New Name' },
      });
    });

    await act(async () => {
      await result.current.handleSave();
    });

    await waitFor(() => {
      // After save, user should be updated or formData should reflect changes
      expect(result.current.isEditing).toBe(false);
      // Check that updateUser was called
      expect(usersApi.updateUser).toHaveBeenCalled();
    }, { timeout: 5000 });
  });

  test('cancels editing and resets form data', async () => {
    const mockUser = { id: 1, username: 'testuser', fullName: 'Original Name', bio: '', avatar: '', skills: [], socialMediaSet: [], links: [] };
    usersApi.getCurrentUser.mockResolvedValue(mockUser);
    skillsApi.getAllSkills.mockResolvedValue([]);

    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    }, { timeout: 5000 });

    act(() => {
      result.current.setIsEditing(true);
      result.current.handleInputChange({
        target: { name: 'fullName', value: 'Changed Name' },
      });
    });

    act(() => {
      result.current.handleCancel();
    });

    await waitFor(() => {
      expect(result.current.isEditing).toBe(false);
      expect(result.current.formData.fullName).toBe('Original Name');
    }, { timeout: 5000 });
  });

  test('adds social media entry', async () => {
    const mockUser = { id: 1, username: 'testuser', fullName: '', bio: '', avatar: '', skills: [], socialMediaSet: [], links: [] };
    usersApi.getCurrentUser.mockResolvedValue(mockUser);
    skillsApi.getAllSkills.mockResolvedValue([]);

    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    }, { timeout: 5000 });

    act(() => {
      result.current.addSocialMedia();
    });

    // Social media should be added immediately (synchronous state update)
    expect(result.current.formData.socialMediaSet).toHaveLength(1);
    expect(result.current.formData.socialMediaSet[0]).toEqual({
      referenceSocialMedia: '',
    });
  });

  test('removes social media entry', async () => {
    const mockUser = { id: 1, username: 'testuser', fullName: '', bio: '', avatar: '', skills: [], socialMediaSet: [], links: [] };
    usersApi.getCurrentUser.mockResolvedValue(mockUser);
    skillsApi.getAllSkills.mockResolvedValue([]);

    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    }, { timeout: 5000 });

    act(() => {
      result.current.addSocialMedia();
      result.current.addSocialMedia();
    });

    // Social media should be added immediately (synchronous)
    expect(result.current.formData.socialMediaSet).toHaveLength(2);
    
    act(() => {
      result.current.removeSocialMedia(0);
    });

    // Social media should be removed immediately (synchronous)
    expect(result.current.formData.socialMediaSet).toHaveLength(1);
  });

  test('adds link entry', async () => {
    const mockUser = { id: 1, username: 'testuser', fullName: '', bio: '', avatar: '', skills: [], socialMediaSet: [], links: [] };
    usersApi.getCurrentUser.mockResolvedValue(mockUser);
    skillsApi.getAllSkills.mockResolvedValue([]);

    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    }, { timeout: 5000 });

    act(() => {
      result.current.addLink();
    });

    // Link should be added immediately (synchronous)
    expect(result.current.formData.links).toHaveLength(1);
    expect(result.current.formData.links[0]).toEqual({
      title: '',
      reference: '',
    });
  });
});
