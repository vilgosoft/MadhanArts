import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import '../../styles/components/_header.scss';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="header__inner">
          <Link to="/" className="header__logo">
            <Logo size={38} className="header__logo-svg" />
            <span className="header__logo-text">
              Madhan <span>Arts</span>
            </span>
          </Link>

          <nav className="header__nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/gallery">Gallery</NavLink>
            {user && !isAdmin && <NavLink to="/my-orders">My Orders</NavLink>}
            {isAdmin && <NavLink to="/admin">Admin</NavLink>}
          </nav>

          <div className="header__actions">
            {user ? (
              <>
                <span className="header__user">
                  Hi, <strong>{user.name}</strong>
                </span>
                <button className="header__btn--ghost" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button className="header__btn" onClick={() => navigate('/login')}>
                Get Started
              </button>
            )}
            <button
              className="header__menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? '\u2715' : '\u2630'}
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
          {!user && <Link to="/login">Login / Register</Link>}
        </nav>
      )}
    </>
  );
}
