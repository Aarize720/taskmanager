import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FiHome, FiCheckSquare, FiCalendar, FiFileText, FiUser, FiBell, FiLogOut } from 'react-icons/fi';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/store/slices/authSlice';
import { fetchUnreadCount } from '@/store/slices/notificationSlice';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchUnreadCount());
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/tasks', icon: FiCheckSquare, label: 'Tasks' },
    { path: '/calendar', icon: FiCalendar, label: 'Calendar' },
    { path: '/notes', icon: FiFileText, label: 'Notes' },
  ];

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-logo">Task Manager</h1>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon className="nav-icon" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link
            to="/profile"
            className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
          >
            <FiUser className="nav-icon" />
            <span>Profile</span>
          </Link>
          <button onClick={handleLogout} className="nav-item logout-btn">
            <FiLogOut className="nav-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <h2 className="page-title">
              {navItems.find((item) => item.path === location.pathname)?.label || 'Profile'}
            </h2>

            <div className="header-actions">
              <Link to="/notifications" className="notification-btn">
                <FiBell />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </Link>

              <div className="user-menu">
                <div className="user-avatar">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
                <div className="user-info">
                  <p className="user-name">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="user-email">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;