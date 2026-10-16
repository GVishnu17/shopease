import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

const FREE_SHIPPING_MIN = 50;
const SHIPPING_FEE = 5;
const TAX_RATE = 0.08;

export default function Checkout() {
  const { cart, totalPrice, clearCart, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const uid = user ? user.uid : null;
  const userName = user ? user.name : '';
  const userEmail = user ? user.email : '';

  const [form, setForm] = useState({ name: '', address: '', email: '' });
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      let saved = {};
      try {
        const snap = await getDoc(doc(db, 'users', uid, 'data', 'profile'));
        if (snap.exists()) saved = snap.data();
      } catch {
        // ignore: the form simply stays as the user types it
      }
      if (cancelled) return;
      const address = [saved.address, saved.city, saved.state, saved.pin].filter(Boolean).join(', ');
      setForm((current) => ({
        name: current.name || userName,
        email: current.email || userEmail,
        address: current.address || address,
      }));
    }

    if (uid) loadProfile();
    return () => {
      cancelled = true;
    };
  }, [uid, userName, userEmail]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = totalPrice;
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const tax = subtotal * TAX_RATE;

  const discount = useMemo(() => {
    const normalized = coupon.trim().toUpperCase();

    if (!normalized) return 0;
    if (normalized === 'SAVE10') return subtotal * 0.1;
    if (normalized === 'WELCOME5') return subtotal * 0.05;
    if (normalized === 'FREESHIP') return shipping;
    return 0;
  }, [coupon, shipping, subtotal]);

  const finalTotal = Math.max(0, subtotal + shipping + tax - discount);

  const applyCoupon = () => {
    const normalized = coupon.trim().toUpperCase();
    const validCoupons = ['SAVE10', 'WELCOME5', 'FREESHIP'];

    if (!normalized) {
      setCouponError('Please enter a coupon code.');
      setCouponApplied(false);
      return;
    }

    if (!validCoupons.includes(normalized)) {
      setCouponError('Invalid coupon code. Try SAVE10, WELCOME5, or FREESHIP.');
      setCouponApplied(false);
      return;
    }

    setCouponError('');
    setCouponApplied(true);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    const orderId = `SE-${Date.now().toString().slice(-6)}`;
    const order = {
      id: orderId,
      customer: form.name || 'Guest',
      email: form.email,
      address: form.address,
      items: cart,
      subtotal,
      shipping: shipping === 0 ? 0 : shipping,
      tax,
      discount,
      total: finalTotal,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    try {
      const existingOrders = JSON.parse(localStorage.getItem('shopease_orders') || '[]');
      localStorage.setItem('shopease_orders', JSON.stringify([...existingOrders, order]));
    } catch {
      // ignore storage failures
    }

    if (uid) {
      const cloudOrder = {
        ...order,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '',
        })),
      };
      setDoc(doc(db, 'users', uid, 'orders', orderId), cloudOrder).catch(() => {});
    }

    clearCart();
    navigate(`/orders/${orderId}`);
  };

  if (itemCount === 0) {
    return (
      <main className="checkout">
        <p>Your cart is empty.</p>
        <button className="btn btn--primary" onClick={() => navigate('/')}>Back to Shop</button>
      </main>
    );
  }

  return (
    <main className="checkout">
      <h1>Checkout</h1>
      <div className="checkout__grid">
        <form className="checkout__form" onSubmit={handlePlaceOrder}>
          <p style={{ fontSize: '13px', color: '#777', margin: 0 }}>
            Your name, email and saved address are filled in from your <Link to="/profile">profile</Link>.
          </p>
          <label>
            Full Name
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Shipping Address
            <input type="text" name="address" value={form.address} onChange={handleChange} required />
          </label>

          <div className="coupon-box">
            <label>
              Coupon Code
              <input
                type="text"
                value={coupon}
                onChange={(e) => {
                  setCoupon(e.target.value);
                  setCouponError('');
                  setCouponApplied(false);
                }}
                placeholder="SAVE10, WELCOME5, FREESHIP"
              />
            </label>
            <button type="button" className="btn btn--secondary coupon-btn" onClick={applyCoupon}>
              Apply
            </button>
          </div>

          {couponError && <p className="coupon-error">{couponError}</p>}
          {couponApplied && <p className="coupon-success">Coupon applied successfully!</p>}

          <button type="submit" className="btn btn--primary btn--full">Proceed to Payment</button>
        </form>

        <div className="checkout__summary">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="checkout__line">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="checkout__line">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="checkout__line">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="checkout__line">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="checkout__line">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
          <div className="checkout__line checkout__line--total">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          total={finalTotal.toFixed(2)}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </main>
  );
}
