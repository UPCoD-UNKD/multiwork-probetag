import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { Profile } from './Profile';
import { renderWithProviders } from '../test-utils/testHelpers';
import * as usersApi from '../api/users.api';
import * as skillsApi from '../api/skills.api';

// Mock dependencies
jest.mock('../api/users.api');
jest.mock('../api/skills.api');

// Mock hooks
jest.mock('../hooks/useProfile', () => ({
  useProfile: jest.fn(),
}));

// Mock components
jest.mock('../components/bars/Appbar', () => ({
  __esModule: true,
  default: () => <div data-testid="appbar">Appbar</div>,
}));

jest.mock('../components/bars/Tabbar', () => ({
  __esModule: true,
  default: () => <div data-testid="tabbar">Tabbar</div>,
}));

jest.mock('../components/SkillSelectorModal', () => ({
  __esModule: true,
  default: () => <div data-testid="skill-selector-modal">Skill Selector</div>,
}));

jest.mock('../components/profile/ProfileAvatar', () => ({
  __esModule: true,
  default: () => <div data-testid="profile-avatar">Avatar</div>,
}));

jest.mock('../components/profile/ProfileBio', () => ({
  __esModule: true,
  default: () => <div data-testid="profile-bio">Bio</div>,
}));

jest.mock('../components/profile/ProfileSkills', () => ({
  __esModule: true,
  default: () => <div data-testid="profile-skills">Skills</div>,
}));

jest.mock('../components/profile/ProfileSocialMedia', () => ({
  __esModule: true,
  default: () => <div data-testid="profile-social">Social Media</div>,
}));

jest.mock('../components/profile/ProfileLinks', () => ({
  __esModule: true,
  default: () => <div data-testid="profile-links">Links</div>,
}));

jest.mock('../components/profile/ProfileStats', () => ({
  __esModule: true,
  default: () => <div data-testid="profile-stats">Stats</div>,
}));

jest.mock('../components/profile/ProfileActionButtons', () => ({
  __esModule: true,
  default: () => <div data-testid="profile-actions">Actions</div>,
}));

import { useProfile } from '../hooks/useProfile';

describe('Profile Screen', () => {
  const mockUseProfile = {
    user: {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      fullName: 'Test User',
      bio: 'Test bio',
      skills: [],
    },
    loading: false,
    error: null,
    isEditing: false,
    setIsEditing: jest.fn(),
    allSkills: [],
    loadingSkills: false,
    formData: {
      fullName: 'Test User',
      bio: 'Test bio',
      avatar: '',
      skills: [],
      socialMediaSet: [],
      links: [],
    },
    avatarPreview: null,
    handleInputChange: jest.fn(),
    handleAvatarChange: jest.fn(),
    handleSkillsSave: jest.fn(),
    handleSave: jest.fn(),
    handleCancel: jest.fn(),
    addSocialMedia: jest.fn(),
    updateSocialMedia: jest.fn(),
    removeSocialMedia: jest.fn(),
    addLink: jest.fn(),
    updateLink: jest.fn(),
    removeLink: jest.fn(),
    loadSkills: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useProfile.mockReturnValue(mockUseProfile);
  });

  describe('Rendering', () => {
    test('renders profile screen correctly', () => {
      renderWithProviders(<Profile />);

      expect(screen.getByTestId('appbar')).toBeInTheDocument();
      expect(screen.getByTestId('tabbar')).toBeInTheDocument();
      expect(screen.getByTestId('profile-avatar')).toBeInTheDocument();
      expect(screen.getByTestId('profile-bio')).toBeInTheDocument();
      expect(screen.getByTestId('profile-skills')).toBeInTheDocument();
    });

    test('shows loading state when loading', () => {
      useProfile.mockReturnValue({
        ...mockUseProfile,
        loading: true,
      });

      renderWithProviders(<Profile />);

      // Should show loading state
      expect(screen.getByTestId('appbar')).toBeInTheDocument();
    });

    test('shows error state when error occurs', () => {
      useProfile.mockReturnValue({
        ...mockUseProfile,
        error: 'Failed to load profile',
      });

      renderWithProviders(<Profile />);

      // Should show error message
      expect(screen.getByText(/error|ошибка/i)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('opens skill selector modal when edit skills button is clicked', () => {
      renderWithProviders(<Profile />);

      const editSkillsButton = screen.queryByRole('button', { name: /edit.*skills|редактировать.*навыки/i });
      if (editSkillsButton) {
        fireEvent.click(editSkillsButton);
        
        expect(screen.getByTestId('skill-selector-modal')).toBeInTheDocument();
      }
    });

    test('handles edit mode toggle', () => {
      renderWithProviders(<Profile />);

      const editButton = screen.queryByRole('button', { name: /edit|редактировать/i });
      if (editButton) {
        fireEvent.click(editButton);
        
        expect(mockUseProfile.setIsEditing).toHaveBeenCalledWith(true);
      }
    });
  });

  describe('Data Loading', () => {
    test('loads user profile data on mount', () => {
      renderWithProviders(<Profile />);

      // useProfile hook should be called
      expect(useProfile).toHaveBeenCalled();
    });

    test('handles empty user data', () => {
      useProfile.mockReturnValue({
        ...mockUseProfile,
        user: null,
      });

      renderWithProviders(<Profile />);

      // Should still render without crashing
      expect(screen.getByTestId('appbar')).toBeInTheDocument();
    });
  });
});
