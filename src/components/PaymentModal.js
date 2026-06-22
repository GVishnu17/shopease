import React, { useState } from 'react';

export default function PaymentModal({ total, onClose, onSuccess }) {
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upi, setUpi] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (method === 'card') {
      if (!/^\d{16}$/.test(card.number.replace(/\s/g, ''))) e.number = 'Enter a valid 16-digit card number';
      if (!card.name.trim()) e.name = 'Name is required';
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = 'Use MM/YY format';
      if (!/^\d{3}$/.test(card.cvv)) e.cvv = 'CVV must be 3 digits';
    }
    if (method === 'upi') {
      if (!upi.includes('@')) e.upi = 'Enter a valid UPI ID (e.g. name@upi)';
    }
    return e;
  };

  const handlePay = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSuccess();
  };

  const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val) => val.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.close} onClick={onClose}>X</button>
        <h2 style={styles.title}>Payment</h2>
        <p style={styles.total}>Total: <strong>${total}</strong></p>
        <div style={styles.methods}>
          {['card', 'upi', 'cod'].map(m => (
            <button key={m} style={{ ...styles.methodBtn, ...(method === m ? styles.methodActive : {}) }}
              onClick={() => { setMethod(m); setErrors({}); }}>
              {m === 'card' ? 'Card' : m === 'upi' ? 'UPI' : 'Cash on Delivery'}
            </button>
          ))}
        </div>
        {method === 'card' && (
          <div style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Card Number</label>
              <input style={styles.input} placeholder="1234 5678 9012 3456"
                value={card.number} onChange={e => setCard({ ...card, number: formatCard(e.target.value) })} />
              {errors.number && <span style={styles.error}>{errors.number}</span>}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Name on Card</label>
              <input style={styles.input} placeholder="John Doe"
                value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} />
              {errors.name && <span style={styles.error}>{errors.name}</span>}
            </div>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Expiry</label>
                <input style={styles.input} placeholder="MM/YY"
                  value={card.expiry} onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })} />
                {errors.expiry && <span style={styles.error}>{errors.expiry}</span>}
              </div>
              <div style={styles.field}>
                <label style={styles.label}>CVV</label>
                <input style={styles.input} placeholder="123" maxLength={3}
                  value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })} />
                {errors.cvv && <span style={styles.error}>{errors.cvv}</span>}
              </div>
            </div>
          </div>
        )}
        {method === 'upi' && (
          <div style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>UPI ID</label>
              <input style={styles.input} placeholder="yourname@upi"
                value={upi} onChange={e => setUpi(e.target.value)} />
              {errors.upi && <span style={styles.error}>{errors.upi}</span>}
            </div>
          </div>
        )}
        {method === 'cod' && (
          <p style={styles.codMsg}>Pay when your order arrives. No extra charges.</p>
        )}
        <button style={styles.payBtn} onClick={handlePay}>
          {method === 'cod' ? 'Place Order' : 'Pay $' + total}
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '440px', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  close: { position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666' },
  title: { margin: '0 0 4px', fontSize: '22px', fontWeight: '700' },
  total: { margin: '0 0 20px', color: '#555', fontSize: '15px' },
  methods: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  methodBtn: { flex: 1, padding: '10px', border: '2px solid #e0e0e0', borderRadius: '8px', background: '#f9f9f9', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  methodActive: { border: '2px solid #4f46e5', background: '#eef2ff', color: '#4f46e5' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  row: { display: 'flex', gap: '12px' },
  field: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  label: { fontSize: '13px', fontWeight: '600', color: '#444' },
  input: { padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  error: { color: '#e53e3e', fontSize: '12px' },
  codMsg: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px', color: '#166534', fontSize: '14px' },
  payBtn: { marginTop: '24px', width: '100%', padding: '14px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' },
};
