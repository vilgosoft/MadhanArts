import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/_bottom-nav.scss';

export default function BottomNav() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className="bottom-nav__item">
        <span className="bottom-nav__icon">&#127968;</span>
        <span className="bottom-nav__label">Home</span>
      </NavLink>

      <NavLink to="/gallery" className="bottom-nav__item">
        <span className="bottom-nav__icon">&#127912;</span>
        <span className="bottom-nav__label">Gallery</span>
      </NavLink>

      {user && !isAdmin ? (
        <NavLink to="/my-orders" className="bottom-nav__item">
          <span className="bottom-nav__icon">&#128230;</span>
          <span className="bottom-nav__label">Orders</span>
        </NavLink>
      ) : isAdmin ? (
        <NavLink to="/admin" className="bottom-nav__item">
          <span className="bottom-nav__icon">&#9881;</span>
          <span className="bottom-nav__label">Admin</span>
        </NavLink>
      ) : (
        <button type="button" className="bottom-nav__item" onClick={() => navigate('/login')}>
          <span className="bottom-nav__icon">&#128100;</span>
          <span className="bottom-nav__label">Login</span>
        </button>
      )}
    </nav>
  );
}
