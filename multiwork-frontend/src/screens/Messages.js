import React from 'react'
import Appbar from '../components/bars/Appbar'
import Tabbar from '../components/bars/Tabbar'
import { useViewMode } from '../viewmode/ViewModeContext'
import { useLanguage } from '../i18n/LanguageContext'

function Messages() {
  const { isDesktop } = useViewMode()
  const { t } = useLanguage()
  
  return (
    <div className='mw'>
      <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
        <Appbar show='flex' />
        <div className="content">
          <h1 className="title">{t('messages.title')}</h1>
        </div>
        <Tabbar show='flex' />
      </div>
    </div>
  )
}

export {Messages}
