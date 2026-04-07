import { useLocation, useNavigate } from 'react-router-dom';
import type { Order } from '../types';
import '../styles/components/_home.scss';

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = (location.state as { order?: Order })?.order;

  if (!order) {
    return (
      <div className="order-success">
        <h1>No order found</h1>
        <button className="order-success__btn" onClick={() => navigate('/')}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="order-success">
      <div className="order-success__check">&#10003;</div>
      <h1>Order Placed!</h1>
      <p className="order-success__subtitle">
        Your order <strong>{order.order_number}</strong> has been received.
        We'll start working on your artwork soon.
      </p>

      <div className="order-success__card">
        <table>
          <tbody>
            <tr>
              <td>Order Number</td>
              <td>{order.order_number}</td>
            </tr>
            <tr>
              <td>Art Style</td>
              <td>{order.category_name}</td>
            </tr>
            <tr>
              <td>Canvas Size</td>
              <td>{order.size_label}</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td className="order-success__card-amount">
                &#8377;{parseFloat(order.amount).toLocaleString('en-IN')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button className="order-success__btn" onClick={() => navigate('/my-orders')}>
        View My Orders
      </button>
    </div>
  );
}
