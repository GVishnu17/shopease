import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!isLogin && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSuccess(true);
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
        <p style={styles.subtitle}>{isLogin ? 'Login to your ShopEase account' : 'Join ShopEase today'}</p>

        {success && <div style={styles.successMsg}>Success! Redirecting...</div>}

        <div style={styles.form}>
          {!isLogin && (
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input style={styles.input} placeholder="John Doe"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              {errors.name && <span style={styles.error}>{errors.name}</span>}
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            {errors.email && <span style={styles.error}>{errors.email}</span>}
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            {errors.password && <span style={styles.error}>{errors.password}</span>}
          </div>
          {isLogin && (
            <p style={{ textAlign: 'right', fontSize: '13px' }}>
              <a href="#" style={styles.link}>Forgot password?</a>
            </p>
          )}
          <button style={styles.btn} onClick={handleSubmit}>
            {isLogin ? 'Login' : 'Create Account'}
          </button>
          <div style={styles.divider}><span>or</span></div>
          <button style={styles.googleBtn}>
            <span style={{ fontSize: '18px' }}>G</span> Continue with Google
          </button>
        </div>

        <p style={styles.switchText}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span style={styles.link} onClick={() => { setIsLogin(!isLogin); setErrors({}); }}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: '80vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' },
  card: { background: '#fff', borderRadius: '20px', padding: '48px 40px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 6px' },
  subtitle: { color: '#888', fontSize: '14px', margin: '0 0 28px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#444' },
  input: { padding: '12px 14px', border: '1.5px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', outline: 'none' },
  error: { color: '#e53e3e', fontSize: '12px' },
  btn: { padding: '14px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
  googleBtn: { padding: '12px', background: '#fff', color: '#333', border: '1.5px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  divider: { textAlign: 'center', color: '#aaa', fontSize: '13px', position: 'relative' },
  link: { color: '#4f46e5', cursor: 'pointer', fontWeight: '600' },
  switchText: { textAlign: 'center', fontSize: '14px', color: '#666', marginTop: '20px' },
  successMsg: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px', color: '#166534', fontSize: '14px', marginBottom: '16px', textAlign: 'center' },
};
