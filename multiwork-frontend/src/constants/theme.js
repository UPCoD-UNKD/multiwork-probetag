/**
 * Theme constants for consistent styling across the application
 */

// Colors
export const COLORS = {
  // Primary colors
  primary: '#4ED9EC',
  primaryHover: '#3bc4d6',
  primaryDark: '#2a9bb0',

  // Magenta accents (New from Figma)
  magenta: '#FD4979',
  magentaHover: '#e03e6b',
  magentaDark: '#d1355e',

  // Background colors
  background: '#1a1a2e',
  backgroundLight: 'rgba(255, 255, 255, 0.03)',
  backgroundMedium: 'rgba(255, 255, 255, 0.07)',
  backgroundDark: 'rgba(0, 0, 0, 0.4)',
  glassBackground: 'rgba(26, 26, 46, 0.6)',

  // Text colors
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.85)',
  textTertiary: 'rgba(255, 255, 255, 0.65)',
  textDisabled: 'rgba(255, 255, 255, 0.45)',
  textMuted: '#999',

  // Status colors
  success: '#39AA8F',
  successHover: '#2d8a6f',
  warning: '#FEB700',
  error: '#FD4979', // Using magenta for error as well to match palette
  errorHover: '#e03e6b',
  info: '#4ED9EC',

  // Border colors
  border: 'rgba(255, 255, 255, 0.1)',
  borderLight: 'rgba(255, 255, 255, 0.15)',
  borderMedium: 'rgba(255, 255, 255, 0.25)',
  borderPrimary: 'rgba(78, 217, 236, 0.15)',
  borderMagenta: 'rgba(253, 73, 121, 0.2)',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Disabled
  disabled: '#444',
}

// Spacing (using rem units for consistency)
export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  xxl: '2rem',      // 32px
  xxxl: '3rem',     // 48px
}

// Font sizes
export const FONT_SIZES = {
  xs: '0.75rem',    // 12px
  sm: '0.85rem',    // 13.6px
  base: '0.9rem',  // 14.4px
  md: '1rem',       // 16px
  lg: '1.1rem',     // 17.6px
  xl: '1.25rem',    // 20px
  xxl: '1.5rem',    // 24px
  xxxl: '2rem',     // 32px
}

// Border radius
export const BORDER_RADIUS = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '50%',
}

// Transitions
export const TRANSITIONS = {
  fast: '0.15s',
  normal: '0.2s',
  slow: '0.3s',
}

// Shadows
export const SHADOWS = {
  sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
  md: '0 4px 12px rgba(78, 217, 236, 0.3)',
  lg: '0 6px 16px rgba(78, 217, 236, 0.4)',
}

// Z-index
export const Z_INDEX = {
  dropdown: 100,
  modal: 1000,
  tooltip: 1100,
}
