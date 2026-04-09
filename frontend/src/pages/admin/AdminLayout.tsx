import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import '../../styles/components/_admin.scss';

export default function AdminLayout() {
  const { user, loading, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <Loader />;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__title">Admin Panel</div>
        <nav className="admin-sidebar__nav" onClick={() => setSidebarOpen(false)}>
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/categories">Categories</NavLink>
          <NavLink to="/admin/gallery">Gallery</NavLink>
          <NavLink to="/admin/pricing">Pricing</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
        </nav>
      </aside>
      <div className="admin-content">
        <div className="admin-mobile-bar">
          <button
            type="button"
            className="admin-mobile-sidebar-toggle"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            {sidebarOpen ? 'Close Menu' : 'Admin Menu'}
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
