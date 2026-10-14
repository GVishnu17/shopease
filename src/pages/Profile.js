import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const EMPTY = { name: '', phone: '', address: '', city: '', state: '', pin: '' };

export default function Profile() {
  const { user, updateName } = useAuth();
  const uid = user ? user.uid : null;
  const userName = user ? user.name : '';
  const userEmail = user ? user.email : '';

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      let saved = {};
      try {
        const snap = await getDoc(doc(db, 'users', uid, 'data', 'profile'));
        if (snap.exists()) saved = snap.data();
      } catch {
        if (!cancelled) setError('Could not load your saved details. You can still edit and save.');
      }
      if (cancelled) return;
      setForm({ ...EMPTY, ...saved, name: userName });
      setLoading(false);
    }

    if (uid) load();
    return () => {
      cancelled = true;
    };
  }, [uid, userName]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const name = form.name.trim();
    const phone = form.phone.trim();
    const pin = form.pin.trim();

    if (name.length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (phone && !/^\+?[0-9 ]{7,15}$/.test(phone)) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (pin && !/^[0-9]{6}$/.test(pin)) {
      setError('PIN code must be 6 digits.');
      return;
    }

    setSaving(true);
    try {
      const result = await updateName(name);
      if (!result.ok) throw new Error(result.error);
      await setDoc(doc(db, 'users', uid, 'data', 'profile'), {
        phone,
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pin,
      });
      setMessage('Profile saved.');
    } catch (err) {
      setError(err.message || 'Could not save your profile. Please try again.');
    }
    setSaving(false);
  };

  const initial = (userName || '?').charAt(0).toUpperCase();

  if (loading) {
    return (
      <main style={styles.page}>
        <p>Loading your profile...</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.avatar}>{initial}</div>
        <h1 style={styles.title}>My Profile</h1>
        <p style={styles.subtitle}>Your details are saved to your account and used at checkout.</p>

        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input style={{ ...styles.input, background: '#f3f4f8' }} type="email" value={userEmail} disabled readOnly />
          </label>
          <label style={styles.label}>
            Full Name
            <input style={styles.input} type="text" name="name" value={form.name} onChange={handleChange} />
          </label>
          <label style={styles.label}>
            Phone
            <input style={styles.input} type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Optional" />
          </label>
          <label style={styles.label}>
            Address
            <input style={styles.input} type="text" name="address" value={form.address} onChange={handleChange} placeholder="House number and street" />
          </label>
          <div style={styles.row}>
            <label style={{ ...styles.label, flex: 1 }}>
              City
              <input style={styles.input} type="text" name="city" value={form.city} onChange={handleChange} />
            </label>
            <label style={{ ...styles.label, flex: 1 }}>
              State
              <input style={styles.input} type="text" name="state" value={form.state} onChange={handleChange} />
            </label>
          </div>
          <label style={styles.label}>
            PIN code
            <input style={styles.input} type="text" name="pin" value={form.pin} onChange={handleChange} maxLength={6} placeholder="6 digits" />
          </label>
          <button type="submit" style={styles.primaryBtn} disabled={saving}>
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  card: { background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '520px', boxShadow: '0 10px 40px rgba(79,70,229,0.15)' },
  avatar: { width: '64px', height: '64px', borderRadius: '50%', background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', marginBottom: '12px' },
  title: { margin: '0 0 4px', fontSize: '26px', color: '#1a1a2e' },
  subtitle: { margin: '0 0 20px', color: '#777', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  row: { display: 'flex', gap: '12px' },
  label: { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', fontWeight: '600', color: '#333' },
  input: { padding: '10px 12px', border: '1.5px solid #dbe2f0', borderRadius: '8px', fontSize: '14px' },
  primaryBtn: { padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  error: { background: '#fef2f2', color: '#b91c1c', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', margin: '0 0 12px' },
  success: { background: '#f0fdf4', color: '#15803d', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', margin: '0 0 12px' },
};
