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
  // Enforce mobile-only mode for the entire application
  const [viewMode] = useState('mobile')
  const [isAutoDetect] = useState(false)

  // Manage body class for consistency (though desktop-body will never be added)
  useEffect(() => {
    document.body.classList.remove('desktop-body')
    return () => {
      document.body.classList.remove('desktop-body')
    }
  }, [])

  const toggleViewMode = () => {
    // No-op: Toggle disabled
  }

  const setMode = (mode) => {
    // No-op: Setting mode disabled
  }

  const toggleAutoDetect = () => {
    // No-op: Auto-detect disabled
  }

  const value = {
    viewMode: 'mobile',
    isDesktop: false,
    isMobile: true,
    isAutoDetect: false,
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
