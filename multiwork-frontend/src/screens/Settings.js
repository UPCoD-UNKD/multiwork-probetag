import React from 'react'
import Appbar from '../components/bars/Appbar'
import Tabbar from '../components/bars/Tabbar'
import { useViewMode } from '../viewmode/ViewModeContext'
import { useLanguage } from '../i18n/LanguageContext'
import { MdPhoneAndroid, MdDesktopMac, MdAutoAwesome, MdLanguage } from 'react-icons/md'

function Settings() {
  const { viewMode, isAutoDetect, toggleAutoDetect, setMode } = useViewMode()
  const { language, changeLanguage, t } = useLanguage()

  return (
    <div className='mw'>
      <div className={`screen ${viewMode === 'desktop' ? 'desktop-mode' : ''}`}>
        <Appbar show='flex' />
        <div className="content">
          <h1 className="title form">{t('settings.title')}</h1>
          
          <div style={{ marginTop: '32px' }}>
            <h2 style={{ color: '#4ED9EC', fontSize: '16px', marginBottom: '16px' }}>{t('settings.viewMode')}</h2>
            
            {/* Автоматическое определение */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px 16px',
              marginBottom: '16px',
              backgroundColor: 'rgba(93, 95, 239, 0.25)',
              borderRadius: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MdAutoAwesome color="#4ED9EC" size={20} />
                <span style={{ color: '#fff', fontSize: '14px' }}>{t('settings.autoDetect')}</span>
              </div>
              <label style={{ 
                position: 'relative',
                display: 'inline-block',
                width: '48px',
                height: '24px'
              }}>
                <input
                  type="checkbox"
                  checked={isAutoDetect}
                  onChange={toggleAutoDetect}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: isAutoDetect ? '#4ED9EC' : '#ccc',
                  transition: '0.3s',
                  borderRadius: '24px'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '18px',
                    width: '18px',
                    left: '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    transition: '0.3s',
                    borderRadius: '50%',
                    transform: isAutoDetect ? 'translateX(24px)' : 'translateX(0)'
                  }} />
                </span>
              </label>
            </div>

            {/* Ручной переключатель режимов */}
            {!isAutoDetect && (
              <div style={{ 
                display: 'flex', 
                gap: '12px',
                marginBottom: '16px'
              }}>
                <button
                  onClick={() => setMode('mobile')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '16px',
                    backgroundColor: viewMode === 'mobile' ? 'rgba(78, 217, 236, 0.3)' : 'rgba(93, 95, 239, 0.25)',
                    border: viewMode === 'mobile' ? '2px solid #4ED9EC' : '2px solid transparent',
                    borderRadius: '12px',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  <MdPhoneAndroid size={24} color={viewMode === 'mobile' ? '#4ED9EC' : '#C3C8FF'} />
                  <span style={{ fontSize: '12px' }}>{t('settings.mobile')}</span>
                </button>
                <button
                  onClick={() => setMode('desktop')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '16px',
                    backgroundColor: viewMode === 'desktop' ? 'rgba(78, 217, 236, 0.3)' : 'rgba(93, 95, 239, 0.25)',
                    border: viewMode === 'desktop' ? '2px solid #4ED9EC' : '2px solid transparent',
                    borderRadius: '12px',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  <MdDesktopMac size={24} color={viewMode === 'desktop' ? '#4ED9EC' : '#C3C8FF'} />
                  <span style={{ fontSize: '12px' }}>{t('settings.desktop')}</span>
                </button>
              </div>
            )}

            {/* Информация о текущем режиме */}
            <div style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(93, 95, 239, 0.15)',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#C3C8FF'
            }}>
              {isAutoDetect 
                ? `${t('settings.autoDetecting')}: ${t('settings.currently')} ${viewMode === 'desktop' ? t('settings.desktop') : t('settings.mobile')} ${t('settings.mode') || 'mode'}`
                : `${t('settings.manualMode')}: ${viewMode === 'desktop' ? t('settings.desktop') : t('settings.mobile')}`
              }
            </div>
          </div>

          {/* Language Selection */}
          <div style={{ marginTop: '32px' }}>
            <h2 style={{ color: '#4ED9EC', fontSize: '16px', marginBottom: '16px' }}>{t('settings.language')}</h2>
            
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              marginBottom: '16px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => changeLanguage('en')}
                style={{
                  flex: 1,
                  minWidth: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px',
                  backgroundColor: language === 'en' ? 'rgba(78, 217, 236, 0.3)' : 'rgba(93, 95, 239, 0.25)',
                  border: language === 'en' ? '2px solid #4ED9EC' : '2px solid transparent',
                  borderRadius: '12px',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <MdLanguage size={24} color={language === 'en' ? '#4ED9EC' : '#C3C8FF'} />
                <span style={{ fontSize: '12px' }}>{t('settings.english')}</span>
              </button>
              <button
                onClick={() => changeLanguage('ru')}
                style={{
                  flex: 1,
                  minWidth: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px',
                  backgroundColor: language === 'ru' ? 'rgba(78, 217, 236, 0.3)' : 'rgba(93, 95, 239, 0.25)',
                  border: language === 'ru' ? '2px solid #4ED9EC' : '2px solid transparent',
                  borderRadius: '12px',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <MdLanguage size={24} color={language === 'ru' ? '#4ED9EC' : '#C3C8FF'} />
                <span style={{ fontSize: '12px' }}>{t('settings.russian')}</span>
              </button>
              <button
                onClick={() => changeLanguage('uk')}
                style={{
                  flex: 1,
                  minWidth: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px',
                  backgroundColor: language === 'uk' ? 'rgba(78, 217, 236, 0.3)' : 'rgba(93, 95, 239, 0.25)',
                  border: language === 'uk' ? '2px solid #4ED9EC' : '2px solid transparent',
                  borderRadius: '12px',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <MdLanguage size={24} color={language === 'uk' ? '#4ED9EC' : '#C3C8FF'} />
                <span style={{ fontSize: '12px' }}>{t('settings.ukrainian')}</span>
              </button>
            </div>

            <div style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(93, 95, 239, 0.15)',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#C3C8FF'
            }}>
              {t('settings.selectLanguage')}: {language === 'en' ? t('settings.english') : language === 'ru' ? t('settings.russian') : t('settings.ukrainian')}
            </div>
          </div>
        </div>
        <Tabbar show='flex' />
      </div>
    </div>
  )
}

export {Settings}
