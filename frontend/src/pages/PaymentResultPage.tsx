import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Order } from '../types';
import { paymentApi } from '../services/api';
import Loader from '../components/common/Loader';

export default function PaymentResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const orderId = Number(searchParams.get('order_id') || '0');
    if (!orderId) {
      setMessage('Order id is missing from payment return URL.');
      setLoading(false);
      return;
    }

    paymentApi.verifyPhonePe(orderId)
      .then((res) => {
        const order: Order = res.data.data.order;
        if (order.payment_status === 'paid') {
          navigate('/order-success', { replace: true, state: { order } });
          return;
        }
        setMessage(order.payment_status === 'failed'
          ? 'Payment failed. Please retry payment from My Orders.'
          : 'Payment is pending confirmation. Check My Orders shortly.');
      })
      .catch((err: unknown) => {
        let text = 'Unable to verify payment right now.';
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosErr = err as { response?: { data?: { message?: string } } };
          text = axiosErr.response?.data?.message || text;
        } else if (err instanceof Error) {
          text = err.message;
        }
        setMessage(text);
      })
      .finally(() => setLoading(false));
  }, [navigate, searchParams]);

  return (
    <div className="order-success">
      {loading ? (
        <Loader text="Verifying payment..." />
      ) : (
        <>
          <h1>Payment Update</h1>
          <p className="order-success__subtitle">{message}</p>
          <button className="order-success__btn" onClick={() => navigate('/my-orders')}>
            View My Orders
          </button>
        </>
      )}
    </div>
  );
}

