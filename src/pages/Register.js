import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await register(form);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate('/login', { state: { registered: true } });
  };

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create your account</h1>
        <p style={styles.subtitle}>Join ShopEase to start shopping</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Full Name
            <input style={styles.input} type="text" name="name" value={form.name} onChange={handleChange} />
          </label>
          <label style={styles.label}>
            Email
            <input style={styles.input} type="email" name="email" value={form.email} onChange={handleChange} />
          </label>
          <label style={styles.label}>
            Password
            <input style={styles.input} type="password" name="password" value={form.password} onChange={handleChange} />
          </label>
          <label style={styles.label}>
            Confirm Password
            <input style={styles.input} type="password" name="confirm" value={form.confirm} onChange={handleChange} />
          </label>
          <button type="submit" style={styles.primaryBtn} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Log in</Link>
        </p>
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
  primaryBtn: { padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  error: { background: '#fef2f2', color: '#b91c1c', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', margin: '0 0 12px' },
  footerText: { textAlign: 'center', marginTop: '18px', fontSize: '14px', color: '#555' },
  link: { color: '#4f46e5', fontWeight: '600', textDecoration: 'none' },
};
