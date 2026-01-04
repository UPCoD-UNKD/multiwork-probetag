import React from 'react'
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme'

/**
 * Skeleton loader component for better UX during loading states
 */
const LoadingSkeleton = ({ 
  variant = 'card', 
  count = 1,
  width,
  height 
}) => {
  const skeletons = Array.from({ length: count }, (_, i) => i)

  if (variant === 'card') {
    return (
      <>
        {skeletons.map((idx) => (
          <div
            key={idx}
            className="card"
            style={{
              animation: 'pulse 1.5s ease-in-out infinite',
              backgroundColor: COLORS.backgroundMedium,
              border: `1px solid ${COLORS.border}`,
              borderRadius: BORDER_RADIUS.md,
              padding: SPACING.lg,
              minHeight: '150px'
            }}
            aria-label="Loading project card"
            role="status"
          >
            <div style={{ display: 'flex', gap: SPACING.md, marginBottom: SPACING.md }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: BORDER_RADIUS.sm,
                  backgroundColor: COLORS.backgroundDark
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    height: '20px',
                    width: '60%',
                    borderRadius: BORDER_RADIUS.sm,
                    backgroundColor: COLORS.backgroundDark,
                    marginBottom: SPACING.xs
                  }}
                />
                <div
                  style={{
                    height: '16px',
                    width: '80%',
                    borderRadius: BORDER_RADIUS.sm,
                    backgroundColor: COLORS.backgroundDark
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: SPACING.md, justifyContent: 'space-between' }}>
              <div
                style={{
                  height: '16px',
                  width: '80px',
                  borderRadius: BORDER_RADIUS.sm,
                  backgroundColor: COLORS.backgroundDark
                }}
              />
              <div
                style={{
                  height: '16px',
                  width: '100px',
                  borderRadius: BORDER_RADIUS.sm,
                  backgroundColor: COLORS.backgroundDark
                }}
              />
            </div>
          </div>
        ))}
        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </>
    )
  }

  if (variant === 'text') {
    return (
      <>
        {skeletons.map((idx) => (
          <div
            key={idx}
            style={{
              height: height || '20px',
              width: width || '100%',
              borderRadius: BORDER_RADIUS.sm,
              backgroundColor: COLORS.backgroundDark,
              animation: 'pulse 1.5s ease-in-out infinite',
              marginBottom: SPACING.xs
            }}
            aria-label="Loading content"
            role="status"
          />
        ))}
        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </>
    )
  }

  return null
}

export default LoadingSkeleton
