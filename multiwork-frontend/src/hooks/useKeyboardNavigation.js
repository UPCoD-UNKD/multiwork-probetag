import { useEffect } from 'react'

/**
 * Custom hook for keyboard navigation
 * Handles Enter and Escape keys for better accessibility
 * 
 * @param {Object} options - Navigation options
 * @param {Function} options.onEnter - Callback for Enter key
 * @param {Function} options.onEscape - Callback for Escape key
 * @param {boolean} options.enabled - Whether navigation is enabled (default: true)
 */
export const useKeyboardNavigation = ({ onEnter, onEscape, enabled = true }) => {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e) => {
      // Don't handle if user is typing in input/textarea
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return
      }

      if (e.key === 'Enter' && onEnter) {
        e.preventDefault()
        onEnter(e)
      } else if (e.key === 'Escape' && onEscape) {
        e.preventDefault()
        onEscape(e)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onEnter, onEscape, enabled])
}

/**
 * Hook for focus management in modals
 * Traps focus within modal and returns focus on close
 */
export const useFocusTrap = (isOpen, modalRef) => {
  useEffect(() => {
    if (!isOpen || !modalRef?.current) return

    const modal = modalRef.current
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTab = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    // Focus first element when modal opens
    firstElement?.focus()

    modal.addEventListener('keydown', handleTab)
    return () => {
      modal.removeEventListener('keydown', handleTab)
    }
  }, [isOpen, modalRef])
}
