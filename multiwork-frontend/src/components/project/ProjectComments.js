import React, { memo, useMemo, useCallback } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useViewMode } from '../../viewmode/ViewModeContext'
import { COLORS, FONT_SIZES, BORDER_RADIUS, TRANSITIONS, SHADOWS } from '../../constants/theme'
import { getResponsiveSpacing, getResponsiveFontSizes, getButtonSize } from '../../utils/responsive'

/**
 * Component for displaying project comments
 * Memoized to prevent unnecessary re-renders
 */
const ProjectComments = memo(({
  comments,
  commentText,
  setCommentText,
  submittingComment,
  onSubmit,
  onAuthorClick
}) => {
  const { t } = useLanguage()
  const { isDesktop } = useViewMode()
  
  const spacing = getResponsiveSpacing(isDesktop)
  const fontSizes = getResponsiveFontSizes(isDesktop)
  const buttonSize = getButtonSize(isDesktop, 'md')

  // Memoize comments count
  const commentsCount = useMemo(() => comments.length, [comments.length])

  // Memoize comment author click handler
  const handleAuthorClick = useCallback((creatorId, creatorName) => {
    if (onAuthorClick) {
      onAuthorClick(creatorId, creatorName)
    }
  }, [onAuthorClick])

  // Memoize textarea change handler
  const handleTextChange = useCallback((e) => {
    setCommentText(e.target.value)
  }, [setCommentText])

  return (
    <div style={{
      padding: isDesktop ? spacing.xl : spacing.lg,
      backgroundColor: 'transparent',
      borderRadius: BORDER_RADIUS.lg,
      backdropFilter: 'none',
      border: 'none'
    }}>
      <h2 style={{
        fontSize: fontSizes.xxl,
        marginBottom: spacing.xl,
        color: COLORS.textPrimary,
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
        paddingBottom: spacing.md,
        borderBottom: `2px solid ${COLORS.borderPrimaryMedium}`
      }}>
        <span style={{ fontSize: '1.5rem' }}>💬</span>
        {t('projects.comments')} ({commentsCount})
      </h2>

      {comments.length === 0 ? (
        <p style={{
          color: COLORS.textDisabled,
          fontStyle: 'italic',
          fontSize: FONT_SIZES.base,
          margin: 0
        }}>
          {t('projects.noCommentsYet')}
        </p>
      ) : (
        <div style={{
          marginBottom: spacing.xl,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.lg
        }}>
          {comments.map((comment, idx) => {
            const creatorId = comment.creator?.id || comment.creator
            const creatorName = comment.creator?.username || comment.creator?.fullName || comment.creator?.email || t('common.anonymous')
            const hasCreator = creatorId && creatorId !== 'anonymous' && creatorId !== 'null' && creatorId !== 'undefined'

            return (
              <div
                key={comment.id || idx}
                style={{
                  padding: isDesktop ? spacing.lg : spacing.md,
                  backgroundColor: COLORS.backgroundMedium,
                  borderRadius: BORDER_RADIUS.lg,
                  border: `1px solid ${COLORS.borderPrimary}`,
                  boxShadow: SHADOWS.sm,
                  transition: `all ${TRANSITIONS.normal}`
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginBottom: spacing.sm,
                  gap: spacing.sm
                }}>
                  <button
                    type="button"
                    onClick={() => handleAuthorClick(creatorId, creatorName)}
                    disabled={!hasCreator}
                    aria-label={hasCreator ? `View profile of ${creatorName}` : 'Author profile unavailable'}
                    style={{
                      background: 'none',
                      border: 'none',
                      margin: 0,
                      padding: isDesktop ? 0 : spacing.xs,
                      fontWeight: '600',
                      color: hasCreator ? COLORS.primary : COLORS.textSecondary,
                      fontSize: fontSizes.md,
                      cursor: hasCreator ? 'pointer' : 'not-allowed',
                      transition: `all ${TRANSITIONS.normal}`,
                      textDecoration: 'none',
                      minHeight: isDesktop ? 'auto' : '44px',
                      display: 'flex',
                      alignItems: 'center',
                      opacity: hasCreator ? 1 : 0.6
                    }}
                    onMouseEnter={(e) => {
                      if (hasCreator && isDesktop) {
                        e.target.style.color = COLORS.primaryHover
                        e.target.style.textDecoration = 'underline'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (hasCreator && isDesktop) {
                        e.target.style.color = COLORS.primary
                        e.target.style.textDecoration = 'none'
                      }
                    }}
                    onTouchStart={(e) => {
                      if (hasCreator && !isDesktop) {
                        e.target.style.opacity = '0.7'
                      }
                    }}
                    onTouchEnd={(e) => {
                      if (hasCreator && !isDesktop) {
                        e.target.style.opacity = '1'
                      }
                    }}
                  >
                    {creatorName}
                  </button>
                  {comment.date && (
                    <small style={{
                      color: COLORS.textDisabled,
                      marginLeft: isDesktop ? 'auto' : 0,
                      fontSize: fontSizes.xs,
                      flex: isDesktop ? 'none' : '1 1 100%'
                    }}>
                      {comment.date && comment.time
                        ? `${comment.date} ${comment.time}`
                        : comment.date
                          ? new Date(comment.date).toLocaleDateString()
                          : ''}
                    </small>
                  )}
                </div>
                <p style={{
                  margin: 0,
                  fontSize: fontSizes.md,
                  color: COLORS.textSecondary,
                  lineHeight: isDesktop ? '1.6' : '1.5'
                }}>
                  {comment.text || t('common.noText')}
                </p>
              </div>
            )
          })}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ 
        marginTop: spacing.xl,
        paddingTop: spacing.xl,
        borderTop: `2px solid ${COLORS.borderPrimaryMedium}`
      }}>
        <textarea
          className="project-textarea"
          placeholder={t('projects.commentPlaceholder')}
          value={commentText}
          onChange={handleTextChange}
          disabled={submittingComment}
          required
          style={{
            width: '100%',
            minHeight: isDesktop ? '120px' : '140px',
            padding: spacing.lg,
            marginBottom: spacing.lg,
            borderRadius: BORDER_RADIUS.lg,
            border: `2px solid ${COLORS.borderMedium}`,
            backgroundColor: COLORS.backgroundMedium,
            color: COLORS.textPrimary,
            fontSize: fontSizes.md,
            fontFamily: 'inherit',
            resize: 'vertical',
            lineHeight: '1.6',
            transition: `all ${TRANSITIONS.normal}`
          }}
        />
        <button
          type="submit"
          disabled={submittingComment || !commentText.trim()}
          style={{
            ...buttonSize,
            width: isDesktop ? 'auto' : '100%',
            backgroundColor: COLORS.primary,
            color: COLORS.textPrimary,
            border: 'none',
            borderRadius: BORDER_RADIUS.md,
            cursor: submittingComment ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: fontSizes.md,
            opacity: (submittingComment || !commentText.trim()) ? 0.6 : 1,
            transition: `all ${TRANSITIONS.normal}`
          }}
          onMouseEnter={(e) => {
            if (!submittingComment && commentText.trim() && isDesktop) {
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
            if (!submittingComment && commentText.trim() && !isDesktop) {
              e.target.style.opacity = '0.8'
            }
          }}
          onTouchEnd={(e) => {
            if (!isDesktop) {
              e.target.style.opacity = (submittingComment || !commentText.trim()) ? 0.6 : 1
            }
          }}
        >
          {submittingComment ? t('common.posting') : t('projects.postComment')}
        </button>
      </form>
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if relevant props changed
  return (
    prevProps.comments === nextProps.comments &&
    prevProps.commentText === nextProps.commentText &&
    prevProps.submittingComment === nextProps.submittingComment &&
    prevProps.onSubmit === nextProps.onSubmit &&
    prevProps.onAuthorClick === nextProps.onAuthorClick
  )
})

ProjectComments.displayName = 'ProjectComments'

export default ProjectComments
