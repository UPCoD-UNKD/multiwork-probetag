import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { createApplication } from '../api/applications.api';
import { toast } from 'react-toastify';
import { useLanguage } from '../i18n/LanguageContext';
import { validateBio } from '../utils/validation';
import { logError } from '../utils/logger';
import { handleApiError, getUserFriendlyMessage } from '../utils/errorHandler';

/**
 * Improved ApplicationModal component with:
 * - Client-side validation
 * - Better error handling
 * - Internationalization
 * - Accessibility improvements
 * - Logger instead of console.log
 */
const ApplicationModal = ({ isOpen, onClose, projectId, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;

    // Client-side validation
    setError(null);
    const validation = validateBio(message, 1000);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    if (!message.trim()) {
      setError(t('application.messageRequired') || 'Message is required');
      return;
    }

    setLoading(true);
    try {
      await createApplication(projectId, message.trim());
      toast.success(t('application.sentSuccess') || 'Application sent successfully!');
      setMessage('');
      setError(null);
      onSuccess?.();
      onClose();
    } catch (err) {
      logError('Failed to create application:', err);
      
      // Use improved error handling
      const handledError = await handleApiError(err);
      const userMessage = getUserFriendlyMessage(handledError, t);
      
      setError(userMessage);
      toast.error(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setMessage('');
      setError(null);
      onClose();
    }
  };

  // Handle Escape key
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape' && !loading) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, loading]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-modal-title"
      aria-describedby="application-modal-description"
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
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          handleClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 
            id="application-modal-title"
            style={{ 
              margin: 0, 
              color: '#ffffff', 
              fontSize: '1.5rem',
              fontWeight: '600'
            }}
          >
            {t('application.title') || 'Submit Application'}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            aria-label={t('common.close') || 'Close modal'}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1.5rem',
              padding: '0.5rem',
              opacity: loading ? 0.5 : 1
            }}
          >
            <MdClose />
          </button>
        </div>

        <p 
          id="application-modal-description"
          style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            marginBottom: '1.5rem',
            fontSize: '0.95rem'
          }}
        >
          {t('application.description') || 'Tell us why you want to join this project:'}
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setError(null); // Clear error on input
            }}
            placeholder={t('application.messagePlaceholder') || 'Your message...'}
            rows="6"
            required
            aria-label={t('application.messageLabel') || 'Application message'}
            aria-describedby={error ? 'message-error' : undefined}
            aria-invalid={!!error}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '0.5rem',
              borderRadius: '8px',
              border: `1px solid ${error ? '#ff6b6b' : 'rgba(255, 255, 255, 0.3)'}`,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '1rem',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />

          {error && (
            <div 
              id="message-error"
              role="alert"
              aria-live="assertive"
              style={{
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(255, 68, 68, 0.2)',
                color: '#ff6b6b',
                borderRadius: '8px',
                fontSize: '0.9rem',
                border: '1px solid rgba(255, 68, 68, 0.3)'
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              aria-label={t('common.cancel') || 'Cancel'}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                opacity: loading ? 0.5 : 1
              }}
            >
              {t('common.cancel') || 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading || !message.trim()}
              aria-label={t('application.submit') || 'Submit application'}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: loading || !message.trim() ? 'rgba(78, 217, 236, 0.5)' : '#4ED9EC',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading || !message.trim() ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              {loading ? (t('common.submitting') || 'Submitting...') : (t('application.submit') || 'Submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
