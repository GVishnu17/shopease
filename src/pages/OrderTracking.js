import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const STATUS_FLOW = ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('shopease_orders') || '[]');
      const found = saved.find((item) => item.id === orderId);
      setOrder(found || null);
    } catch {
      setOrder(null);
    }
  }, [orderId]);

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

  return (
    <main className="tracking-page">
      <div className="tracking-card">
        <p className="tracking-card__eyebrow">Order #{order.id}</p>
        <h1>Track your order</h1>
        <p className="tracking-card__meta">
          Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.customer}
        </p>

        <div className="tracking-progress">
          {STATUS_FLOW.map((status, index) => (
            <div key={status} className={`tracking-step ${index <= currentIndex ? 'active' : ''}`}>
              <span className="tracking-step__dot" />
              <span>{status}</span>
            </div>
          ))}
        </div>

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
