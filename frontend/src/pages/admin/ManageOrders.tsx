import { useState, useEffect } from 'react';
import { orderApi } from '../../services/api';
import type { Order, OrderStatus } from '../../types';
import Loader from '../../components/common/Loader';
import '../../styles/components/_admin.scss';

const STATUS_OPTIONS: OrderStatus[] = ['received', 'in_progress', 'completed', 'delivered', 'cancelled'];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const load = (p = page) => {
    setLoading(true);
    orderApi.list(p, 20, filterStatus || undefined).then((res) => {
      const data = res.data.data;
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.pages);
      setLoading(false);
    });
  };

  useEffect(() => { load(1); setPage(1); }, [filterStatus]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    await orderApi.updateStatus(orderId, newStatus);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Orders ({total})</h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '24px', border: '2px solid #e8e2d8', fontSize: '0.85rem', background: '#fff' }}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Category</th>
                <th>Size</th>
                <th>Amount</th>
                <th>Photo</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.order_number}</strong></td>
                  <td>{order.user_name}</td>
                  <td>{order.category_name}</td>
                  <td>{order.size_label}</td>
                  <td style={{ fontWeight: 600, color: '#b08930' }}>
                    &#8377;{parseFloat(order.amount).toLocaleString('en-IN')}
                  </td>
                  <td>
                    <a
                      href={`${API_URL}/api/orders/${order.id}/photo`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#d4a853', fontWeight: 600, fontSize: '0.82rem' }}
                    >
                      Download
                    </a>
                  </td>
                  <td>
                    <select
                      value={order.order_status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: '2px solid #e8e2d8',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: '#fff',
                      }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#8a8490' }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`pagination__btn ${p === page ? 'pagination__btn--active' : ''}`}
                  onClick={() => { setPage(p); load(p); }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
