import React from 'react'
import {FormRegister} from '../components/forms/FormRegister'
import { useViewMode } from '../viewmode/ViewModeContext'

function Signup() {
  const { isDesktop } = useViewMode()
  
  return (
    <div className='mw'>
      <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
        <div className="content">
          <FormRegister />
        </div>
      </div>
    </div>
  )
}

export {Signup}
