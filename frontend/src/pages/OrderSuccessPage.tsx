import { useLocation, useNavigate } from 'react-router-dom';
import type { Order } from '../types';

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = (location.state as { order?: Order })?.order;

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '160px 24px' }}>
        <h2>No order found</h2>
        <button onClick={() => navigate('/')} style={{ marginTop: '16px', padding: '10px 24px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '160px 24px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>&#10003;</div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '12px' }}>
        Order Placed!
      </h1>
      <p style={{ color: '#999', marginBottom: '24px' }}>
        Your order <strong>{order.order_number}</strong> has been received.
        We'll start working on your artwork soon.
      </p>

      <div style={{
        background: '#fff',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        textAlign: 'left',
        marginBottom: '24px',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', color: '#999' }}>Order Number</td>
              <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 500 }}>{order.order_number}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#999' }}>Category</td>
              <td style={{ padding: '8px 0', textAlign: 'right' }}>{order.category_name}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#999' }}>Size</td>
              <td style={{ padding: '8px 0', textAlign: 'right' }}>{order.size_label}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#999' }}>Amount</td>
              <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, color: '#b08d4f' }}>
                ₹{parseFloat(order.amount).toLocaleString('en-IN')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate('/my-orders')}
        style={{ padding: '12px 28px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.85rem' }}
      >
        View My Orders
      </button>
    </div>
  );
}
