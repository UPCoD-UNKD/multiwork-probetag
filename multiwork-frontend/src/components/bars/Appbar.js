import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdArrowBack, MdOutlineExitToApp } from 'react-icons/md'
import applogo from '../../assets/svg/logo/logo-sign.svg' // Using petal logo


const Appbar = (props) => {

  const navigate = useNavigate()
  const goBack = (e) => {
    e.preventDefault()
    navigate(-1)
  }

  return (
    <>
      <div className="appbar glass" style={{ display: props.show }}>
        <div className="icons left">
          <Link to="#" onClick={goBack}><MdArrowBack width={20} color={'white'} /></Link>
        </div>
        <img src={applogo} alt='logo' className='logo' />
        <div className="icons">
          <Link to='/login'><MdOutlineExitToApp width={24} color={'white'} /></Link>
        </div>
      </div>
    </>
  )
}

export default Appbar
