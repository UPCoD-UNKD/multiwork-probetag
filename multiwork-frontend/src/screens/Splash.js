import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Login } from './Login'
import { useViewMode } from '../viewmode/ViewModeContext'
import { useLanguage } from '../i18n/LanguageContext'

import logo from '../assets/svg/logo/splash-logo.svg'

function Splash() {
  const navigate = useNavigate()
  const { isDesktop } = useViewMode()
  const { t } = useLanguage()

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/login')
    }, 3000)

    return () => clearTimeout(timeout)
  }, [navigate])

  return (
    <>
    <div className="hidden"><Login /></div>
    <div className='mw'>
      <div className={`screen splash ${isDesktop ? 'desktop-mode' : ''}`}>
        <div className="content">
          <h1 className='title'>{t('splash.welcome')}</h1>
          <img src={logo} className='logo-splash' alt='MultiWork Logo' />
        </div>
      </div>
    </div>
    </>
  )
}

export { Splash }
