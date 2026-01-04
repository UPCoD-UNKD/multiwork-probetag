import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../../api/auth.api'
import { toast } from 'react-toastify';
import { useLanguage } from '../../i18n/LanguageContext'
import { validateRegistrationForm } from '../../utils/validation'
import { logError } from '../../utils/logger'
import { handleApiError, getUserFriendlyMessage } from '../../utils/errorHandler'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'

function FormRegister() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    // Client-side validation
    const validation = validateRegistrationForm({ email, username, password });
    if (!validation.valid) {
      const errorMessage = validation.errors.email || validation.errors.username || validation.errors.password || validation.errors.general;
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    
    setLoading(true)

    try {
      await register(email, username, password)
      toast.success(t('auth.userCreatedSuccess'));
      navigate('/onboarding')
    } catch (err) {
      logError('Registration failed:', err);
      const handledError = await handleApiError(err);
      const userMessage = getUserFriendlyMessage(handledError, t);
      setError(userMessage);
      toast.error(userMessage);
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="form">
        <h1 className="title form">{t('auth.signup')}</h1>

        <input
          type="email"
          placeholder={t('auth.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder={t('auth.username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ paddingRight: '50px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.6)',
              transition: 'color 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'
            }}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <input
          type="submit"
          value={loading ? t('common.creating') : t('auth.signup')}
          disabled={loading}
        />
      </form>

      <Link to="/login" className="title form medium">
        {t('auth.alreadyHaveAccount')}
      </Link>
    </>
  )
}

export { FormRegister }
