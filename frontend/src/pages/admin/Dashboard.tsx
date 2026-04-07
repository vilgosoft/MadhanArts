import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi, categoryApi, userApi } from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, categories: 0, users: 0 });

  useEffect(() => {
    Promise.all([
      orderApi.list(1, 1),
      categoryApi.listAll(),
      userApi.list(1, 1),
    ]).then(([ordersRes, catRes, usersRes]) => {
      setStats({
        orders: ordersRes.data.data.total || 0,
        categories: catRes.data.data.length || 0,
        users: usersRes.data.data.total || 0,
      });
    }).catch(() => {});
  }, []);

  const cards: { label: string; value: number; color: string; link?: string }[] = [
    { label: 'Total Orders', value: stats.orders, color: '#c9a96e' },
    { label: 'Categories', value: stats.categories, color: '#27ae60' },
    { label: 'Registered Users', value: stats.users, color: '#3498db', link: '/admin/users' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontFamily: "'Playfair Display', serif", marginBottom: '32px' }}>
        Dashboard
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
        {cards.map((card) => {
          const inner = (
            <>
              <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {card.label}
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' }}>
                {card.value}
              </p>
              {card.link && (
                <p style={{ marginTop: '12px', fontSize: '0.8rem' }}>
                  <Link to={card.link} style={{ color: '#c9a96e', fontWeight: 500 }}>
                    View user list →
                  </Link>
                </p>
              )}
            </>
          );
          return (
            <div
              key={card.label}
              style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '28px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                borderLeft: `4px solid ${card.color}`,
              }}
            >
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
