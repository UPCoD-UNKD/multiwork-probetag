import React, { useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Appbar from '../components/bars/Appbar'
import Tabbar from '../components/bars/Tabbar'
import ProjectCard from '../components/lists/ProjectCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAllProjects, useProjectsBySkill } from '../hooks/useProjects'
import { useCurrentUser } from '../hooks/useUsers'
import { useViewMode } from '../viewmode/ViewModeContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useSwipe } from '../hooks/useSwipe'
import { mapProjectToCard } from '../utils/projectUtils'
import { MdRefresh } from 'react-icons/md'
import { COLORS, BORDER_RADIUS, TRANSITIONS } from '../constants/theme'
import { getButtonSize, getResponsiveSpacing, getResponsiveFontSizes } from '../utils/responsive'

function Home() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const skillId = searchParams.get('skillId')
  const { isDesktop, isMobile } = useViewMode()
  const { t } = useLanguage()
  
  const spacing = getResponsiveSpacing(isDesktop)
  const fontSizes = getResponsiveFontSizes(isDesktop)
  const buttonSize = getButtonSize(isDesktop, 'md')
  
  // Свайпы для мобильной версии
  const swipeRef = useSwipe({
    onSwipeLeft: () => {
      if (isMobile) {
        navigate('/projects')
      }
    },
    onSwipeRight: () => {
      if (isMobile) {
        navigate(-1)
      }
    }
  })

  // Use React Query hooks with caching
  const { data: projectsBySkillData, isLoading: loadingBySkill, error: errorBySkill, refetch: refetchBySkill } = useProjectsBySkill(skillId, {
    enabled: !!skillId, // Only fetch if skillId is provided
  })
  
  const { data: allProjectsData, isLoading: loadingAll, error: errorAll, refetch: refetchAll } = useAllProjects(0, 100, {
    enabled: !skillId, // Only fetch if no skillId
  })
  
  const { data: userData } = useCurrentUser() // Cached user data

  // Determine which data to use
  const isLoading = skillId ? loadingBySkill : loadingAll
  const error = skillId ? errorBySkill : errorAll
  const refetch = skillId ? refetchBySkill : refetchAll

  // Process and filter projects based on user data
  const projects = useMemo(() => {
    let allProjects = []
    
    // Get projects data
    if (skillId && projectsBySkillData) {
      allProjects = Array.isArray(projectsBySkillData) ? projectsBySkillData : (projectsBySkillData?.content || [])
    } else if (allProjectsData) {
      if (Array.isArray(allProjectsData)) {
        allProjects = allProjectsData
      } else if (allProjectsData?.content && Array.isArray(allProjectsData.content)) {
        allProjects = allProjectsData.content
      }
    } else {
      return []
    }

    // If skillId is provided, just map and return
    if (skillId) {
      return allProjects.map(mapProjectToCard)
    }

    // Get user's project IDs to exclude (projects where user is a member or creator)
    const userProjectIds = new Set()
    if (userData) {
      const userId = userData.id ? String(userData.id) : null
      
      // Add projects where user is a member
      if (userData.memberProjects) {
        const memberProjects = Array.isArray(userData.memberProjects) 
          ? userData.memberProjects 
          : (userData.memberProjects.size !== undefined ? Array.from(userData.memberProjects) : [])
        
        memberProjects.forEach(project => {
          if (project && project.id) {
            userProjectIds.add(String(project.id))
          }
        })
      }
      
      // Add projects where user is a creator
      if (userData.creatorProjects) {
        const creatorProjects = Array.isArray(userData.creatorProjects) 
          ? userData.creatorProjects 
          : (userData.creatorProjects.size !== undefined ? Array.from(userData.creatorProjects) : [])
        
        creatorProjects.forEach(project => {
          if (project && project.id) {
            userProjectIds.add(String(project.id))
          }
        })
      }
      
      // Also check project.members array for current user
      allProjects.forEach(project => {
        if (project.members && userId) {
          const members = Array.isArray(project.members) ? project.members : []
          const isMember = members.some(member => {
            const memberId = typeof member === 'object' ? (member.id || member) : member
            return String(memberId) === userId
          })
          if (isMember && project.id) {
            userProjectIds.add(String(project.id))
          }
        }
        
        // Check if user is creator
        if (project.creator && userId) {
          const creatorId = typeof project.creator === 'object' 
            ? (project.creator.id || project.creator) 
            : project.creator
          if (String(creatorId) === userId && project.id) {
            userProjectIds.add(String(project.id))
          }
        }
      })
    }

    // Exclude projects where user is already a member or creator
    let filteredProjects = allProjects.filter(project => {
      if (!project || !project.id) return false
      return !userProjectIds.has(String(project.id))
    })

    // If user is logged in and has skills, filter projects by user skills
    let recommendedProjects = filteredProjects
    if (userData && userData.skills && Array.isArray(userData.skills) && userData.skills.length > 0) {
      const userSkillIds = userData.skills.map(skill => 
        typeof skill === 'object' ? skill.id : skill
      ).filter(id => id != null)
      
      if (userSkillIds.length > 0) {
        // Filter projects that have at least one skill matching user skills
        recommendedProjects = filteredProjects.filter(project => {
          if (!project.skills || !Array.isArray(project.skills)) {
            return false
          }
          
          const projectSkillIds = project.skills.map(skill => 
            typeof skill === 'object' ? skill.id : skill
          ).filter(id => id != null)
          
          // Check if project has at least one skill that matches user skills
          return projectSkillIds.some(skillId => userSkillIds.includes(skillId))
        })
      }
    }

    // Map API response to ProjectCard props using utility function
    return recommendedProjects.map(mapProjectToCard)
  }, [skillId, projectsBySkillData, allProjectsData, userData])

  return (
    <div className='mw'>
      <div ref={swipeRef} className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
        <Appbar show='flex' />
        <div className="content">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: isDesktop ? 'center' : 'flex-start',
            marginBottom: spacing.xl,
            flexDirection: isDesktop ? 'row' : 'column',
            gap: spacing.md,
            width: '100%'
          }}>
            <h1 className="title form" style={{ 
              margin: 0,
              fontSize: fontSizes.xxl
            }}>
              {t('home.title')}
            </h1>
              <button
                onClick={() => refetch()}
                disabled={isLoading}
              style={{
                ...buttonSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
                backgroundColor: isLoading ? 'rgba(78, 217, 236, 0.3)' : 'rgba(78, 217, 236, 0.2)',
                border: '1px solid rgba(78, 217, 236, 0.4)',
                borderRadius: BORDER_RADIUS.lg,
                color: COLORS.primary,
                fontSize: fontSizes.md,
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: `all ${TRANSITIONS.normal}`,
                opacity: isLoading ? 0.6 : 1,
                whiteSpace: 'nowrap',
                width: isDesktop ? 'auto' : '100%'
              }}
              onMouseEnter={(e) => {
                if (!isLoading && isDesktop) {
                  e.target.style.backgroundColor = 'rgba(78, 217, 236, 0.3)'
                  e.target.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && isDesktop) {
                  e.target.style.backgroundColor = 'rgba(78, 217, 236, 0.2)'
                  e.target.style.transform = 'translateY(0)'
                }
              }}
              onTouchStart={(e) => {
                if (!isLoading && !isDesktop) {
                  e.target.style.opacity = '0.8'
                }
              }}
              onTouchEnd={(e) => {
                if (!isDesktop) {
                  e.target.style.opacity = isLoading ? 0.6 : 1
                }
              }}
              aria-label={t('home.refreshProjects') || 'Refresh Projects'}
            >
              <MdRefresh 
                size={isDesktop ? 20 : 22} 
                style={{ 
                  animation: isLoading ? 'spin 1s linear infinite' : 'none'
                }} 
              />
              <span>{isLoading ? (t('common.loading') || 'Loading...') : (t('home.refresh') || 'Refresh')}</span>
            </button>
          </div>

          {isLoading ? (
            <LoadingSpinner message={t('home.loadingProjects') || 'Loading projects...'} />
          ) : error ? (
            <div style={{
              padding: spacing.xl,
              textAlign: 'center',
              color: COLORS.error,
              backgroundColor: COLORS.backgroundLight,
              borderRadius: BORDER_RADIUS.lg,
              border: `1px solid ${COLORS.error}`
            }}>
              <p style={{ margin: 0, fontSize: fontSizes.md, marginBottom: spacing.md }}>
                {t('common.error')}: {error?.message || error}
              </p>
              <button
                onClick={() => refetch()}
                style={{
                  ...buttonSize,
                  width: isDesktop ? 'auto' : '100%',
                  marginTop: spacing.md,
                  backgroundColor: COLORS.primary,
                  color: COLORS.textPrimary,
                  border: 'none',
                  borderRadius: BORDER_RADIUS.md,
                  cursor: 'pointer',
                  fontSize: fontSizes.md,
                  fontWeight: '600'
                }}
                onTouchStart={(e) => {
                  if (!isDesktop) {
                    e.target.style.opacity = '0.8'
                  }
                }}
                onTouchEnd={(e) => {
                  if (!isDesktop) {
                    e.target.style.opacity = '1'
                  }
                }}
              >
                {t('home.retry') || 'Retry'}
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div style={{
              padding: isDesktop ? spacing.xxxl : spacing.xxl,
              textAlign: 'center',
              color: COLORS.textTertiary
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: fontSizes.lg
              }}>
                {t('home.projectsNotFound')}
              </p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((el) =>
                <ProjectCard
                  key={el.id}
                  id={el.id}
                  logo={el.logo}
                  title={el.title}
                  desc={el.desc ? el.desc.substring(0, 100) : ''}
                  status={el.status}
                  members={el.members}
                  preferredTeamSize={el.preferredTeamSize}
                  color={el.color}
                />
              )}
            </div>
          )}
        </div>
        <Tabbar show='flex' />
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export { Home }

