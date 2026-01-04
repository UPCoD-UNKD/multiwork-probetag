/**
 * Responsive utilities for mobile and desktop UI/UX
 */

import { SPACING, FONT_SIZES } from '../constants/theme'

/**
 * Get responsive spacing based on view mode
 * Mobile: smaller spacing for compact UI
 * Desktop: larger spacing for comfortable viewing
 */
export const getResponsiveSpacing = (isDesktop, base = 'md') => {
  if (isDesktop) {
    // Desktop: 1.5x spacing for better breathing room
    return {
      xs: SPACING.xs,
      sm: SPACING.sm,
      md: SPACING.lg,
      lg: SPACING.xl,
      xl: SPACING.xxl,
      xxl: SPACING.xxxl
    }
  } else {
    // Mobile: compact spacing
    return {
      xs: SPACING.xs,
      sm: SPACING.xs,
      md: SPACING.sm,
      lg: SPACING.md,
      xl: SPACING.lg,
      xxl: SPACING.xl
    }
  }
}

/**
 * Get responsive font sizes
 * Mobile: slightly smaller for readability on small screens
 * Desktop: larger for comfortable reading
 */
export const getResponsiveFontSizes = (isDesktop) => {
  if (isDesktop) {
    return {
      xs: FONT_SIZES.xs,
      sm: FONT_SIZES.sm,
      base: FONT_SIZES.md,
      md: FONT_SIZES.lg,
      lg: FONT_SIZES.xl,
      xl: FONT_SIZES.xxl,
      xxl: FONT_SIZES.xxxl
    }
  } else {
    return {
      xs: FONT_SIZES.xs,
      sm: FONT_SIZES.xs,
      base: FONT_SIZES.sm,
      md: FONT_SIZES.base,
      lg: FONT_SIZES.md,
      xl: FONT_SIZES.lg,
      xxl: FONT_SIZES.xl
    }
  }
}

/**
 * Get touch-friendly button sizes for mobile
 * Minimum 44x44px touch target (Apple HIG, Material Design)
 */
export const getButtonSize = (isDesktop, size = 'md') => {
  if (isDesktop) {
    return {
      sm: { padding: `${SPACING.sm} ${SPACING.md}`, minHeight: '36px' },
      md: { padding: `${SPACING.md} ${SPACING.lg}`, minHeight: '40px' },
      lg: { padding: `${SPACING.lg} ${SPACING.xl}`, minHeight: '44px' }
    }[size] || { padding: `${SPACING.md} ${SPACING.lg}`, minHeight: '40px' }
  } else {
    // Mobile: ensure minimum 44px touch target
    return {
      sm: { padding: `${SPACING.md} ${SPACING.lg}`, minHeight: '44px' },
      md: { padding: `${SPACING.lg} ${SPACING.xl}`, minHeight: '48px' },
      lg: { padding: `${SPACING.xl} ${SPACING.xxl}`, minHeight: '52px' }
    }[size] || { padding: `${SPACING.lg} ${SPACING.xl}`, minHeight: '48px' }
  }
}

/**
 * Get responsive container max width
 */
export const getContainerMaxWidth = (isDesktop) => {
  return isDesktop ? '1200px' : '100%'
}

/**
 * Get responsive grid columns
 */
export const getGridColumns = (isDesktop, mobileCols = 1) => {
  if (isDesktop) {
    return { gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }
  } else {
    return { gridTemplateColumns: `repeat(${mobileCols}, 1fr)` }
  }
}

/**
 * Get responsive padding for containers
 */
export const getContainerPadding = (isDesktop) => {
  return isDesktop 
    ? { padding: `${SPACING.xl} ${SPACING.xxl}` }
    : { padding: `${SPACING.lg} ${SPACING.md}` }
}

/**
 * Get responsive gap for flex/grid layouts
 */
export const getLayoutGap = (isDesktop) => {
  return isDesktop ? SPACING.xl : SPACING.md
}
