import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdHome, MdPerson, MdAddCircleOutline, MdBusinessCenter, MdSettings } from 'react-icons/md';
import { useAuth } from '../../auth/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationBadge from '../NotificationBadge';
import { COLORS } from '../../constants/theme';

const Tabbar = (props) => {
  const grey = 'rgba(255, 255, 255, 0.5)';
  const activeColor = COLORS.magenta;
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(location.pathname);
  const { isAuth } = useAuth();
  const { data: notificationData } = useNotifications({
    enabled: isAuth // Only fetch notifications if user is authenticated
  });

  const notificationCount = notificationData?.total || 0;

  const handleClick = (e, path) => {
    e.preventDefault();
    setActive(path);
    navigate(path);
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    // Navigate to project creation start screen
    navigate('/project/new');
    setActive('/project/new');
  };

  return (
    <div className="tabbar glass" style={{ display: props.show }}>
      <Link className='linkto' onClick={(e) => handleClick(e, '/home')} to="/home">
        <MdHome width={24} color={active === '/home' ? activeColor : grey} />
        <small style={{ color: active === '/home' ? activeColor : grey }}>Home</small>
      </Link>
      <Link className='linkto' onClick={(e) => handleClick(e, '/profile')} to="/profile">
        <MdPerson width={24} color={active === '/profile' ? activeColor : grey} />
        <small style={{ color: active === '/profile' ? activeColor : grey }}>Profile</small>
      </Link>
      <Link
        className='linkto'
        onClick={handleCreateProject}
        to="/project/new"
      >
        <MdAddCircleOutline width={24} color={active === '/project/new' ? activeColor : grey} />
        <small style={{ color: active === '/project/new' ? activeColor : grey }}>Project</small>
      </Link>
      <Link className='linkto' onClick={(e) => handleClick(e, '/user/projects')} to="/user/projects">
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <MdBusinessCenter width={24} color={active === '/user/projects' ? activeColor : grey} />
          {isAuth && notificationCount > 0 && (
            <NotificationBadge count={notificationCount} />
          )}
        </div>
        <small style={{ color: active === '/user/projects' ? activeColor : grey }}>Joined</small>
      </Link>
      <Link className='linkto' onClick={(e) => handleClick(e, '/settings')} to="/settings">
        <MdSettings width={24} color={active === '/settings' ? activeColor : grey} />
        <small style={{ color: active === '/settings' ? activeColor : grey }}>Settings</small>
      </Link>
    </div>
  )
}

export default Tabbar
