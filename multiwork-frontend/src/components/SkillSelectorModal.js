import React, { useState, useEffect } from 'react';
import { MdClose, MdCheck } from 'react-icons/md';
import { getSkillIcon } from '../utils/skillIcons';

const SkillSelectorModal = ({ isOpen, onClose, allSkills = [], selectedSkills, onSave, loading, loadingSkills = false, onReload, maxSkills = 3 }) => {
  const [localSelected, setLocalSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const MAX_SKILLS = maxSkills;

  useEffect(() => {
    if (isOpen) {
      setLocalSelected(selectedSkills || []);
      setSearchTerm('');
    }
  }, [isOpen, selectedSkills]);

  const toggleSkill = (skill) => {
    const skillId = skill.id;
    const isSelected = localSelected.some(s => (s.id || s) === skillId);

    if (isSelected) {
      // Remove skill
      setLocalSelected(localSelected.filter(s => (s.id || s) !== skillId));
    } else {
      // Add skill (check limit)
      if (localSelected.length >= MAX_SKILLS) {
        return; // Don't add if limit reached
      }
      setLocalSelected([...localSelected, skill]);
    }
  };

  const isSkillSelected = (skillId) => {
    return localSelected.some(s => (s.id || s) === skillId);
  };

  const handleSave = () => {
    onSave(localSelected);
    onClose();
  };

  const handleClose = () => {
    setLocalSelected(selectedSkills || []);
    setSearchTerm('');
    onClose();
  };

  const filteredSkills = (allSkills || []).filter(skill =>
    skill && (
      skill.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
        backdropFilter: 'blur(5px)'
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: 'rgba(30, 30, 50, 0.95)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(78, 217, 236, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(78, 217, 236, 0.1)'
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: '#4ED9EC', fontSize: '1.5rem', fontWeight: '600' }}>
              Выберите навыки
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
              Выбрано: {localSelected.length} / {MAX_SKILLS}
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              fontSize: '1.5rem',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            <MdClose />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <input
            type="text"
            placeholder="Поиск навыков..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#4ED9EC';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
          />
        </div>

        {/* Skills List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          {loadingSkills ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '3rem 0',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(78, 217, 236, 0.3)',
                borderTop: '3px solid #4ED9EC',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
              }}></div>
              <p style={{ margin: 0 }}>Загрузка навыков...</p>
            </div>
          ) : filteredSkills.length === 0 ? (
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '1rem' }}>
                {searchTerm ? 'Навыки не найдены' : (allSkills.length === 0 ? 'Нет доступных навыков. Проверьте подключение к серверу.' : 'Нет доступных навыков')}
              </p>
              {allSkills.length === 0 && onReload && (
                <button
                  onClick={onReload}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#4ED9EC',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#3bc4d6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#4ED9EC';
                  }}
                >
                  Перезагрузить
                </button>
              )}
            </div>
          ) : (
            filteredSkills.map((skill) => {
              const selected = isSkillSelected(skill.id);
              const canSelect = selected || localSelected.length < MAX_SKILLS;

              return (
                <button
                  key={skill.id}
                  onClick={() => canSelect && toggleSkill(skill)}
                  disabled={!canSelect && !selected}
                  style={{
                    padding: '1rem 1.25rem',
                    backgroundColor: selected
                      ? 'rgba(78, 217, 236, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: selected
                      ? '2px solid #4ED9EC'
                      : '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: selected ? '#4ED9EC' : 'rgba(255, 255, 255, 0.9)',
                    cursor: canSelect ? 'pointer' : 'not-allowed',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s',
                    opacity: canSelect ? 1 : 0.5,
                    fontSize: '1rem',
                    fontWeight: selected ? '600' : '400',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    if (canSelect) {
                      e.target.style.backgroundColor = selected
                        ? 'rgba(78, 217, 236, 0.3)'
                        : 'rgba(255, 255, 255, 0.1)';
                      e.target.style.transform = 'translateX(4px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (canSelect) {
                      e.target.style.backgroundColor = selected
                        ? 'rgba(78, 217, 236, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)';
                      e.target.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  {/* Skill Icon */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      minWidth: '48px',
                      minHeight: '48px',
                      borderRadius: '12px',
                      backgroundColor: selected
                        ? 'rgba(78, 217, 236, 0.2)'
                        : 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                      flexShrink: 0,
                      border: selected
                        ? '1px solid rgba(78, 217, 236, 0.4)'
                        : '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <img
                      src={getSkillIcon(skill.name)}
                      alt={skill.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: selected ? 'none' : 'brightness(0.8)',
                        transition: 'all 0.2s'
                      }}
                    />
                  </div>
                  
                  {/* Skill Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '1rem' }}>
                      {skill.name}
                    </div>
                    {skill.description && (
                      <div style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: '1.4' }}>
                        {skill.description}
                      </div>
                    )}
                  </div>
                  
                  {/* Check Icon */}
                  {selected && (
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#4ED9EC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(78, 217, 236, 0.4)'
                      }}
                    >
                      <MdCheck size={18} />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            gap: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          <button
            onClick={handleClose}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#4ED9EC',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#3bc4d6';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#4ED9EC';
              }
            }}
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillSelectorModal;
