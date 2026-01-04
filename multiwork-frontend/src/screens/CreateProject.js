import React from 'react'
import { useNavigate } from 'react-router-dom'
import Appbar from '../components/bars/Appbar'
import Tabbar from '../components/bars/Tabbar'
import { useViewMode } from '../viewmode/ViewModeContext'
import { useLanguage } from '../i18n/LanguageContext'

function CreateProject() {
  const { isDesktop } = useViewMode()
  const { t } = useLanguage()
  const navigate = useNavigate()
  
  const handleStartCreation = () => {
    navigate('/onboarding/project')
  }
  
  return (
    <div className='mw'>
      <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
        <Appbar show='flex' />
        <div className="content" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 120px)',
          padding: '2rem',
          background: 'linear-gradient(135deg, #312C4F 0%, #111723 50%, #312C4F 100%)'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '1rem'
            }}>
              {t('projects.createProject')}
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '3rem'
            }}>
              {t('projects.startProjectCreation')}
            </p>
            <button
              onClick={handleStartCreation}
              style={{
                width: '100%',
                padding: '1.5rem 2rem',
                backgroundColor: '#D1085B',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 24px rgba(209, 8, 91, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#b0074a'
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 12px 32px rgba(209, 8, 91, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#D1085B'
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 8px 24px rgba(209, 8, 91, 0.4)'
              }}
            >
              {t('projects.startCreation')}
            </button>
          </div>
        </div>
        <Tabbar show='flex' />
      </div>
    </div>
  )
}

export {CreateProject}
