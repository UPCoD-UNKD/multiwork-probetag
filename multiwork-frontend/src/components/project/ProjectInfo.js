import React, { memo, useMemo } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useViewMode } from '../../viewmode/ViewModeContext'
import { getProjectLogo, getStatusColor, formatStatus } from '../../utils/projectUtils'
import { COLORS, BORDER_RADIUS, TRANSITIONS } from '../../constants/theme'
import { getResponsiveSpacing, getResponsiveFontSizes } from '../../utils/responsive'

/**
 * Component displaying project information (description, status, members, skills)
 * Memoized to prevent unnecessary re-renders
 */
const ProjectInfo = memo(({ project }) => {
  const { t } = useLanguage()
  const { isDesktop } = useViewMode()
  
  const spacing = getResponsiveSpacing(isDesktop)
  const fontSizes = getResponsiveFontSizes(isDesktop)

  // Memoize expensive computations
  const membersCount = useMemo(() => {
    if (!project?.members) return 0
    return Array.isArray(project.members) 
      ? project.members.length 
      : (project.members.size || 0)
  }, [project?.members])

  const status = useMemo(() => formatStatus(project?.projectStatuses), [project?.projectStatuses])
  
  const skills = useMemo(() => {
    if (!project?.skills) return []
    return Array.isArray(project.skills) 
      ? project.skills 
      : Array.from(project.skills)
  }, [project?.skills])

  const projectLogo = useMemo(() => getProjectLogo(project?.projectPhoto), [project?.projectPhoto])
  
  const statusColor = useMemo(() => getStatusColor(status), [status])
  
  const formattedDate = useMemo(() => {
    return project?.date ? new Date(project.date).toLocaleDateString() : t('common.nA')
  }, [project?.date, t])

  return (
    <div style={isDesktop ? {
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: spacing.xxl,
      padding: `${spacing.xl} 0`,
      alignItems: 'start'
    } : { 
      padding: spacing.lg,
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.xl
    }}>
      {/* Project Logo */}
      <div style={{ 
        marginBottom: isDesktop ? 0 : spacing.lg,
        display: 'flex',
        justifyContent: isDesktop ? 'flex-start' : 'center'
      }}>
        <img
          src={projectLogo}
          alt={project?.projectName || t('projects.untitled')}
          style={{
            width: isDesktop ? '150px' : '120px',
            height: isDesktop ? '150px' : '120px',
            borderRadius: '12px',
            objectFit: 'cover',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
          loading="lazy"
        />
      </div>

      {/* Info Section */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.xl
      }}>
        {/* Description */}
        <div>
          <h3 style={{
            color: COLORS.textPrimary,
            marginBottom: spacing.md,
            fontSize: fontSizes.lg,
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm
          }}>
            <span style={{ fontSize: '1.25rem' }}>📝</span>
            {t('projects.description')}
          </h3>
          <p style={{
            color: COLORS.textSecondary,
            lineHeight: isDesktop ? '1.6' : '1.5',
            margin: 0,
            fontSize: fontSizes.md
          }}>
            {project?.description || t('projects.noDescription')}
          </p>
        </div>

        {/* Status and Members */}
        <div style={{
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          gap: isDesktop ? spacing.xl : spacing.md,
          flexWrap: 'wrap'
        }}>
          <div>
            <p style={{
              color: COLORS.textPrimary,
              marginBottom: spacing.xs,
              fontSize: fontSizes.sm,
              fontWeight: '600'
            }}>
              {t('projects.status')}
            </p>
            <p 
              style={{
                color: statusColor,
                margin: 0,
                fontSize: fontSizes.md,
                fontWeight: 'bold'
              }}
              aria-label={`${t('projects.status')}: ${status}`}
            >
              {status}
            </p>
          </div>
          <div>
            <p style={{
              color: COLORS.textPrimary,
              marginBottom: spacing.xs,
              fontSize: fontSizes.sm,
              fontWeight: '600'
            }}>
              {t('projects.members')}
            </p>
            <p style={{ 
              color: COLORS.textSecondary, 
              margin: 0,
              fontSize: fontSizes.md
            }}>
              {project?.preferredTeamSize
                ? `${membersCount} / ${project.preferredTeamSize} ${t('projects.people') || 'человек'}`
                : `${membersCount} ${t('projects.people') || 'человек'}`}
            </p>
          </div>
          <div>
            <p style={{
              color: COLORS.textPrimary,
              marginBottom: spacing.xs,
              fontSize: fontSizes.sm,
              fontWeight: '600'
            }}>
              {t('projects.created')}
            </p>
            <p 
              style={{ 
                color: COLORS.textSecondary, 
                margin: 0,
                fontSize: fontSizes.md
              }}
              aria-label={`${t('projects.created')}: ${formattedDate}`}
            >
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h3 style={{
              color: COLORS.textPrimary,
              marginBottom: spacing.md,
              fontSize: fontSizes.lg,
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm
            }}>
              <span style={{ fontSize: '1.25rem' }}>🛠️</span>
              {t('projects.skills')}
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing.md
            }}>
              {skills.map((skill, idx) => (
                <span
                  key={skill.id || idx}
                  style={{
                    padding: isDesktop ? `${spacing.sm} ${spacing.lg}` : `${spacing.md} ${spacing.lg}`,
                    backgroundColor: COLORS.backgroundMedium,
                    color: COLORS.primary,
                    borderRadius: BORDER_RADIUS.md,
                    fontSize: fontSizes.md,
                    fontWeight: '600',
                    border: `2px solid ${COLORS.borderPrimaryMedium}`,
                    minHeight: isDesktop ? 'auto' : '36px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: `all ${TRANSITIONS.normal}`
                  }}
                >
                  {skill.name || t('common.unknown')}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if project data actually changed
  return prevProps.project?.id === nextProps.project?.id &&
    prevProps.project?.projectName === nextProps.project?.projectName &&
    prevProps.project?.description === nextProps.project?.description &&
    prevProps.project?.members === nextProps.project?.members &&
    prevProps.project?.skills === nextProps.project?.skills &&
    prevProps.project?.projectStatuses === nextProps.project?.projectStatuses
})

ProjectInfo.displayName = 'ProjectInfo'

export default ProjectInfo
