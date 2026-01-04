import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * ProfileBio component - displays and allows editing of user bio.
 * Follows Single Responsibility Principle - only handles bio display and editing.
 */
const ProfileBio = ({ bio, isEditing, onBioChange }) => {
  const { t } = useLanguage();

  return (
    <div style={{ 
      marginBottom: '1.5rem',
      padding: '1.25rem',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h3 style={{ 
        fontSize: '1.1rem', 
        marginBottom: '0.75rem',
        color: '#4ED9EC',
        fontWeight: '600'
      }}>
        {t('profile.bio')}
      </h3>
      {isEditing ? (
        <textarea
          name="bio"
          value={bio}
          onChange={onBioChange}
          placeholder={t('profile.bioPlaceholder')}
          rows="4"
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontSize: '1rem',
            outline: 'none',
            resize: 'vertical'
          }}
        />
      ) : (
        <p style={{ 
          color: bio ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)',
          lineHeight: '1.6',
          margin: 0
        }}>
          {bio || t('profile.noDescription')}
        </p>
      )}
    </div>
  );
};

export default ProfileBio;
