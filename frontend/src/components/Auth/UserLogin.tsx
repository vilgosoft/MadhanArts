import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';

export default function UserLogin() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = (location.state as { returnTo?: string })?.returnTo || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        const res = await authApi.register(name, email || undefined, phone || undefined);
        login(res.data.data.token, res.data.data.user);
      } else {
        const res = await authApi.login(email || undefined, phone || undefined);
        login(res.data.data.token, res.data.data.user);
      }
      navigate(returnTo);
    } catch (err) {
      const fallback = mode === 'register' ? 'Registration failed' : 'User not found';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (data && typeof data === 'object') {
          const d = data as { message?: string; error?: string };
          setError(d.message || d.error || fallback);
        } else if (err.code === 'ERR_NETWORK') {
          setError('Cannot reach API. Is the server running (port 8000) and VITE_API_URL correct?');
        } else {
          setError(fallback);
        }
      } else {
        setError(fallback);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '120px auto', padding: '0 24px' }}>
      <div className="wizard-card">
        <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p>{mode === 'login' ? 'Sign in with your email or phone' : 'Register to place orders'}</p>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="modal__field">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="modal__field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="modal__field">
            <label>Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
            />
          </div>

          {error && <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</p>}

          <button
            type="submit"
            className="wizard-nav__next"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: '#999' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{ background: 'none', border: 'none', color: '#c9a96e', cursor: 'pointer', fontWeight: 500 }}
          >
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
