import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  // Получаем сохраненный язык из localStorage или используем язык браузера
  const getInitialLanguage = () => {
    const savedLanguage = localStorage.getItem('appLanguage')
    if (savedLanguage === 'en' || savedLanguage === 'ru' || savedLanguage === 'uk') {
      return savedLanguage
    }
    // Определяем язык браузера
    const browserLang = navigator.language || navigator.userLanguage
    if (browserLang.startsWith('uk')) return 'uk'
    if (browserLang.startsWith('ru')) return 'ru'
    return 'en'
  }

  const [language, setLanguage] = useState(getInitialLanguage)

  // Сохраняем язык в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('appLanguage', language)
  }, [language])

  const changeLanguage = (lang) => {
    if (lang === 'en' || lang === 'ru' || lang === 'uk') {
      setLanguage(lang)
    }
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        console.warn(`Translation missing for key: ${key} in language: ${language}`)
        return key
      }
    }
    
    return value || key
  }

  const value = {
    language,
    changeLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

