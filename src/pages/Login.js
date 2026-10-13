import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login, resetPassword } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const justRegistered = location.state && location.state.registered;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setError('');
    setInfo('');

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Type your email in the Email box first, then click Forgot password.');
      return;
    }

    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setInfo('If an account exists for this email, a reset link has been sent. Please check your inbox and your spam folder.');
  };

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Log in to continue to ShopEase</p>

        {justRegistered && !error && !info && (
          <p style={styles.success}>Registration successful! Please log in.</p>
        )}
        {info && <p style={styles.success}>{info}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label style={styles.label}>
            Password
            <input style={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button type="button" onClick={handleReset} disabled={loading} style={styles.forgot}>
            Forgot password?
          </button>
          <button type="submit" style={styles.primaryBtn} disabled={loading}>
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>

        <div style={styles.divider}>New to ShopEase?</div>
        <Link to="/register" style={styles.registerBtn}>Register</Link>
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  card: { background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '420px', boxShadow: '0 10px 40px rgba(79,70,229,0.15)' },
  title: { margin: '0 0 4px', fontSize: '26px', color: '#1a1a2e' },
  subtitle: { margin: '0 0 20px', color: '#777', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  label: { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', fontWeight: '600', color: '#333' },
  input: { padding: '10px 12px', border: '1.5px solid #dbe2f0', borderRadius: '8px', fontSize: '14px' },
  forgot: { alignSelf: 'flex-end', background: 'none', border: 'none', padding: 0, color: '#4f46e5', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  primaryBtn: { padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  error: { background: '#fef2f2', color: '#b91c1c', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', margin: '0 0 12px' },
  success: { background: '#f0fdf4', color: '#15803d', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', margin: '0 0 12px' },
  divider: { textAlign: 'center', margin: '20px 0 10px', fontSize: '14px', color: '#888' },
  registerBtn: { display: 'block', textAlign: 'center', padding: '12px', border: '1.5px solid #4f46e5', borderRadius: '8px', color: '#4f46e5', fontWeight: '600', textDecoration: 'none', fontSize: '15px' },
};
