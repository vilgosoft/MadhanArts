import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi, categoryApi, userApi } from '../../services/api';
import '../../styles/components/_admin.scss';

export default function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, categories: 0, users: 0 });

  useEffect(() => {
    Promise.all([
      orderApi.list(1, 1),
      categoryApi.listAll(),
      userApi.list(1, 1),
    ])
      .then(([ordersRes, catRes, usersRes]) => {
        setStats({
          orders: ordersRes.data.data.total || 0,
          categories: catRes.data.data.length || 0,
          users: usersRes.data.data.total || 0,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card stat-card--gold">
          <div className="stat-card__icon">&#127912;</div>
          <div className="stat-card__label">Total Orders</div>
          <div className="stat-card__value">{stats.orders}</div>
        </div>

        <div className="stat-card stat-card--teal">
          <div className="stat-card__icon">&#128396;</div>
          <div className="stat-card__label">Categories</div>
          <div className="stat-card__value">{stats.categories}</div>
        </div>

        <div className="stat-card stat-card--rose">
          <div className="stat-card__icon">&#128100;</div>
          <div className="stat-card__label">Registered Users</div>
          <div className="stat-card__value">{stats.users}</div>
          <Link to="/admin/users" className="stat-card__link">
            View all users
          </Link>
        </div>

        <div className="stat-card stat-card--lavender">
          <div className="stat-card__icon">&#128176;</div>
          <div className="stat-card__label">Revenue</div>
          <div className="stat-card__value">—</div>
        </div>
      </div>
    </div>
  );
}
