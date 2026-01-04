import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { getSkillIcon } from '../../utils/skillIcons';

/**
 * ProfileSkills component - displays and allows editing of user skills.
 * Follows Single Responsibility Principle - only handles skills display and editing.
 */
const ProfileSkills = ({ 
  skills, 
  isEditing, 
  onOpenSkillModal 
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
          {t('profile.skills')} {skills.length > 0 && `(${skills.length}/3)`}
        </h3>
        {isEditing && (
          <button
            onClick={onOpenSkillModal}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#4ED9EC',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(78, 217, 236, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#3bc4d6';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(78, 217, 236, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#4ED9EC';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(78, 217, 236, 0.3)';
            }}
          >
            <span>+</span> {skills.length > 0 ? 'Изменить' : 'Добавить навыки'}
          </button>
        )}
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', minHeight: '2rem' }}>
        {skills.length > 0 ? (
          skills.map((skill, idx) => (
            <span 
              key={skill.id || idx}
              style={{ 
                padding: '0.5rem 0.75rem', 
                backgroundColor: '#4ED9EC', 
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '500',
                boxShadow: '0 2px 6px rgba(78, 217, 236, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(78, 217, 236, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 6px rgba(78, 217, 236, 0.3)';
              }}
            >
              <img
                src={getSkillIcon(skill.name)}
                alt={skill.name}
                style={{
                  width: '20px',
                  height: '20px',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)'
                }}
              />
              <span>{skill.name || t('profile.unknownSkill')}</span>
            </span>
          ))
        ) : (
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem', margin: 0 }}>
            {isEditing ? 'Нажмите "Добавить навыки" чтобы выбрать до 3 навыков' : t('profile.noSkillsSelected')}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileSkills;
