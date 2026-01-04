import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './ProfileSocialMedia.css';

/**
 * ProfileSocialMedia component - displays and allows editing of social media links.
 * Follows Single Responsibility Principle - only handles social media display and editing.
 */
const ProfileSocialMedia = ({ 
  socialMedia, 
  isEditing, 
  onAdd, 
  onUpdate, 
  onRemove 
}) => {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 style={{ 
          fontSize: '1.1rem', 
          margin: 0,
          color: '#4ED9EC',
          fontWeight: '600'
        }}>
          {t('profile.socialMedia')}
        </h3>
        {isEditing && (
          <button
            onClick={onAdd}
            style={{
              padding: '0.4rem 0.9rem',
              backgroundColor: '#4ED9EC',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 'bold'
            }}
          >
            + {t('profile.add')}
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {socialMedia.length > 0 ? (
          socialMedia.map((sm, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={sm.referenceSocialMedia || ''}
                    onChange={(e) => onUpdate(idx, e.target.value)}
                    placeholder={t('profile.socialMediaUrl')}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => onRemove(idx)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      minWidth: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </>
              ) : (
                <a 
                  href={sm.referenceSocialMedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#6EE5F0',
                    textDecoration: 'underline',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    wordBreak: 'break-all',
                    transition: 'all 0.2s ease',
                    display: 'inline-block',
                    opacity: 1
                  }}
                  className="profile-link"
                  onMouseEnter={(e) => {
                    e.target.style.color = '#ffffff'
                    e.target.style.textDecoration = 'underline'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#6EE5F0'
                    e.target.style.textDecoration = 'underline'
                  }}
                >
                  {sm.referenceSocialMedia}
                </a>
              )}
            </div>
          ))
        ) : (
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem', margin: 0 }}>
            {t('profile.noSocialMedia')}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileSocialMedia;
