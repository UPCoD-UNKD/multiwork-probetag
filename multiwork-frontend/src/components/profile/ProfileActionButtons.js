import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * ProfileActionButtons component - displays edit/save/cancel buttons.
 * Follows Single Responsibility Principle - only handles action buttons.
 */
const ProfileActionButtons = ({ 
  isEditing, 
  loading, 
  onEdit, 
  onSave, 
  onCancel 
}) => {
  const { t } = useLanguage();

  return (
    <div style={{ 
      marginTop: '2rem', 
      display: 'flex', 
      gap: '1rem', 
      justifyContent: 'center',
      flexWrap: 'wrap'
    }}>
      {isEditing ? (
        <>
          <button
            onClick={onSave}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#4ED9EC',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: loading ? 0.6 : 1,
              minWidth: '120px'
            }}
          >
            {loading ? t('common.saving') : t('common.save')}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: loading ? 0.6 : 1,
              minWidth: '120px'
            }}
          >
            {t('common.cancel')}
          </button>
        </>
      ) : (
        <button
          onClick={onEdit}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4ED9EC',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            minWidth: '120px'
          }}
        >
          {t('profile.edit')}
        </button>
      )}
    </div>
  );
};

export default ProfileActionButtons;
