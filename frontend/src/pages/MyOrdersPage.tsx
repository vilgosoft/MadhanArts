import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/api';
import type { Order } from '../types';
import Loader from '../components/common/Loader';
import '../styles/components/_admin.scss';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div style={{ padding: '40px 24px', maxWidth: '900px', margin: '0 auto' }}>
      <div className="section-title">
        <h2>My Orders</h2>
        <p>Track the status of your art commissions</p>
      </div>

      {orders.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>You haven't placed any orders yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Category</th>
              <th>Size</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td><strong>{order.order_number}</strong></td>
                <td>{order.category_name}</td>
                <td>{order.size_label}</td>
                <td>₹{parseFloat(order.amount).toLocaleString('en-IN')}</td>
                <td>
                  <span className={`status-badge status-badge--${order.order_status}`}>
                    {order.order_status.replace('_', ' ')}
                  </span>
                </td>
                <td>{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
