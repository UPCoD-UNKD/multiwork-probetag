import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import { getProjectById, updateProject, createProject } from '../api/projects.api'
import { getAllSkills } from '../api/skills.api'
import SkillSelectorModal from '../components/SkillSelectorModal'
import { getSkillIcon } from '../utils/skillIcons'
import { AVAILABLE_SKILLS } from '../constants/skills'
import { COLORS } from '../constants/theme'
import { useViewMode } from '../viewmode/ViewModeContext'
import { projectKeys } from '../hooks/useProjects'
import { userKeys } from '../hooks/useUsers'
import { svgToPngBase64, base64ToByteArray } from '../utils/svgToBase64'
import { useLanguage } from '../i18n/LanguageContext'
import logo1 from '../assets/svg/projects/logo1.svg'
import logo2 from '../assets/svg/projects/logo2.svg'
import logo3 from '../assets/svg/projects/logo3.svg'
import logo4 from '../assets/svg/projects/logo4.svg'
import logo5 from '../assets/svg/projects/logo5.svg'

const MAX_SKILLS = 999 // No limit on skills

// Available avatar placeholders
// In Create React App, SVG imports return URL strings directly
const AVATAR_PLACEHOLDERS = [
  { id: 1, name: 'Logo 1', src: logo1 },
  { id: 2, name: 'Logo 2', src: logo2 },
  { id: 3, name: 'Logo 3', src: logo3 },
  { id: 4, name: 'Logo 4', src: logo4 },
  { id: 5, name: 'Logo 5', src: logo5 },
]

