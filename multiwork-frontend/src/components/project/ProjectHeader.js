import React, { memo, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import { useViewMode } from '../../viewmode/ViewModeContext'
import { COLORS, BORDER_RADIUS, TRANSITIONS } from '../../constants/theme'
import { getButtonSize, getResponsiveFontSizes, getResponsiveSpacing } from '../../utils/responsive'

/**
 * Header component for project detail page
 * Memoized to prevent unnecessary re-renders
 */
const ProjectHeader = memo(({ project, projectId, currentUser }) => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { isDesktop } = useViewMode()
  
  const spacing = getResponsiveSpacing(isDesktop)
  const fontSizes = getResponsiveFontSizes(isDesktop)
  const buttonSize = getButtonSize(isDesktop, 'md')

  // Memoize creator check
  const isCreator = useMemo(() => {
    if (!currentUser || !project?.creator) return false
    const creatorId = project.creator?.id || project.creator
    const userId = currentUser.id
    return String(creatorId) === String(userId)
  }, [currentUser, project?.creator])

  // Memoize navigation handler
  const handleManageClick = useCallback(() => {
    navigate(`/project/${projectId}/admin`)
  }, [navigate, projectId])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: isDesktop ? 'center' : 'flex-start',
      marginBottom: 0,
      flexDirection: isDesktop ? 'row' : 'column',
      gap: spacing.lg,
      width: '100%'
    }}>
      <h1 className="title form" style={{ 
        margin: 0,
        fontSize: isDesktop ? fontSizes.xxl : fontSizes.xl,
        lineHeight: '1.2',
        flex: isDesktop ? 'none' : 1
      }}>
        {project?.projectName || t('projects.untitled')}
      </h1>
      {isCreator && (
        <button
          onClick={handleManageClick}
          aria-label={t('projects.manage') || 'Manage project'}
          style={{
            ...buttonSize,
            backgroundColor: COLORS.primary,
            color: COLORS.textPrimary,
            border: 'none',
            borderRadius: BORDER_RADIUS.md,
            fontSize: fontSizes.md,
            fontWeight: '600',
            cursor: 'pointer',
            transition: `all ${TRANSITIONS.normal}`,
            whiteSpace: 'nowrap',
            width: isDesktop ? 'auto' : '100%',
            alignSelf: isDesktop ? 'auto' : 'stretch'
          }}
          onMouseEnter={(e) => {
            if (isDesktop) {
              e.target.style.backgroundColor = COLORS.primaryHover
              e.target.style.transform = 'translateY(-2px)'
            }
          }}
          onMouseLeave={(e) => {
            if (isDesktop) {
              e.target.style.backgroundColor = COLORS.primary
              e.target.style.transform = 'translateY(0)'
            }
          }}
          onTouchStart={(e) => {
            e.target.style.opacity = '0.8'
          }}
          onTouchEnd={(e) => {
            e.target.style.opacity = '1'
          }}
        >
          {t('projects.manage') || 'Управление'}
        </button>
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if relevant props changed
  const prevCreatorId = prevProps.project?.creator?.id || prevProps.project?.creator
  const nextCreatorId = nextProps.project?.creator?.id || nextProps.project?.creator
  
  return (
    prevProps.project?.projectName === nextProps.project?.projectName &&
    prevProps.projectId === nextProps.projectId &&
    prevProps.currentUser?.id === nextProps.currentUser?.id &&
    String(prevCreatorId) === String(nextCreatorId)
  )
})

ProjectHeader.displayName = 'ProjectHeader'

export default ProjectHeader
