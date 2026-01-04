import React from 'react'
import Appbar from '../components/bars/Appbar'
import Tabbar from '../components/bars/Tabbar'
import { useViewMode } from '../viewmode/ViewModeContext'
import { useLanguage } from '../i18n/LanguageContext'

function NotFound() {
  const { isDesktop } = useViewMode()
  const { t } = useLanguage()
  
  return (
    <div className='mw'>
      <div className={`screen not ${isDesktop ? 'desktop-mode' : ''}`}>
        <Appbar show='flex' />
        <div className="content">
          <div className="s-100"></div>
          <h1 className="title form c-pink">{t('notFound.title')}</h1>
          <h4 className="title mini w-80 ma">
            {t('notFound.message')}
          </h4>
        </div>
        <Tabbar show='none' />
      </div>
    </div>
  )
}

export {NotFound}
