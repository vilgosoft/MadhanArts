import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/api';
import type { Order } from '../types';
import Loader from '../components/common/Loader';
import Invoice from '../components/Invoice/Invoice';
import '../styles/components/_home.scss';
import '../styles/components/_admin.scss';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      orderApi.list().then((res) => {
        const data = res.data.data;
        setOrders(Array.isArray(data) ? data : data.orders || []);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="my-orders">
      <div className="section-title">
        <span className="section-label">Your Commissions</span>
        <h2>My Orders</h2>
        <p>Track the status of your art commissions</p>
      </div>

      {orders.length === 0 ? (
        <div className="gallery-empty">
          <div className="gallery-empty__icon">&#128230;</div>
          <p>You haven't placed any orders yet. Browse our gallery to get started!</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Art Style</th>
              <th>Size</th>
              <th>Amount</th>
              <th>Needed By</th>
              <th>Status</th>
              <th>Date</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td><strong>{order.order_number}</strong></td>
                <td>{order.category_name}</td>
                <td>{order.size_label}</td>
                <td style={{ fontWeight: 600, color: '#b08930' }}>
                  &#8377;{parseFloat(order.amount).toLocaleString('en-IN')}
                </td>
                <td style={{ fontSize: '0.85rem', color: '#8a8490' }}>
                  {order.needed_by_date
                    ? new Date(order.needed_by_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '—'}
                </td>
                <td>
                  <span className={`status-badge status-badge--${order.order_status}`}>
                    {order.order_status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#8a8490' }}>
                  {new Date(order.created_at).toLocaleDateString('en-IN')}
                </td>
                <td>
                  <button
                    onClick={() => setInvoiceOrder(order)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      background: 'rgba(212,168,83,0.12)',
                      color: '#b08930',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {invoiceOrder && (
        <Invoice order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
      )}
    </div>
  );
}
