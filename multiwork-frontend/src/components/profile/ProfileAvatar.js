import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * ProfileAvatar component - displays and allows editing of user avatar.
 * Follows Single Responsibility Principle - only handles avatar display and editing.
 */
const ProfileAvatar = ({ 
  user, 
  avatarPreview, 
  fullName, 
  isEditing, 
  onAvatarChange,
  onFullNameChange
}) => {
  const { t } = useLanguage();

  return (
    <div style={{ 
      marginBottom: '1.5rem', 
      textAlign: 'center',
      padding: '1.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {avatarPreview ? (
          <img 
            src={avatarPreview} 
            alt={fullName || user?.username}
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              marginBottom: '1rem',
              border: '3px solid rgba(78, 217, 236, 0.3)',
              boxShadow: '0 4px 12px rgba(78, 217, 236, 0.2)'
            }}
          />
        ) : (
          <div 
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              backgroundColor: '#4ED9EC',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(78, 217, 236, 0.3)'
            }}
          >
            {(fullName || user?.username || 'U').charAt(0).toUpperCase()}
          </div>
        )}
        {isEditing && (
          <label 
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              backgroundColor: '#4ED9EC',
              color: 'white',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={onAvatarChange}
              style={{ display: 'none' }}
            />
            <span style={{ fontSize: '18px' }}>📷</span>
          </label>
        )}
      </div>
      
      {isEditing ? (
        <input
          type="text"
          name="fullName"
          value={fullName}
          onChange={onFullNameChange}
          placeholder={t('profile.fullNamePlaceholder')}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
      ) : (
        <h2 style={{ margin: '0.5rem 0', color: '#fff', fontSize: '1.5rem', fontWeight: '600' }}>
          {fullName || user?.username || 'User'}
        </h2>
      )}
      
      <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0.25rem 0', fontSize: '0.95rem' }}>
        @{user?.username}
      </p>
      <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '0.25rem 0', fontSize: '0.9rem' }}>
        {user?.email}
      </p>
    </div>
  );
};

export default ProfileAvatar;
