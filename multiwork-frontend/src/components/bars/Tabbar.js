import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdHome, MdPerson, MdAddCircleOutline, MdBusinessCenter, MdSettings } from 'react-icons/md';
import { useAuth } from '../../auth/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationBadge from '../NotificationBadge';

const Tabbar = (props) => {
  const grey = '#C3C8FF';
  const blue = '#4ED9EC';
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(location.pathname);
  const { isAuth } = useAuth();
  const { data: notificationData } = useNotifications({ 
    enabled: isAuth // Only fetch notifications if user is authenticated
  });
  
  const notificationCount = notificationData?.total || 0;

  const handleClick = (path) => {
    setActive(path);
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    // Navigate to project creation start screen
    navigate('/project/new');
    setActive('/project/new');
  };

  return (
      <div className="tabbar" style={{ display: props.show }}>
        <Link className='linkto' onClick={() => handleClick('/home')} to="/home">
          <MdHome width={24} color={active === '/home' ? blue : grey} />
          <small style={{color: active === '/home' ? blue : grey}}>Home</small>
        </Link>
        <Link className='linkto' onClick={() => handleClick('/profile')} to="/profile">
          <MdPerson width={24} color={active === '/profile' ? blue : grey} />
          <small style={{color: active === '/profile' ? blue : grey}}>Profile</small>
        </Link>
        <Link 
          className='linkto' 
          onClick={handleCreateProject}
          to="/project/new"
        >
          <MdAddCircleOutline width={24} color={active === '/project/new' ? blue : grey} />
          <small style={{color: active === '/project/new' ? blue : grey}}>Project</small>
        </Link>
        <Link className='linkto' onClick={() => handleClick('/user/projects')} to="/user/projects">
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <MdBusinessCenter width={24} color={active === '/user/projects' ? blue : grey} />
            {isAuth && notificationCount > 0 && (
              <NotificationBadge count={notificationCount} />
            )}
          </div>
          <small style={{color: active === '/user/projects' ? blue : grey}}>Joined</small>
        </Link>
        <Link className='linkto' onClick={() => handleClick('/settings')} to="/settings">
          <MdSettings width={24} color={active === '/settings' ? blue : grey} />
          <small style={{color: active === '/settings' ? blue : grey}}>Settings</small>
        </Link>
    </div>
  )
}

export default Tabbar
