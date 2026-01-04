import { login } from '../../api/auth.api';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { validateLoginForm } from '../../utils/validation'
import { logError } from '../../utils/logger'
import { handleApiError, getUserFriendlyMessage } from '../../utils/errorHandler'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'


function FormLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { setIsAuth } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Client-side validation
    const validation = validateLoginForm({ email, password });
    if (!validation.valid) {
      setError(validation.errors.email || validation.errors.password || validation.errors.general);
      return;
    }
    
    setLoading(true);

    try {
      await login(email, password);
      setIsAuth(true);
      navigate('/home');
    } catch (err) {
      logError('Login failed:', err);
      const handledError = await handleApiError(err);
      const userMessage = getUserFriendlyMessage(handledError, t);
      setError(userMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className='form'>
      <h1 className="title form">{t('auth.login')}</h1>

      <input
        type='email'
        placeholder={t('auth.email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        value={loading ? t('auth.signingIn') : t('auth.signIn')}
        disabled={loading}
      />

      <Link to='/forgot' className="title form mini">{t('auth.forgotPassword')}</Link>
      <Link to='/signup' className="title form medium">{t('auth.createAccount')}</Link>
    </form>
  )
}

export { FormLogin }