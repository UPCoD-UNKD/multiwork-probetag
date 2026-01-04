import React from 'react'
import {FormForgot} from '../components/forms/FormForgot'
import { useViewMode } from '../viewmode/ViewModeContext'

function Forgot() {
  const { isDesktop } = useViewMode()
  
  return (
    <div className='mw'>
      <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
        <div className="content">
          <FormForgot />
        </div>
      </div>
    </div>
  )
}

export {Forgot}
