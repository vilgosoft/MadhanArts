import { useState, useEffect } from 'react';
import { orderApi } from '../../services/api';
import type { Order, OrderStatus } from '../../types';
import Loader from '../../components/common/Loader';
import Invoice from '../../components/Invoice/Invoice';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import '../../styles/components/_admin.scss';

const STATUS_OPTIONS: OrderStatus[] = ['received', 'in_progress', 'completed', 'delivered', 'cancelled'];

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);

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

  const handleDeleteOrder = async (id: number) => {
    await orderApi.delete(id);
    load();
  };

  const handlePhotoDownload = async (order: Order) => {
    try {
      const res = await orderApi.downloadPhoto(order.id);
      const blobUrl = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = blobUrl;
      const extension = (order.reference_photo?.split('.').pop() || 'jpg').toLowerCase();
      a.download = `${order.order_number}-reference.${extension}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      alert('Unable to download photo. Please check admin login and API setup.');
    }
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
          <table className="admin-table admin-table--responsive-cards">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Category</th>
                <th>Size</th>
                <th>Amount</th>
                <th>Needed By</th>
                <th>Photo</th>
                <th>Status</th>
                <th>Date</th>
                <th>Invoice</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td data-label="Order #"><strong>{order.order_number}</strong></td>
                  <td data-label="Customer">{order.user_name}</td>
                  <td data-label="Category">{order.category_name}</td>
                  <td data-label="Size">{order.size_label}</td>
                  <td data-label="Amount" style={{ fontWeight: 600, color: '#b08930' }}>
                    &#8377;{parseFloat(order.amount).toLocaleString('en-IN')}
                  </td>
                  <td data-label="Needed By" style={{ fontSize: '0.82rem', color: '#8a8490' }}>
                    {order.needed_by_date
                      ? new Date(order.needed_by_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—'}
                  </td>
                  <td data-label="Photo">
                    <button
                      type="button"
                      className="admin-link-btn"
                      onClick={() => handlePhotoDownload(order)}
                    >
                      Download
                    </button>
                  </td>
                  <td data-label="Status">
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
                  <td data-label="Date" style={{ fontSize: '0.82rem', color: '#8a8490' }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td data-label="Invoice">
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
                  <td data-label="Actions">
                    <div className="admin-table__actions">
                      <button type="button" className="delete" onClick={() => setDeleteTarget(order)}>
                        Delete
                      </button>
                    </div>
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

      {invoiceOrder && (
        <Invoice order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Order"
          message={`Permanently delete order ${deleteTarget.order_number}? This cannot be undone.`}
          confirmText="Delete"
          danger
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await handleDeleteOrder(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
}
