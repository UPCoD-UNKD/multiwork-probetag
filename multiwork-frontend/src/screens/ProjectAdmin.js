import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import Appbar from '../components/bars/Appbar'
import Tabbar from '../components/bars/Tabbar'
import { getProjectById, updateProject, deleteProject, removeMemberFromProject } from '../api/projects.api'
import { MdDelete } from 'react-icons/md'
import { getCurrentUser } from '../api/users.api'
import { getAllSkills } from '../api/skills.api'
import SkillSelectorModal from '../components/SkillSelectorModal'
import ApplicationManagement from '../components/ApplicationManagement'
import MemberProfileModal from '../components/MemberProfileModal'
import { getSkillIcon } from '../utils/skillIcons'
import { AVAILABLE_SKILLS } from '../constants/skills'
import { projectKeys } from '../hooks/useProjects'
import { userKeys } from '../hooks/useUsers'
import { useViewMode } from '../viewmode/ViewModeContext'
import { useLanguage } from '../i18n/LanguageContext'
import { COLORS, SPACING, BORDER_RADIUS, TRANSITIONS, SHADOWS } from '../constants/theme'
import { getResponsiveSpacing, getResponsiveFontSizes } from '../utils/responsive'
import cameraPlaceholder from '../assets/svg/projects/camera-placeholder.svg'

const MAX_SKILLS = 999 // No limit on skills

function ProjectAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isDesktop } = useViewMode()
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  
  const spacing = getResponsiveSpacing(isDesktop)
  const fontSizes = getResponsiveFontSizes(isDesktop)
  
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)
  const [removingMemberId, setRemovingMemberId] = useState(null)
  
  // Member profile modal
  const [selectedMemberId, setSelectedMemberId] = useState(null)
  const [selectedMemberName, setSelectedMemberName] = useState(null)
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
  
  // Form data
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [projectPhoto, setProjectPhoto] = useState(null) // Store as base64 string instead of byte array
  const [photoPreview, setPhotoPreview] = useState(null)
  
  // Skills modal
  const [allSkills, setAllSkills] = useState([])
  const [loadingSkills, setLoadingSkills] = useState(false)
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)

  // Load skills function - stable reference for callbacks
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
      
      if (skillsArray.length === 0) {
        skillsArray = AVAILABLE_SKILLS
      }
      
      setAllSkills(skillsArray)
    } catch (err) {
      setAllSkills(AVAILABLE_SKILLS)
    } finally {
      setLoadingSkills(false)
    }
  }, []) // Empty deps - load skills function is stable

  // Load skills on mount
  useEffect(() => {
    loadSkills()
  }, [loadSkills])

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      
      setLoading(true)
      setError(null)
      try {
        const [projectData, userData] = await Promise.all([
          getProjectById(id),
          getCurrentUser()
        ])
        
        setProject(projectData)
        
        // Check if user is the creator
        const creatorId = projectData.creator?.id || projectData.creator
        const userId = userData.id
        
        if (String(creatorId) !== String(userId)) {
          setError(t('projects.noPermission'))
          setLoading(false)
          return
        }
        
        // Set form data
        setProjectName(projectData.projectName || '')
        setDescription(projectData.description || '')
        
        if (projectData.skills) {
          const skills = Array.isArray(projectData.skills) 
            ? projectData.skills 
            : Array.from(projectData.skills)
          setSelectedSkills(skills)
        }
        
        // Set photo preview
        if (projectData.projectPhoto) {
          try {
            let dataUrl = null
            
            // Handle both string (base64) and array (byte array) formats
            if (typeof projectData.projectPhoto === 'string') {
              // Photo is already a base64 string from Jackson
              // Check if it already has data:image prefix
              if (projectData.projectPhoto.startsWith('data:')) {
                dataUrl = projectData.projectPhoto
              } else {
                dataUrl = `data:image/png;base64,${projectData.projectPhoto}`
              }
            } else if (Array.isArray(projectData.projectPhoto) && projectData.projectPhoto.length > 0) {
              // Photo is a byte array, convert to base64
              const bytes = new Uint8Array(projectData.projectPhoto)
              const chunkSize = 8192 // Process in chunks to avoid stack overflow
              let binaryString = ''
              for (let i = 0; i < bytes.length; i += chunkSize) {
                const chunk = bytes.slice(i, Math.min(i + chunkSize, bytes.length))
                binaryString += String.fromCharCode.apply(null, Array.from(chunk))
              }
              const base64String = btoa(binaryString)
              dataUrl = `data:image/png;base64,${base64String}`
            }
            
            if (dataUrl) {
              setPhotoPreview(dataUrl)
            } else {
              throw new Error('Could not process photo data')
            }
          } catch (e) {
            setPhotoPreview(cameraPlaceholder)
          }
        } else {
          setPhotoPreview(cameraPlaceholder)
        }
        
        setLoading(false)
      } catch (err) {
        setError(err.message || t('common.error'))
        setLoading(false)
      }
    }
    
    loadData()
  }, [id, t])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(t('projects.imageTooLarge'))
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result // data:image/png;base64,...
        setPhotoPreview(result)
        
        // Store base64 string instead of converting to byte array
        // This avoids "Maximum call stack size exceeded" when sending large images
        setProjectPhoto(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e) => {
    e?.stopPropagation?.()
    e?.preventDefault?.()
    if (!projectName.trim()) {
      toast.error(t('projects.projectNameRequired'))
      return
    }

    setSaving(true)
    try {
      const updateData = {
        id: id,
        projectName: projectName.trim(),
        description: description.trim() || null,
        skills: selectedSkills.map(skill => ({
          id: skill.id || skill,
          name: skill.name
        }))
      }
      
      // Add photo if changed
      if (projectPhoto) {
        // projectPhoto is stored as base64 string (data:image/png;base64,...)
        // Extract base64 part and convert to byte array for server
        try {
          const base64Data = projectPhoto.split(',')[1] // Remove data:image/png;base64, prefix
          const binaryString = atob(base64Data)
          
          // Check size before sending (5MB limit)
          const photoSizeMB = binaryString.length / (1024 * 1024)
          if (photoSizeMB > 5) {
            toast.error(t('projects.imageTooLarge'))
            setSaving(false)
            return
          }
          
          // Convert to byte array efficiently using chunking to avoid stack overflow
          const bytes = new Uint8Array(binaryString.length)
          const chunkSize = 10000
          for (let i = 0; i < binaryString.length; i += chunkSize) {
            const end = Math.min(i + chunkSize, binaryString.length)
            for (let j = i; j < end; j++) {
              bytes[j] = binaryString.charCodeAt(j)
            }
          }
          
          // Convert to regular array efficiently
          // Build array in chunks to avoid stack overflow
          const resultArray = new Array(bytes.length)
          for (let i = 0; i < bytes.length; i++) {
            resultArray[i] = bytes[i]
          }
          
          updateData.projectPhoto = resultArray
        } catch (e) {
          toast.error('Ошибка при обработке изображения')
          setSaving(false)
          return
        }
      }
      
      await updateProject(id, updateData)
      
      toast.success('Проект успешно обновлен!')
      
      // Invalidate React Query cache for immediate reactivity
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.projects() })
      queryClient.invalidateQueries({ queryKey: userKeys.current() })
      
      // Reload project data to get updated photo from server
      const updatedProject = await getProjectById(id)
      setProject(updatedProject)
      
      if (updatedProject.projectPhoto) {
        try {
          let dataUrl = null
          
          // Handle both string (base64) and array (byte array) formats
          if (typeof updatedProject.projectPhoto === 'string') {
            // Photo is already a base64 string from Jackson
            // Check if it already has data:image prefix
            if (updatedProject.projectPhoto.startsWith('data:')) {
              dataUrl = updatedProject.projectPhoto
            } else {
              dataUrl = `data:image/png;base64,${updatedProject.projectPhoto}`
            }
          } else if (Array.isArray(updatedProject.projectPhoto) && updatedProject.projectPhoto.length > 0) {
            // Photo is a byte array, convert to base64
            
            const bytes = new Uint8Array(updatedProject.projectPhoto)
            const chunkSize = 8192
            let binaryString = ''
            for (let i = 0; i < bytes.length; i += chunkSize) {
              const chunk = bytes.slice(i, Math.min(i + chunkSize, bytes.length))
              binaryString += String.fromCharCode.apply(null, Array.from(chunk))
            }
            const base64String = btoa(binaryString)
            dataUrl = `data:image/png;base64,${base64String}`
          }
          
          if (dataUrl) {
            setPhotoPreview(dataUrl)
          } else {
            throw new Error('Could not process photo data')
          }
        } catch (e) {
          // Keep current preview if conversion fails
        }
      } else {
        if (projectPhoto) {
          // Fallback to local photo if server didn't return it (already base64 string)
          setPhotoPreview(projectPhoto)
        } else {
          setPhotoPreview(cameraPlaceholder)
        }
      }
      
      // Clear projectPhoto state after successful save
      setProjectPhoto(null)
    } catch (err) {
      let errorMessage = t('common.error')
      
      if (err.message) {
        if (err.message.includes('authentication') || err.message.includes('Full authentication')) {
          errorMessage = t('error.authentication')
        } else if (err.message.includes('too long') || err.message.includes('Value too long')) {
          errorMessage = t('projects.imageTooLarge')
        } else {
          errorMessage = err.message
        }
      }
      
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const handleSkillsSave = (skills) => {
    setSelectedSkills(skills)
  }

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(t('projects.confirmRemoveMember').replace('{name}', memberName))) {
      return
    }
    
    setRemovingMemberId(memberId)
    try {
      const updatedProject = await removeMemberFromProject(id, memberId)
      setProject(updatedProject)
      toast.success(t('projects.memberRemoved').replace('{name}', memberName))
    } catch (err) {
      toast.error(err.message || t('common.error'))
    } finally {
      setRemovingMemberId(null)
    }
  }

  const handleDelete = async (e) => {
    e?.stopPropagation?.()
    e?.preventDefault?.()
    
    const confirmed = window.confirm(
      t('projects.confirmDeleteProject')
    )
    
    if (!confirmed) {
      return
    }

    setDeleting(true)
    try {
      await deleteProject(id)
      
      // Invalidate React Query cache for immediate reactivity
      queryClient.removeQueries({ queryKey: projectKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.projects() })
      queryClient.invalidateQueries({ queryKey: userKeys.current() })
      
      toast.success(t('projects.deleteProject') + ' ' + t('common.save'))
      // Navigate to home or projects list
      setTimeout(() => {
        navigate('/home')
      }, 1000)
    } catch (err) {
      // Handle API errors with user-friendly messages
      let errorMessage = t('projects.errorDeletingProject')
      if (err.message) {
        errorMessage = err.message
      } else if (err.response) {
        errorMessage = err.response.message || errorMessage
      }
      toast.error(errorMessage)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className='mw'>
        <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
          <Appbar show='flex' />
          <div className="content" style={{ color: '#ffffff', textAlign: 'center', padding: '2rem' }}>
            {t('common.loading')}
          </div>
          <Tabbar show='flex' />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='mw'>
        <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
          <Appbar show='flex' />
          <div className="content" style={{ color: '#ff6b6b', textAlign: 'center', padding: '2rem' }}>
            {error}
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => navigate(`/project/${id}`)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4ED9EC',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                {t('projects.backToProject')}
              </button>
            </div>
          </div>
          <Tabbar show='flex' />
        </div>
      </div>
    )
  }

  // Card style helper - улучшенные отступы и границы
  const cardStyle = {
    padding: isDesktop ? SPACING.xxl : SPACING.lg,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.xl,
    border: `1px solid ${COLORS.borderPrimaryMedium}`,
    backdropFilter: 'blur(10px)',
    boxShadow: SHADOWS.md,
    marginBottom: spacing.xl,
    transition: `all ${TRANSITIONS.normal}`
  }

  const sectionTitleStyle = {
    color: COLORS.textPrimary,
    marginBottom: spacing.xl,
    fontSize: isDesktop ? fontSizes.xxl : fontSizes.xl,
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.md,
    borderBottom: `2px solid ${COLORS.borderPrimaryMedium}`
  }

  const labelStyle = {
    display: 'block',
    color: COLORS.textSecondary,
    marginBottom: spacing.sm,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }

  const inputStyle = {
    width: '100%',
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: BORDER_RADIUS.lg,
    border: `2px solid ${COLORS.borderMedium}`,
    backgroundColor: COLORS.backgroundMedium,
    color: COLORS.textPrimary,
    fontSize: fontSizes.md,
    outline: 'none',
    transition: `all ${TRANSITIONS.normal}`,
    fontFamily: 'inherit'
  }

  return (
    <div className='mw'>
      <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
        <Appbar show='flex' />
        <div className="content">
          {/* Header with Back Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing.xxl,
            paddingBottom: spacing.xl,
            borderBottom: `2px solid ${COLORS.borderPrimaryMedium}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => navigate(`/project/${id}`)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  border: `2px solid ${COLORS.borderPrimary}`,
                  borderRadius: '8px',
                  color: COLORS.primary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) 0.04s',
                  minWidth: '40px',
                  height: '40px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.backgroundLight
                  e.currentTarget.style.borderColor = COLORS.borderPrimaryStrong
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = COLORS.borderPrimary
                }}
                title={t('projects.backToProject')}
              >
                ←
              </button>
              <h1 style={{
                margin: 0,
                color: COLORS.textPrimary,
                fontSize: isDesktop ? '2rem' : '1.5rem',
                fontWeight: '700'
              }}>
                {t('projects.projectManagement')}
              </h1>
            </div>
          </div>
          
          <div style={{ 
            padding: isDesktop ? `0 ${SPACING.xxl} ${SPACING.xxl}` : `0 ${SPACING.lg} ${SPACING.lg}`,
            maxWidth: isDesktop ? '1200px' : '100%',
            margin: '0 auto'
          }}>
            {/* Card 1: Основная информация */}
            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>
                <span style={{ fontSize: '1.5rem' }}>📋</span>
                {t('projects.basicInfo')}
              </h2>
              
              {/* Project Photo */}
              <div style={{ marginBottom: spacing.xxl }}>
                <label style={labelStyle}>{t('projects.projectAvatar')}</label>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1.5rem',
                  flexWrap: isDesktop ? 'nowrap' : 'wrap'
                }}>
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={photoPreview || cameraPlaceholder} 
                      alt="Project avatar"
                      style={{ 
                        width: isDesktop ? '120px' : '100px', 
                        height: isDesktop ? '120px' : '100px', 
                        borderRadius: '16px', 
                        objectFit: 'cover',
                        border: `3px solid ${COLORS.borderPrimaryMedium}`,
                        boxShadow: SHADOWS.md
                      }}
                    />
                  </div>
                  <label
                    style={{
                      padding: '0.875rem 1.5rem',
                      backgroundColor: COLORS.primary,
                      color: COLORS.textPrimary,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0.05s',
                      boxShadow: SHADOWS.sm
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.primaryHover
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = SHADOWS.md
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.primary
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = SHADOWS.sm
                    }}
                  >
                    📷 {t('projects.changePhoto')}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* Project Name */}
              <div style={{ marginBottom: spacing.xl }}>
                <label style={labelStyle}>
                  Название проекта <span style={{ color: COLORS.error }}>*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Введите название проекта"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = COLORS.primary
                    e.target.style.backgroundColor = COLORS.backgroundMedium
                    e.target.style.boxShadow = `0 0 0 3px ${COLORS.borderPrimary}`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = COLORS.borderMedium
                    e.target.style.backgroundColor = COLORS.backgroundLight
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '0' }}>
                <label style={labelStyle}>Описание проекта</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опишите ваш проект, его цели и задачи..."
                  rows={6}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: '120px',
                    fontFamily: 'inherit',
                    lineHeight: '1.6'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = COLORS.primary
                    e.target.style.backgroundColor = COLORS.backgroundMedium
                    e.target.style.boxShadow = `0 0 0 3px ${COLORS.borderPrimary}`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = COLORS.borderMedium
                    e.target.style.backgroundColor = COLORS.backgroundLight
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* Card 2: Skills */}
            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>
                <span style={{ fontSize: '1.5rem' }}>🛠️</span>
                {t('projects.requiredSkills')}
              </h2>
              
              {selectedSkills.length > 0 && (
                <div style={{
                  marginBottom: spacing.xl,
                  padding: spacing.lg,
                  backgroundColor: COLORS.backgroundMedium,
                  borderRadius: BORDER_RADIUS.lg,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: spacing.md,
                  border: `1px solid ${COLORS.borderPrimary}`
                }}>
                  {selectedSkills.map((skill, index) => (
                    <div
                      key={skill.id || index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.sm,
                        padding: `${spacing.sm} ${spacing.lg}`,
                        backgroundColor: COLORS.backgroundLight,
                        borderRadius: BORDER_RADIUS.md,
                        border: `2px solid ${COLORS.borderPrimaryMedium}`,
                        transition: `all ${TRANSITIONS.normal}`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = COLORS.borderPrimaryStrong
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = SHADOWS.sm
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = COLORS.borderPrimaryMedium
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
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
                        fontSize: '0.95rem',
                        color: COLORS.primary,
                        fontWeight: '600'
                      }}>
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => setIsSkillModalOpen(true)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: selectedSkills.length > 0 ? COLORS.backgroundLight : COLORS.primary,
                  color: selectedSkills.length > 0 ? COLORS.primary : COLORS.textPrimary,
                  border: selectedSkills.length > 0 ? `2px solid ${COLORS.borderPrimaryMedium}` : 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.26s cubic-bezier(0.4, 0, 0.2, 1) 0.03s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: selectedSkills.length > 0 ? 'none' : SHADOWS.sm
                }}
                onMouseEnter={(e) => {
                  if (selectedSkills.length > 0) {
                    e.currentTarget.style.borderColor = COLORS.borderPrimaryStrong
                    e.currentTarget.style.backgroundColor = COLORS.backgroundMedium
                  } else {
                    e.currentTarget.style.backgroundColor = COLORS.primaryHover
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = SHADOWS.md
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSkills.length > 0) {
                    e.currentTarget.style.borderColor = COLORS.borderPrimaryMedium
                    e.currentTarget.style.backgroundColor = COLORS.backgroundLight
                  } else {
                    e.currentTarget.style.backgroundColor = COLORS.primary
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = SHADOWS.sm
                  }
                }}
              >
                {selectedSkills.length > 0 ? (
                  <>✏️ {t('projects.changeSkills')}</>
                ) : (
                  <>➕ {t('projects.selectSkills')}</>
                )}
              </button>
            </div>

            {/* Card 3: Project Members */}
            {project && project.members && (
              <div style={cardStyle}>
                <h2 style={sectionTitleStyle}>
                  <span style={{ fontSize: '1.5rem' }}>👥</span>
                  {t('projects.projectMembers') || 'Project Members'}
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: COLORS.primary,
                    backgroundColor: COLORS.backgroundMedium,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px'
                  }}>
                    {Array.isArray(project.members) ? project.members.length : (project.members?.size || 0)}
                  </span>
                </h2>
              
              {(() => {
                const membersArray = Array.isArray(project.members) 
                  ? project.members 
                  : (project.members ? Array.from(project.members) : [])
                
                if (membersArray.length === 0) {
                  return (
                    <div style={{
                      padding: '2rem',
                      textAlign: 'center',
                      color: COLORS.textTertiary,
                      fontStyle: 'italic'
                    }}>
                      {t('projects.noMembers') || 'No members'}
                    </div>
                  )
                }
                
                return (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem' 
                  }}>
                    {membersArray.map((member, index) => {
                      const memberId = member.id || member
                      const memberName = member.username || member.name || `Участник ${index + 1}`
                      const isCreator = project.creator && (
                        String(project.creator.id || project.creator) === String(memberId)
                      )
                      
                      return (
                        <div
                          key={memberId || index}
                          onClick={() => {
                            setSelectedMemberId(memberId)
                            setSelectedMemberName(memberName)
                            setIsMemberModalOpen(true)
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: spacing.xl,
                            backgroundColor: COLORS.backgroundMedium,
                            borderRadius: BORDER_RADIUS.lg,
                            cursor: 'pointer',
                            transition: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${0.05 + (index % 4) * 0.03}s`,
                            border: `2px solid ${COLORS.borderPrimary}`,
                            boxShadow: SHADOWS.sm,
                            overflow: 'hidden',
                            gap: spacing.md
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = COLORS.backgroundLight
                            e.currentTarget.style.borderColor = COLORS.borderPrimaryStrong
                            e.currentTarget.style.transform = 'translateX(4px)'
                            e.currentTarget.style.boxShadow = SHADOWS.md
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = COLORS.backgroundMedium
                            e.currentTarget.style.borderColor = COLORS.borderPrimary
                            e.currentTarget.style.transform = 'translateX(0)'
                            e.currentTarget.style.boxShadow = SHADOWS.sm
                          }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: spacing.md, 
                            flex: 1,
                            minWidth: 0,
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: isDesktop ? '48px' : '44px',
                              height: isDesktop ? '48px' : '44px',
                              borderRadius: '50%',
                              backgroundColor: COLORS.primary,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: COLORS.textPrimary,
                              fontWeight: '700',
                              fontSize: fontSizes.lg,
                              boxShadow: SHADOWS.sm,
                              flexShrink: 0
                            }}>
                              {memberName.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ 
                              flex: 1, 
                              minWidth: 0,
                              overflow: 'hidden'
                            }}>
                              <div style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '0.25rem'
                              }}>
                                <div style={{ 
                                  color: COLORS.textPrimary, 
                                  fontWeight: '600',
                                  fontSize: fontSizes.md,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {memberName}
                                </div>
                                {isCreator && (
                                  <span style={{ 
                                    padding: '0.25rem 0.625rem',
                                    backgroundColor: COLORS.primary,
                                    color: COLORS.textPrimary,
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                  }}>
                                    {t('projects.creator') || 'Creator'}
                                  </span>
                                )}
                              </div>
                              {member.email && (
                                <div style={{ 
                                  color: COLORS.textTertiary, 
                                  fontSize: '0.875rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {member.email}
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.sm,
                            flexShrink: 0,
                            marginLeft: spacing.md
                          }}>
                            {!isCreator && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveMember(memberId, memberName)
                                }}
                                disabled={removingMemberId === memberId}
                                style={{
                                  padding: spacing.sm,
                                  backgroundColor: removingMemberId === memberId 
                                    ? COLORS.backgroundDark 
                                    : COLORS.backgroundLight,
                                  color: COLORS.error,
                                  border: `2px solid ${removingMemberId === memberId ? COLORS.border : COLORS.error}`,
                                  borderRadius: BORDER_RADIUS.md,
                                  cursor: removingMemberId === memberId ? 'not-allowed' : 'pointer',
                                  fontSize: fontSizes.lg,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minWidth: isDesktop ? '40px' : '44px',
                                  height: isDesktop ? '40px' : '44px',
                  transition: `all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${0.15 + (index % 3) * 0.05}s`,
                  opacity: removingMemberId === memberId ? 0.5 : 1,
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  if (removingMemberId !== memberId) {
                    e.currentTarget.style.backgroundColor = COLORS.backgroundMedium
                    e.currentTarget.style.borderColor = COLORS.errorHover
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (removingMemberId !== memberId) {
                    e.currentTarget.style.backgroundColor = COLORS.backgroundLight
                    e.currentTarget.style.borderColor = COLORS.error
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
                                title={t('projects.removeFromProject')}
                              >
                                <MdDelete />
                              </button>
                            )}
                            <div style={{ 
                              color: COLORS.primary,
                              fontSize: fontSizes.sm,
                              fontWeight: '600',
                              padding: `${spacing.sm} ${spacing.md}`,
                              backgroundColor: COLORS.backgroundLight,
                              borderRadius: BORDER_RADIUS.md,
                              border: `1px solid ${COLORS.borderPrimary}`,
                              whiteSpace: 'nowrap',
                              flexShrink: 0
                            }}>
                              {isDesktop ? `${t('common.view') || 'View'} →` : '→'}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
              </div>
            )}

            {/* Card 4: Applications */}
            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>
                <span style={{ fontSize: '1.5rem' }}>📝</span>
                {t('application.management')}
              </h2>
              <ApplicationManagement 
                projectId={id}
                onApplicationProcessed={async () => {
                  try {
                    const updatedProject = await getProjectById(id)
                    setProject(updatedProject)
                  } catch (err) {
                  }
                }}
              />
            </div>

            {/* Fixed Action Buttons */}
            <div style={{
              position: isDesktop ? 'sticky' : 'static',
              bottom: 0,
              padding: isDesktop ? `${spacing.xl} 0` : `${spacing.lg} 0`,
              backgroundColor: isDesktop ? 'transparent' : COLORS.background,
              borderTop: isDesktop ? 'none' : `2px solid ${COLORS.borderPrimaryMedium}`,
              marginTop: spacing.xxl,
              display: 'flex',
              gap: spacing.lg,
              zIndex: 10
            }}>
              <button
                onClick={() => navigate(`/project/${id}`)}
                style={{
                  flex: isDesktop ? 'none' : 1,
                  padding: '1rem 2rem',
                  backgroundColor: 'transparent',
                  color: COLORS.primary,
                  border: `2px solid ${COLORS.borderPrimaryMedium}`,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1) 0.02s',
                  minWidth: isDesktop ? '150px' : 'auto',
                  boxShadow: SHADOWS.sm
                }}
                onMouseEnter={(e) => {
                  if (!saving && !deleting) {
                    e.currentTarget.style.backgroundColor = COLORS.backgroundLight
                    e.currentTarget.style.borderColor = COLORS.borderPrimaryStrong
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = SHADOWS.md
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving && !deleting) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = COLORS.borderPrimaryMedium
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = SHADOWS.sm
                  }
                }}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleSave(e)
                }}
                disabled={saving || deleting || !projectName.trim()}
                style={{
                  flex: isDesktop ? 'none' : 2,
                  padding: '1rem 2.5rem',
                  backgroundColor: (!projectName.trim() || saving || deleting) ? COLORS.disabled : COLORS.primary,
                  color: COLORS.textPrimary,
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: (!projectName.trim() || saving || deleting) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) 0.08s',
                  minWidth: isDesktop ? '200px' : 'auto',
                  boxShadow: (!projectName.trim() || saving || deleting) ? 'none' : SHADOWS.md,
                  opacity: (!projectName.trim() || saving || deleting) ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (projectName.trim() && !saving && !deleting) {
                    e.currentTarget.style.backgroundColor = COLORS.primaryHover
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = SHADOWS.lg
                  }
                }}
                onMouseLeave={(e) => {
                  if (projectName.trim() && !saving && !deleting) {
                    e.currentTarget.style.backgroundColor = COLORS.primary
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = SHADOWS.md
                  }
                }}
              >
                {saving ? `⏳ ${t('common.saving')}` : `💾 ${t('profile.saveChanges')}`}
              </button>
            </div>

            {/* Card 5: Опасная зона */}
            <div style={{ 
              ...cardStyle,
              backgroundColor: 'rgba(209, 8, 91, 0.08)',
              border: `2px solid ${COLORS.error}`,
              marginTop: spacing.xxxl,
              marginBottom: spacing.xxl
            }}>
              <h2 style={{
                ...sectionTitleStyle,
                color: COLORS.error
              }}>
                <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                {t('projects.dangerZone') || 'Danger Zone'}
              </h2>
              <p style={{ 
                color: COLORS.textSecondary, 
                marginBottom: spacing.xl,
                fontSize: fontSizes.md,
                lineHeight: '1.6'
              }}>
                {t('projects.deleteProjectWarning') || 'Deleting a project is an irreversible action. All project data, including members, comments, and applications, will be permanently deleted.'}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(e)
                }}
                disabled={saving || deleting}
                style={{
                  padding: '0.875rem 1.75rem',
                  backgroundColor: (saving || deleting) ? COLORS.disabled : COLORS.error,
                  color: COLORS.textPrimary,
                  border: `2px solid ${(saving || deleting) ? COLORS.border : COLORS.error}`,
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  transition: 'all 0.27s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.1s',
                  cursor: (saving || deleting) ? 'not-allowed' : 'pointer',
                  opacity: (saving || deleting) ? 0.6 : 1,
                  boxShadow: (saving || deleting) ? 'none' : SHADOWS.md
                }}
                onMouseEnter={(e) => {
                  if (!saving && !deleting) {
                    e.currentTarget.style.backgroundColor = '#B8074F'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = SHADOWS.lg
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving && !deleting) {
                    e.currentTarget.style.backgroundColor = COLORS.error
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = SHADOWS.md
                  }
                }}
              >
                {deleting ? `⏳ ${t('projects.deleting')}` : `🗑️ ${t('projects.deleteProjectButton')}`}
              </button>
            </div>
          </div>
        </div>
        <Tabbar show='flex' />
      </div>

      {/* Skill Selector Modal */}
      <SkillSelectorModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        allSkills={allSkills}
        selectedSkills={selectedSkills}
        onSave={handleSkillsSave}
        loading={saving}
        loadingSkills={loadingSkills}
        onReload={loadSkills}
        maxSkills={MAX_SKILLS}
      />

      {/* Member Profile Modal */}
      <MemberProfileModal
        isOpen={isMemberModalOpen}
        onClose={() => {
          setIsMemberModalOpen(false)
          setSelectedMemberId(null)
          setSelectedMemberName(null)
        }}
        memberId={selectedMemberId}
        memberName={selectedMemberName}
      />
    </div>
  )
}

export { ProjectAdmin }
