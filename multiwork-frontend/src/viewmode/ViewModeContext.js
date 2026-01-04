import React, { createContext, useContext, useState, useEffect } from 'react'

const ViewModeContext = createContext()

export const useViewMode = () => {
  const context = useContext(ViewModeContext)
  if (!context) {
    throw new Error('useViewMode must be used within ViewModeProvider')
  }
  return context
}

export const ViewModeProvider = ({ children }) => {
  // Определяем начальный режим из localStorage или по размеру экрана
  const getInitialMode = () => {
    const savedMode = localStorage.getItem('viewMode')
    if (savedMode === 'mobile' || savedMode === 'desktop') {
      return savedMode
    }
    // Автоматическое определение по размеру экрана
    return window.innerWidth >= 1024 ? 'desktop' : 'mobile'
  }

  const [viewMode, setViewMode] = useState(getInitialMode)
  const [isAutoDetect, setIsAutoDetect] = useState(
    localStorage.getItem('viewModeAutoDetect') !== 'false'
  )

  // Автоматическое определение размера экрана
  useEffect(() => {
    if (!isAutoDetect) return

    const handleResize = () => {
      const shouldBeDesktop = window.innerWidth >= 1024
      const currentIsDesktop = viewMode === 'desktop'
      
      if (shouldBeDesktop !== currentIsDesktop) {
        setViewMode(shouldBeDesktop ? 'desktop' : 'mobile')
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Проверяем при монтировании

    return () => window.removeEventListener('resize', handleResize)
  }, [isAutoDetect, viewMode])

  // При включении автоопределения - определяем режим заново
  useEffect(() => {
    if (isAutoDetect) {
      const shouldBeDesktop = window.innerWidth >= 1024
      setViewMode(shouldBeDesktop ? 'desktop' : 'mobile')
      localStorage.removeItem('viewMode') // Удаляем сохраненный режим при автоопределении
    }
  }, [isAutoDetect])

  // Сохраняем режим в localStorage при изменении (только если автоопределение выключено)
  useEffect(() => {
    if (!isAutoDetect) {
      localStorage.setItem('viewMode', viewMode)
    } else {
      localStorage.removeItem('viewMode')
    }
  }, [viewMode, isAutoDetect])

  // Управление классом body для прокрутки
  useEffect(() => {
    if (viewMode === 'desktop') {
      document.body.classList.add('desktop-body')
    } else {
      document.body.classList.remove('desktop-body')
    }
    return () => {
      document.body.classList.remove('desktop-body')
    }
  }, [viewMode])

  // Сохраняем настройку автоопределения
  useEffect(() => {
    localStorage.setItem('viewModeAutoDetect', isAutoDetect.toString())
  }, [isAutoDetect])

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'mobile' ? 'desktop' : 'mobile')
  }

  const setMode = (mode) => {
    if (mode === 'mobile' || mode === 'desktop') {
      setViewMode(mode)
    }
  }

  const toggleAutoDetect = () => {
    setIsAutoDetect(prev => !prev)
  }

  const value = {
    viewMode,
    isDesktop: viewMode === 'desktop',
    isMobile: viewMode === 'mobile',
    isAutoDetect,
    toggleViewMode,
    setMode,
    toggleAutoDetect
  }

  return (
    <ViewModeContext.Provider value={value}>
      {children}
    </ViewModeContext.Provider>
  )
}

