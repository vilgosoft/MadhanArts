import { useState, useEffect } from 'react';
import { orderApi } from '../../services/api';
import type { Order, OrderStatus } from '../../types';
import Loader from '../../components/common/Loader';
import { getApiOrigin } from '../../utils/apiOrigin';

const STATUS_OPTIONS: OrderStatus[] = ['received', 'in_progress', 'completed', 'delivered', 'cancelled'];
const apiOrigin = getApiOrigin();

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
          style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #e8e4df', fontSize: '0.85rem' }}
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
                  <td>₹{parseFloat(order.amount).toLocaleString('en-IN')}</td>
                  <td>
                    <a
                      href={`${apiOrigin}/api/orders/${order.id}/photo`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#c9a96e', fontSize: '0.85rem' }}
                    >
                      Download
                    </a>
                  </td>
                  <td>
                    <select
                      value={order.order_status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #e8e4df',
                        fontSize: '0.8rem',
                      }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#999' }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPage(p); load(p); }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '4px',
                    border: p === page ? '2px solid #c9a96e' : '1px solid #e8e4df',
                    background: p === page ? 'rgba(201,169,110,0.1)' : '#fff',
                    cursor: 'pointer',
                    fontWeight: p === page ? 600 : 400,
                  }}
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
