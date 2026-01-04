import React, { useState } from 'react';
import Appbar from '../components/bars/Appbar';
import Tabbar from '../components/bars/Tabbar';
import LoadingSpinner from '../components/LoadingSpinner';
import SkillSelectorModal from '../components/SkillSelectorModal';
import ProfileAvatar from '../components/profile/ProfileAvatar';
import ProfileBio from '../components/profile/ProfileBio';
import ProfileSkills from '../components/profile/ProfileSkills';
import ProfileSocialMedia from '../components/profile/ProfileSocialMedia';
import ProfileLinks from '../components/profile/ProfileLinks';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileActionButtons from '../components/profile/ProfileActionButtons';
import { useProfile } from '../hooks/useProfile';
import { useViewMode } from '../viewmode/ViewModeContext';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Profile screen component.
 * Refactored to use smaller, focused components following SOLID principles.
 * Main component now only orchestrates the UI layout.
 */
function Profile() {
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const { isDesktop } = useViewMode();
  const { t } = useLanguage();

  const {
    user,
    loading,
    error,
    isEditing,
    setIsEditing,
    allSkills,
    loadingSkills,
    formData,
    avatarPreview,
    handleInputChange,
    handleAvatarChange,
    handleSkillsSave,
    handleSave,
    handleCancel,
    addSocialMedia,
    updateSocialMedia,
    removeSocialMedia,
    addLink,
    updateLink,
    removeLink,
    loadSkills
  } = useProfile();

  // Handle full name change separately (it's in the avatar component)
  const handleFullNameChange = (e) => {
    handleInputChange(e);
  };

  // Handle avatar file change
  const handleAvatarFileChange = (e) => {
    handleAvatarChange(e);
  };

  if (loading && !user) {
    return (
      <div className="mw">
        <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
          <Appbar show='flex' />
          <div className="content">
            <h1 className="title form">{t('profile.title')}</h1>
            <LoadingSpinner message={t('profile.loading') || 'Loading profile...'} />
          </div>
          <Tabbar show='flex' />
        </div>
      </div>
    );
  }
  
  if (error && !user) {
    return <div className="mw">{t('common.error')}: {error}</div>;
  }
  
  if (!user) {
    return <div className="mw">{t('profile.profileNotFound')}</div>;
  }

  return (
    <div className='mw'>
      <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
        <Appbar show='flex' />
        <div className="content">
          <h1 className="title form">{t('profile.title')}</h1>
        
          <div style={{ padding: '1rem' }}>
            {/* Avatar Section */}
            <ProfileAvatar
              user={user}
              avatarPreview={avatarPreview}
              fullName={formData.fullName}
              isEditing={isEditing}
              onAvatarChange={handleAvatarFileChange}
              onFullNameChange={handleFullNameChange}
            />

            {/* Bio Section */}
            <ProfileBio
              bio={formData.bio}
              isEditing={isEditing}
              onBioChange={handleInputChange}
            />

            {/* Skills Section */}
            <ProfileSkills
              skills={formData.skills || []}
              isEditing={isEditing}
              onOpenSkillModal={() => setIsSkillModalOpen(true)}
            />

            {/* Social Media Section */}
            <ProfileSocialMedia
              socialMedia={formData.socialMediaSet || []}
              isEditing={isEditing}
              onAdd={addSocialMedia}
              onUpdate={updateSocialMedia}
              onRemove={removeSocialMedia}
            />

            {/* Links Section */}
            <ProfileLinks
              links={formData.links || []}
              isEditing={isEditing}
              onAdd={addLink}
              onUpdate={updateLink}
              onRemove={removeLink}
            />

            {/* Stats Section */}
            {!isEditing && <ProfileStats user={user} />}

            {/* Edit/Save/Cancel Buttons */}
            <ProfileActionButtons
              isEditing={isEditing}
              loading={loading}
              onEdit={() => setIsEditing(true)}
              onSave={handleSave}
              onCancel={handleCancel}
            />

            {/* Error Message */}
            {error && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.75rem', 
                backgroundColor: 'rgba(255, 68, 68, 0.2)', 
                color: '#ff6b6b',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid rgba(255, 68, 68, 0.3)'
              }}>
                {error}
              </div>
            )}
          </div>
        </div>
        <Tabbar show='flex' />
        
        {/* Skill Selector Modal */}
        <SkillSelectorModal
          isOpen={isSkillModalOpen}
          onClose={() => setIsSkillModalOpen(false)}
          allSkills={allSkills}
          selectedSkills={formData.skills || []}
          onSave={handleSkillsSave}
          loading={loading}
          loadingSkills={loadingSkills}
          onReload={loadSkills}
        />
      </div>
    </div>
  );
}

export { Profile };
