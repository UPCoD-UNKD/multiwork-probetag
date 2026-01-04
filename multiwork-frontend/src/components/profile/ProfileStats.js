import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * ProfileStats component - displays user statistics.
 * Follows Single Responsibility Principle - only handles statistics display.
 */
const ProfileStats = ({ user }) => {
  const { t } = useLanguage();

  if (!user) return null;

  return (
    <div style={{ 
      marginTop: '2rem',
      padding: '1.25rem',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem', margin: '0.5rem 0' }}>
        <strong style={{ color: '#4ED9EC' }}>{t('profile.projectsCreated')}:</strong>{' '}
        {user.creatorProjects?.size || user.creatorProjects?.length || 0}
      </p>
      <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem', margin: '0.5rem 0' }}>
        <strong style={{ color: '#4ED9EC' }}>{t('profile.followingProjects')}:</strong>{' '}
        {user.followingToProjects?.size || user.followingToProjects?.length || 0}
      </p>
      <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem', margin: '0.5rem 0' }}>
        <strong style={{ color: '#4ED9EC' }}>{t('profile.followers')}:</strong>{' '}
        {user.followers?.size || user.followers?.length || 0}
      </p>
      <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem', margin: '0.5rem 0' }}>
        <strong style={{ color: '#4ED9EC' }}>{t('profile.following')}:</strong>{' '}
        {user.following?.size || user.following?.length || 0}
      </p>
    </div>
  );
};

export default ProfileStats;
