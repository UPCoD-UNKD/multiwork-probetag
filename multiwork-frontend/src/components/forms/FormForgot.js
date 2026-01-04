import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'

function FormForgot() {
  const [showMessage, setShowMessage] = useState(false)
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowMessage(true)
    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit} className='form'>
      <h1 className="title form">{t('auth.passwordRecovery')}</h1>
      <input type='email' placeholder={t('auth.email')} />
      <input type='submit' value={t('auth.recoverPassword')} />
      {showMessage && (
        <p className="title form mini">{t('auth.checkEmail')}</p>
      )}
      <Link to='/login' className="title form medium">{t('auth.backToLogin')}</Link>
    </form>
  )
}

export { FormForgot }
