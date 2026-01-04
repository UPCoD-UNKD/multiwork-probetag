import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { updateUser } from '../api/users.api'
import { getAllSkills } from '../api/skills.api'
import SkillSelectorModal from '../components/SkillSelectorModal'
import { getSkillIcon } from '../utils/skillIcons'
import { AVAILABLE_SKILLS } from '../constants/skills'
import { useLanguage } from '../i18n/LanguageContext'

function Onboarding() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  
  const [step, setStep] = useState(1) // 1 = bio, 2 = skills
  const [bio, setBio] = useState('')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [allSkills, setAllSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingSkills, setLoadingSkills] = useState(false)
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)
  const [fadeIn, setFadeIn] = useState(true)

  useEffect(() => {
    loadSkills()
  }, [])

  const loadSkills = async () => {
    setLoadingSkills(true)
    try {
      const response = await getAllSkills()
      let skillsArray = []
      if (Array.isArray(response)) {
        skillsArray = response
      } else if (response && Array.isArray(response.content)) {
        skillsArray = response.content
      } else if (response && typeof response === 'object') {
        const possibleArrays = Object.values(response).filter(Array.isArray)
        if (possibleArrays.length > 0) {
          skillsArray = possibleArrays[0]
        }
      }
      
      // Fallback to static skills if API fails
      if (skillsArray.length === 0) {
        skillsArray = AVAILABLE_SKILLS
      }
      
      setAllSkills(skillsArray)
    } catch (err) {
      // Use static skills as fallback
      setAllSkills(AVAILABLE_SKILLS)
    } finally {
      setLoadingSkills(false)
    }
  }

  const handleNext = () => {
    if (step === 1) {
      // Move to skills step
      setFadeIn(false)
      setTimeout(() => {
        setStep(2)
        setFadeIn(true)
      }, 300)
    }
  }

  const handleSkip = () => {
    if (step === 1) {
      // Skip bio, go to skills
      handleNext()
    } else {
      // Skip skills, complete onboarding
      handleComplete()
    }
  }

  const handleComplete = async () => {
    if (selectedSkills.length === 0) {
      toast.warning(t('onboarding.pleaseSelectSkill'))
      return
    }

    setLoading(true)
    try {
      // Update user with bio and skills
      const updateData = {
        bio: bio || null,
        skills: selectedSkills.map(skill => ({
          id: skill.id || skill,
          name: skill.name
        }))
      }
      
      await updateUser(updateData)
      toast.success(t('onboarding.profileUpdated'))
      
      // Navigate to home
      setTimeout(() => {
        navigate('/home')
      }, 500)
    } catch (err) {
      toast.error(t('onboarding.errorUpdatingProfile') + ': ' + (err.message || t('common.unknown')))
    } finally {
      setLoading(false)
    }
  }

  const handleSkillsSave = (skills) => {
    setSelectedSkills(skills)
  }

  const transitionStyle = {
    opacity: fadeIn ? 1 : 0,
    transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all 0.3s ease-in-out'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #312C4F 0%, #111723 50%, #312C4F 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        animation: 'pulse 4s ease-in-out infinite'
      }} />
      
      <div style={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: 'rgba(17, 23, 35, 0.95)',
        borderRadius: '24px',
        padding: '3rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(78, 217, 236, 0.2)',
        position: 'relative',
        zIndex: 1,
        ...transitionStyle
      }}>
        {/* Progress indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: step >= 1 ? '#4ED9EC' : 'rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease'
          }} />
          <div style={{
            width: '40px',
            height: '3px',
            backgroundColor: step >= 2 ? '#4ED9EC' : 'rgba(255, 255, 255, 0.2)',
            alignSelf: 'center',
            transition: 'all 0.3s ease'
          }} />
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: step >= 2 ? '#4ED9EC' : 'rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease'
          }} />
        </div>

        {step === 1 && (
          <div style={transitionStyle}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '0.5rem',
              textAlign: 'center'
            }}>
              {t('onboarding.tellAboutYourself')}
            </h1>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              {t('onboarding.tellAboutYourselfDesc')}
            </p>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t('profile.bioPlaceholder')}
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '1rem',
                borderRadius: '12px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4ED9EC'
                e.target.style.boxShadow = '0 0 0 3px rgba(78, 217, 236, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                e.target.style.boxShadow = 'none'
              }}
            />

            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              <button
                onClick={handleSkip}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: 'transparent',
                  color: '#4ED9EC',
                  border: '2px solid #4ED9EC',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(78, 217, 236, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                }}
              >
                {t('onboarding.skip')}
              </button>
              <button
                onClick={handleNext}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: '#4ED9EC',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(78, 217, 236, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#3bc4d6'
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 16px rgba(78, 217, 236, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#4ED9EC'
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 12px rgba(78, 217, 236, 0.3)'
                }}
              >
                {t('common.next')}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={transitionStyle}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '0.5rem',
              textAlign: 'center'
            }}>
              {t('onboarding.selectYourSkills')}
            </h1>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              {t('onboarding.selectSkillsDesc')}
            </p>

            {/* Selected skills preview */}
            {selectedSkills.length > 0 && (
              <div style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: 'rgba(78, 217, 236, 0.1)',
                borderRadius: '12px'
              }}>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  {t('onboarding.selected')}: {selectedSkills.length} / 3
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {selectedSkills.map((skill, index) => (
                    <div
                      key={skill.id || index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: 'rgba(78, 217, 236, 0.15)',
                        borderRadius: '8px',
                        border: '1px solid rgba(78, 217, 236, 0.3)'
                      }}
                    >
                      <img
                        src={getSkillIcon(skill.name)}
                        alt={skill.name}
                        style={{
                          width: '24px',
                          height: '24px',
                          objectFit: 'contain'
                        }}
                      />
                      <span style={{
                        fontSize: '0.9rem',
                        color: '#ffffff'
                      }}>
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setIsSkillModalOpen(true)}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#4ED9EC',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(78, 217, 236, 0.3)',
                marginBottom: '2rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#3bc4d6'
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#4ED9EC'
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
            >
              {selectedSkills.length > 0 ? t('onboarding.changeSkills') : t('onboarding.selectSkills')}
            </button>

            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button
                onClick={() => {
                  setFadeIn(false)
                  setTimeout(() => {
                    setStep(1)
                    setFadeIn(true)
                  }, 300)
                }}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: 'transparent',
                  color: '#4ED9EC',
                  border: '2px solid #4ED9EC',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(78, 217, 236, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                }}
              >
                {t('onboarding.back')}
              </button>
              <button
                onClick={handleComplete}
                disabled={loading || selectedSkills.length === 0}
                style={{
                  flex: 2,
                  padding: '1rem',
                  backgroundColor: selectedSkills.length === 0 ? 'rgba(255, 255, 255, 0.2)' : '#4ED9EC',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: selectedSkills.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedSkills.length === 0 ? 'none' : '0 4px 12px rgba(78, 217, 236, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (selectedSkills.length > 0) {
                    e.target.style.backgroundColor = '#3bc4d6'
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 16px rgba(78, 217, 236, 0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSkills.length > 0) {
                    e.target.style.backgroundColor = '#4ED9EC'
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 12px rgba(78, 217, 236, 0.3)'
                  }
                }}
              >
                {loading ? t('onboarding.saving') : t('onboarding.complete')}
              </button>
            </div>
          </div>
        )}

        {/* Skill Selector Modal */}
        <SkillSelectorModal
          isOpen={isSkillModalOpen}
          onClose={() => setIsSkillModalOpen(false)}
          allSkills={allSkills}
          selectedSkills={selectedSkills}
          onSave={handleSkillsSave}
          loading={loading}
          loadingSkills={loadingSkills}
          onReload={loadSkills}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
        textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
          opacity: 1;
        }
      `}</style>
    </div>
  )
}

export { Onboarding }
