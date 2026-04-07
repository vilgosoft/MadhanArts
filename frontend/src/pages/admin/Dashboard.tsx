import { useState, useEffect } from 'react';
import { orderApi, categoryApi } from '../../services/api';
import '../../styles/components/_admin.scss';

export default function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, categories: 0 });

  useEffect(() => {
    Promise.all([
      orderApi.list(1, 1),
      categoryApi.listAll(),
    ]).then(([ordersRes, catRes]) => {
      setStats({
        orders: ordersRes.data.data.total || 0,
        categories: catRes.data.data.length || 0,
      });
    }).catch(() => {});
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
          <div className="stat-card__icon">&#128247;</div>
          <div className="stat-card__label">Gallery Items</div>
          <div className="stat-card__value">-</div>
        </div>

        <div className="stat-card stat-card--lavender">
          <div className="stat-card__icon">&#128176;</div>
          <div className="stat-card__label">Revenue</div>
          <div className="stat-card__value">-</div>
        </div>
      </div>
    </div>
  );
}
