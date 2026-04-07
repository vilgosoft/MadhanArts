import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/_header.scss';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="header">
        <div className="header__inner">
          <Link to="/" className="header__logo">
            Madhan <span>Arts</span>
          </Link>

          <nav className="header__nav">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/gallery">Gallery</NavLink>
            {user && !isAdmin && <NavLink to="/my-orders">My Orders</NavLink>}
            {isAdmin && <NavLink to="/admin">Admin Panel</NavLink>}
          </nav>

          <div className="header__actions">
            {user ? (
              <>
                <span style={{ fontSize: '0.85rem', color: '#999' }}>
                  Hi, {user.name}
                </span>
                <button className="header__btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button
                className="header__btn"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            )}
            <button
              className="header__menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <nav className="mobile-nav" onClick={() => setMobileOpen(false)}>
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
          {user && !isAdmin && <Link to="/my-orders">My Orders</Link>}
          {isAdmin && <Link to="/admin">Admin Panel</Link>}
        </nav>
      )}
    </>
  );
}
