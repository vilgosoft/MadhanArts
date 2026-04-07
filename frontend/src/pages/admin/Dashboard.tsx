import { useState, useEffect } from 'react';
import { orderApi, categoryApi } from '../../services/api';

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

  const cards = [
    { label: 'Total Orders', value: stats.orders, color: '#c9a96e' },
    { label: 'Categories', value: stats.categories, color: '#27ae60' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontFamily: "'Playfair Display', serif", marginBottom: '32px' }}>
        Dashboard
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
        {cards.map((card) => (
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
            <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {card.label}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