function ProjectOnboarding() {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const { isDesktop } = useViewMode()
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const isNewProject = !projectId || projectId === 'new' || window.location.pathname === '/onboarding/project'
  
  const [step, setStep] = useState(1) // 1 = description, 2 = skills
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [preferredTeamSize, setPreferredTeamSize] = useState('')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [allSkills, setAllSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingSkills, setLoadingSkills] = useState(false)
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)
  const [fadeIn, setFadeIn] = useState(true)
  const [project, setProject] = useState(null)
  const [selectedAvatar, setSelectedAvatar] = useState(null) // Selected avatar placeholder (base64 string)
  const [selectedAvatarId, setSelectedAvatarId] = useState(null) // ID of selected avatar for UI

  const loadProject = useCallback(async () => {
    if (isNewProject) {
      // For new project, no need to load
      return
    }
    try {
      const projectData = await getProjectById(projectId)
      setProject(projectData)
      if (projectData.projectName) {
        setProjectName(projectData.projectName)
      }
      if (projectData.description) {
        setDescription(projectData.description)
      }
      if (projectData.preferredTeamSize) {
        setPreferredTeamSize(String(projectData.preferredTeamSize))
      }
      if (projectData.skills && projectData.skills.length > 0) {
        setSelectedSkills(projectData.skills)
      }
    } catch (err) {
      toast.error(t('onboarding.errorLoadingProject'))
    }
  }, [projectId, isNewProject, t])

  const loadSkills = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    if (!isNewProject) {
      loadProject()
    }
    loadSkills()
  }, [loadProject, loadSkills, isNewProject])

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
      // Skip description, go to skills
      handleNext()
    } else {
      // Skip skills, complete onboarding
      handleComplete()
    }
  }

  const handleAvatarSelect = async (avatar) => {
    try {
      // Convert SVG to PNG base64
      const pngDataUrl = await svgToPngBase64(avatar.src)
      setSelectedAvatar(pngDataUrl)
      setSelectedAvatarId(avatar.id)
    } catch (error) {
      toast.error('Ошибка при выборе аватарки')
    }
  }

  const handleComplete = async () => {
    // Validate preferredTeamSize first (required field)
    if (!preferredTeamSize.trim()) {
      toast.warning(t('onboarding.pleaseEnterTeamSize'))
      return
    }

    const teamSize = parseInt(preferredTeamSize.trim(), 10)
    if (isNaN(teamSize) || teamSize < 1) {
      toast.warning(t('onboarding.teamSizeMustBePositive'))
      return
    }

    if (selectedSkills.length === 0) {
      toast.warning(t('onboarding.pleaseSelectSkillForProject'))
      return
    }

    if (isNewProject && !projectName.trim()) {
      toast.warning(t('onboarding.pleaseEnterProjectName'))
      return
    }

    setLoading(true)
    try {
      if (isNewProject) {
        // Create new project
        const project = await createProject(
          projectName.trim(), 
          description || '', 
          teamSize
        )
        toast.success(t('onboarding.projectCreated'))
        
        // Update with skills, avatar, and team size
        const updateData = {
          id: project.id,
          description: description || null,
          preferredTeamSize: teamSize,
          skills: selectedSkills.map(skill => ({
            id: skill.id || skill,
            name: skill.name
          }))
        }
        
        // Add avatar if selected
        if (selectedAvatar) {
          updateData.projectPhoto = base64ToByteArray(selectedAvatar)
        }
        
        await updateProject(project.id, updateData)
        
        // Invalidate React Query cache for immediate reactivity
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(project.id) })
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
        queryClient.invalidateQueries({ queryKey: userKeys.projects() })
        queryClient.invalidateQueries({ queryKey: userKeys.current() })
        
        // Navigate to project page
        setTimeout(() => {
          navigate(`/project/${project.id}`)
        }, 500)
      } else {
        // Update existing project
        const updateData = {
          id: projectId,
          description: description || null,
          preferredTeamSize: teamSize,
          skills: selectedSkills.map(skill => ({
            id: skill.id || skill,
            name: skill.name
          }))
        }
        
        // Add avatar if selected
        if (selectedAvatar) {
          updateData.projectPhoto = base64ToByteArray(selectedAvatar)
        }
        
        await updateProject(projectId, updateData)
        
        // Invalidate React Query cache for immediate reactivity
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) })
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
        queryClient.invalidateQueries({ queryKey: userKeys.projects() })
        queryClient.invalidateQueries({ queryKey: userKeys.current() })
        
        toast.success(t('onboarding.projectUpdated'))
        
        // Navigate to project page
        setTimeout(() => {
          navigate(`/project/${projectId}`)
        }, 500)
      }
    } catch (err) {
      toast.error(t('onboarding.errorSavingProject') + ': ' + (err.message || t('common.unknown')))
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

  if (!isNewProject && !project) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #312C4F 0%, #111723 50%, #312C4F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', fontSize: '1.2rem' }}>{t('onboarding.loading')}</div>
      </div>
    )
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
        {/* Cancel button - only for new projects */}
        {isNewProject && (
          <button
            onClick={() => navigate('/project/new')}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
              e.target.style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              e.target.style.color = 'rgba(255, 255, 255, 0.8)'
            }}
            >
              {t('onboarding.cancel')}
            </button>
        )}
        
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
            }}            >
              {isNewProject ? t('onboarding.createYourProject') : t('onboarding.describeYourProject')}
            </h1>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              {isNewProject ? t('onboarding.projectNameAndDescription') : t('onboarding.projectDescriptionOptional')}
            </p>

            {isNewProject && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontSize: '0.95rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '500'
                }}>
                  {t('onboarding.projectName')}
                  <span style={{ 
                    color: COLORS.error || '#D1085B', 
                    marginLeft: '4px',
                    fontSize: '0.9rem'
                  }}>*</span>
                </label>
                <textarea
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder={t('projects.projectNamePlaceholder') || t('onboarding.projectName') + '...'}
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    minHeight: '80px',
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
              </div>
            )}

            {/* Team size input - required for all projects */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontSize: '0.95rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500'
              }}>
                {t('onboarding.teamSize')}
                <span style={{ 
                  color: COLORS.error || '#D1085B', 
                  marginLeft: '4px',
                  fontSize: '0.9rem'
                }}>*</span>
              </label>
              <input
                type="number"
                value={preferredTeamSize}
                onChange={(e) => setPreferredTeamSize(e.target.value)}
                placeholder={t('onboarding.teamSizePlaceholder')}
                required
                min="1"
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
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
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('onboarding.projectDescriptionPlaceholder')}
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

            {/* Avatar placeholder selection */}
            {isNewProject && (
              <div style={{ marginTop: '2rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '1rem',
                  fontSize: '0.95rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '500'
                }}>
                  {t('onboarding.selectProjectAvatar')}
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isDesktop ? 'repeat(5, 1fr)' : 'repeat(3, 1fr)',
                  gap: isDesktop ? '1rem' : '0.75rem',
                  maxWidth: '100%'
                }}>
                  {AVATAR_PLACEHOLDERS.map((avatar) => {
                    const isSelected = selectedAvatarId === avatar.id
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => handleAvatarSelect(avatar)}
                        style={{
                          width: '100%',
                          minHeight: isSelected ? '120px' : '80px',
                          aspectRatio: '1',
                          padding: isSelected ? '1rem' : '0.75rem',
                          borderRadius: '12px',
                          border: isSelected 
                            ? '3px solid #4ED9EC' 
                            : '2px solid rgba(255, 255, 255, 0.2)',
                          backgroundColor: isSelected 
                            ? 'rgba(78, 217, 236, 0.25)' 
                            : 'rgba(255, 255, 255, 0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          outline: 'none',
                          boxShadow: isSelected 
                            ? '0 0 20px rgba(78, 217, 236, 0.5)' 
                            : 'none',
                          transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                          zIndex: isSelected ? 10 : 1,
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'rgba(78, 217, 236, 0.6)'
                            e.currentTarget.style.backgroundColor = 'rgba(78, 217, 236, 0.15)'
                            e.currentTarget.style.transform = 'scale(1.05)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                            e.currentTarget.style.transform = 'scale(1)'
                          }
                        }}
                      >
                        <img
                          src={avatar.src}
                          alt={avatar.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            filter: isSelected 
                              ? 'brightness(1.3) drop-shadow(0 0 10px rgba(78, 217, 236, 0.6))' 
                              : 'brightness(1)',
                            transition: 'all 0.3s ease',
                            pointerEvents: 'none',
                            transform: isSelected ? 'scale(1.2)' : 'scale(1)'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

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
                disabled={(isNewProject && !projectName.trim()) || !preferredTeamSize.trim()}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: ((isNewProject && !projectName.trim()) || !preferredTeamSize.trim()) ? 'rgba(255, 255, 255, 0.2)' : '#4ED9EC',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: ((isNewProject && !projectName.trim()) || !preferredTeamSize.trim()) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: ((isNewProject && !projectName.trim()) || !preferredTeamSize.trim()) ? 'none' : '0 4px 12px rgba(78, 217, 236, 0.3)',
                  opacity: ((isNewProject && !projectName.trim()) || !preferredTeamSize.trim()) ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!((isNewProject && !projectName.trim()) || !preferredTeamSize.trim())) {
                    e.target.style.backgroundColor = '#3bc4d6'
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 16px rgba(78, 217, 236, 0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!((isNewProject && !projectName.trim()) || !preferredTeamSize.trim())) {
                    e.target.style.backgroundColor = '#4ED9EC'
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 12px rgba(78, 217, 236, 0.3)'
                  }
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
            }}            >
              {t('onboarding.selectRequiredSkills')}
            </h1>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              {t('onboarding.selectSkillsForProject').replace('{max}', MAX_SKILLS)}
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
                  {t('onboarding.selectedCount')}: {selectedSkills.length} / {MAX_SKILLS}
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
                disabled={loading || selectedSkills.length === 0 || !preferredTeamSize.trim()}
                style={{
                  flex: 2,
                  padding: '1rem',
                  backgroundColor: (selectedSkills.length === 0 || !preferredTeamSize.trim()) ? 'rgba(255, 255, 255, 0.2)' : '#4ED9EC',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: (selectedSkills.length === 0 || !preferredTeamSize.trim()) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: (selectedSkills.length === 0 || !preferredTeamSize.trim()) ? 'none' : '0 4px 12px rgba(78, 217, 236, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (selectedSkills.length > 0 && preferredTeamSize.trim()) {
                    e.target.style.backgroundColor = '#3bc4d6'
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 16px rgba(78, 217, 236, 0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSkills.length > 0 && preferredTeamSize.trim()) {
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
          maxSkills={MAX_SKILLS}
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

export { ProjectOnboarding }
