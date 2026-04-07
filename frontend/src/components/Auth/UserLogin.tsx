import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import '../../styles/components/_auth.scss';

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
    } catch {
      setError(mode === 'register' ? 'Registration failed. Please try again.' : 'User not found. Please register first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__icon">
          {mode === 'login' ? '\u{1F44B}' : '\u2728'}
        </div>
        <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-card__subtitle">
          {mode === 'login' ? 'Sign in to place orders and track commissions' : 'Register to start ordering custom artwork'}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="modal__field">
              <label>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your full name" />
            </div>
          )}
          <div className="modal__field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="modal__field">
            <label>Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" />
          </div>

          {error && <div className="auth-card__error">{error}</div>}

          <button type="submit" className="auth-card__submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-card__switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
