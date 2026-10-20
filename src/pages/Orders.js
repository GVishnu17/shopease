import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export default function Orders() {
  const { user } = useAuth();
  const uid = user ? user.uid : null;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const q = query(collection(db, 'users', uid, 'orders'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        if (cancelled) return;
        setOrders(snap.docs.map((d) => d.data()));
      } catch {
        if (!cancelled) setError('Could not load your orders. Please try again.');
      }
      if (!cancelled) setLoading(false);
    }

    if (uid) load();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  if (loading) {
    return (
      <main style={styles.page}>
        <p>Loading your orders...</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.wrap}>
        <h1 style={styles.title}>My Orders</h1>
        <p style={styles.subtitle}>Your orders are saved to your account, so you can see them on any device.</p>

        {error && <p style={styles.error}>{error}</p>}

        {!error && orders.length === 0 && (
          <div style={styles.empty}>
            <div style={{ fontSize: '48px' }}>📦</div>
            <p>You have no orders yet.</p>
            <Link to="/" style={styles.shopLink}>Start shopping</Link>
          </div>
        )}

        {orders.map((order) => {
          const open = openId === order.id;
          const count = (order.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
          return (
            <div key={order.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <p style={styles.orderId}>Order {order.id}</p>
                  <p style={styles.meta}>{formatDate(order.createdAt)} · {count} item{count !== 1 ? 's' : ''}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={styles.total}>{money(order.total)}</p>
                  <span style={styles.badge}>{order.status || 'Confirmed'}</span>
                </div>
              </div>

              <button type="button" style={styles.toggle} onClick={() => setOpenId(open ? null : order.id)}>
                {open ? 'Hide details' : 'View details'}
              </button>

              {open && (
                <div style={styles.details}>
                  {(order.items || []).map((item) => (
                    <div key={item.id} style={styles.itemRow}>
                      {item.image && <img src={item.image} alt={item.name} style={styles.thumb} />}
                      <span style={{ flex: 1 }}>{item.name} x {item.quantity}</span>
                      <span>{money(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div style={styles.line}><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
                  <div style={styles.line}><span>Shipping</span><span>{order.shipping ? money(order.shipping) : 'FREE'}</span></div>
                  <div style={styles.line}><span>Tax</span><span>{money(order.tax)}</span></div>
                  <div style={styles.line}><span>Discount</span><span>-{money(order.discount)}</span></div>
                  <div style={{ ...styles.line, fontWeight: '700' }}><span>Total</span><span>{money(order.total)}</span></div>
                  {Number(order.refundAmount || 0) > 0 && (
                    <>
                      <div style={styles.line}><span>Refunded</span><span>{money(order.refundAmount)}</span></div>
                      {order.refundReason && <p style={styles.address}><b>Refund reason:</b> {order.refundReason}</p>}
                    </>
                  )}
                  <p style={styles.address}><b>Delivery to:</b> {order.customer}, {order.address}</p>
                  <Link to={`/orders/${order.id}`} style={styles.shopLink}>Track this order</Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: '70vh', display: 'flex', justifyContent: 'center', padding: '32px 16px' },
  wrap: { width: '100%', maxWidth: '720px' },
  title: { margin: '0 0 4px', fontSize: '28px', color: '#1a1a2e' },
  subtitle: { margin: '0 0 20px', color: '#777', fontSize: '14px' },
  error: { background: '#fef2f2', color: '#b91c1c', padding: '10px 12px', borderRadius: '8px', fontSize: '14px' },
  empty: { background: '#fff', borderRadius: '16px', padding: '32px', textAlign: 'center', boxShadow: '0 10px 40px rgba(79,70,229,0.12)' },
  card: { background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 10px 40px rgba(79,70,229,0.12)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', gap: '12px' },
  orderId: { margin: 0, fontWeight: '700', color: '#1a1a2e' },
  meta: { margin: '4px 0 0', color: '#777', fontSize: '13px' },
  total: { margin: 0, fontWeight: '700', fontSize: '18px', color: '#4f46e5' },
  badge: { display: 'inline-block', marginTop: '6px', padding: '2px 10px', borderRadius: '999px', background: '#ecfdf5', color: '#047857', fontSize: '12px', fontWeight: '600' },
  toggle: { marginTop: '12px', background: 'none', border: 'none', padding: 0, color: '#4f46e5', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
  details: { marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '12px', fontSize: '14px' },
  itemRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' },
  thumb: { width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' },
  line: { display: 'flex', justifyContent: 'space-between', padding: '4px 0' },
  address: { marginTop: '10px', color: '#555' },
  shopLink: { display: 'inline-block', marginTop: '8px', color: '#4f46e5', fontWeight: '600', textDecoration: 'none' },
};
