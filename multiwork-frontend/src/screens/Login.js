import React from 'react'
import {FormLogin} from '../components/forms/FormLogin'
import { useViewMode } from '../viewmode/ViewModeContext'

function Login() {
  const { isDesktop } = useViewMode()
  
  return (
    <div className='mw'>
      <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
        <div className="content">
          <FormLogin />
        </div>
      </div>
    </div>
  )
}

export {Login}
