import React from 'react'
import { COLORS, BORDER_RADIUS } from '../constants/theme'
import { getResponsiveSpacing, getResponsiveFontSizes } from '../utils/responsive'
import { useViewMode } from '../viewmode/ViewModeContext'

/**
 * Enhanced error state component with better UX
 */
const ErrorState = ({ 
  error, 
  onRetry, 
  retryLabel,
  title 
}) => {
  const { isDesktop } = useViewMode()
  const spacing = getResponsiveSpacing(isDesktop)
  const fontSizes = getResponsiveFontSizes(isDesktop)

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        padding: spacing.xl,
        textAlign: 'center',
        color: COLORS.error,
        backgroundColor: COLORS.backgroundLight,
        borderRadius: BORDER_RADIUS.lg,
        border: `1px solid ${COLORS.error}`,
        margin: `${spacing.xl} 0`
      }}
    >
      {title && (
        <h3 style={{
          margin: `0 0 ${spacing.md} 0`,
          fontSize: fontSizes.lg,
          fontWeight: '600',
          color: COLORS.error
        }}>
          {title}
        </h3>
      )}
      <p style={{ 
        margin: 0, 
        fontSize: fontSizes.md, 
        marginBottom: onRetry ? spacing.md : 0,
        color: COLORS.textSecondary
      }}>
        {error}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: spacing.md,
            padding: `${spacing.md} ${spacing.lg}`,
            backgroundColor: COLORS.primary,
            color: COLORS.textPrimary,
            border: 'none',
            borderRadius: BORDER_RADIUS.md,
            cursor: 'pointer',
            fontSize: fontSizes.md,
            fontWeight: '600',
            minHeight: isDesktop ? 'auto' : '44px',
            width: isDesktop ? 'auto' : '100%',
            transition: 'all 0.2s'
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
          aria-label={retryLabel || 'Retry'}
        >
          {retryLabel || 'Retry'}
        </button>
      )}
    </div>
  )
}

export default ErrorState
