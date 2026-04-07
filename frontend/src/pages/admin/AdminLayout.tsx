import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import '../../styles/components/_admin.scss';

export default function AdminLayout() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <Loader />;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__title">Admin Panel</div>
        <nav className="admin-sidebar__nav">
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/categories">Categories</NavLink>
          <NavLink to="/admin/gallery">Gallery</NavLink>
          <NavLink to="/admin/pricing">Pricing</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
        </nav>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
