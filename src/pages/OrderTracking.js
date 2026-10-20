import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const STATUS_FLOW = ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

function findLocalOrder(orderId) {
  try {
    const saved = JSON.parse(localStorage.getItem('shopease_orders') || '[]');
    return saved.find((item) => item.id === orderId) || null;
  } catch {
    return null;
  }
}

export default function OrderTracking() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const uid = user ? user.uid : null;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      let found = null;

      if (uid) {
        try {
          const snap = await getDoc(doc(db, 'users', uid, 'orders', orderId));
          if (snap.exists()) found = snap.data();
        } catch {
          // fall back to the copy saved on this device
        }
      }

      if (!found) found = findLocalOrder(orderId);
      if (cancelled) return;
      setOrder(found);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [orderId, uid]);

  if (loading) {
    return (
      <main className="tracking-page">
        <p>Loading your order...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="tracking-page">
        <h1>Order not found</h1>
        <p>We couldn’t find that order ID.</p>
        <Link to="/" className="btn btn--primary">Back to shopping</Link>
      </main>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(order.status);
  const isTrackingStatus = currentIndex >= 0;

  return (
    <main className="tracking-page">
      <div className="tracking-card">
        <p className="tracking-card__eyebrow">Order #{order.id}</p>
        <h1>Track your order</h1>
        <p className="tracking-card__meta">
          Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.customer}
        </p>

        {isTrackingStatus ? (
          <div className="tracking-progress">
            {STATUS_FLOW.map((status, index) => (
              <div key={status} className={`tracking-step ${index <= currentIndex ? 'active' : ''}`}>
                <span className="tracking-step__dot" />
                <span>{status}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="tracking-card__meta"><strong>Status:</strong> {order.status || 'Confirmed'}</p>
        )}

        {Number(order.refundAmount || 0) > 0 && (
          <p className="tracking-card__meta">
            Refund recorded: ${Number(order.refundAmount).toFixed(2)}
            {order.refundReason ? ` · ${order.refundReason}` : ''}
          </p>
        )}

        <div className="tracking-summary">
          <div>
            <p className="tracking-summary__label">Shipping to</p>
            <strong>{order.address}</strong>
          </div>
          <div>
            <p className="tracking-summary__label">Total</p>
            <strong>${Number(order.total || 0).toFixed(2)}</strong>
          </div>
        </div>

        <Link to="/" className="btn btn--primary">Continue Shopping</Link>
      </div>
    </main>
  );
}
