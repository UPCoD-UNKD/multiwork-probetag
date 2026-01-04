import React, { useState, useRef, useCallback } from 'react'
import { MdClose } from 'react-icons/md'
import { createApplication } from '../api/applications.api'
import { toast } from 'react-toastify'
import { useLanguage } from '../i18n/LanguageContext'
import { logError } from '../utils/logger'
import { handleApiError, getUserFriendlyMessage } from '../utils/errorHandler'
import { useKeyboardNavigation, useFocusTrap } from '../hooks/useKeyboardNavigation'

/**
 * Modal component for creating a project application.
 * Follows single responsibility principle - only handles application creation UI.
 */
const ApplicationModal = ({ isOpen, onClose, projectId, onSuccess }) => {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()
  const modalRef = useRef(null)

  // Define handleClose using useCallback to ensure stable reference
  const handleClose = useCallback(() => {
    if (!loading) {
      setMessage('')
      onClose()
    }
  }, [loading, onClose])

  // Keyboard navigation
  useKeyboardNavigation({
    onEscape: handleClose,
    enabled: isOpen
  })

  // Focus trap for accessibility
  useFocusTrap(isOpen, modalRef)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (loading) return

    setLoading(true)
    try {
      await createApplication(projectId, message.trim())
      toast.success(t('application.sentSuccess') || 'Application sent successfully!')
      setMessage('')
      onSuccess?.()
      onClose()
    } catch (err) {
      logError('Failed to create application:', err)
      const handledError = await handleApiError(err)
      const userMessage = getUserFriendlyMessage(handledError, t)
      toast.error(userMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
        backdropFilter: 'blur(5px)'
      }}
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-modal-title"
        style={{
          backgroundColor: 'rgba(30, 30, 50, 0.95)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(78, 217, 236, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && !loading) {
            handleClose()
          }
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(78, 217, 236, 0.1)'
          }}
        >
          <h2 
            id="application-modal-title"
            style={{ margin: 0, color: '#4ED9EC', fontSize: '1.5rem', fontWeight: '600' }}
          >
            {t('application.title') || 'Submit Application'}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            aria-label={t('common.close') || 'Close modal'}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.8)',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1.5rem',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              minWidth: '44px',
              minHeight: '44px',
              transition: 'all 0.2s',
              opacity: loading ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                e.target.style.color = '#fff'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.color = 'rgba(255, 255, 255, 0.8)'
              }
            }}
          >
            <MdClose />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ 
              display: 'block', 
              color: 'rgba(255, 255, 255, 0.9)', 
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              {t('application.messageLabel') || 'Message (optional):'}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('application.messagePlaceholder') || 'Tell us about yourself and why you want to join this project...'}
              disabled={loading}
              rows={5}
              maxLength={1000}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'all 0.2s',
                opacity: loading ? 0.6 : 1
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4ED9EC'
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              }}
            />
            <div style={{ 
              marginTop: '0.25rem', 
              fontSize: '0.8rem', 
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'right'
            }}>
              {message.length} / 1000
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginTop: '0.5rem' 
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {t('common.cancel') || 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                padding: '0.75rem',
                backgroundColor: loading ? '#666' : '#4ED9EC',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#3bc4d6'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#4ED9EC'
                }
              }}
            >
              {loading ? (t('common.submitting') || 'Submitting...') : (t('application.submit') || 'Submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ApplicationModal
