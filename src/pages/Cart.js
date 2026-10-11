import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const FREE_SHIPPING_MIN = 50;
const SHIPPING_FEE = 5;
const TAX_RATE = 0.08;

export default function Cart() {
  const { cart, totalPrice, itemCount } = useCart();
  const navigate = useNavigate();

  const shipping = totalPrice >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const tax = totalPrice * TAX_RATE;
  const subtotal = totalPrice;
  const grandTotal = subtotal + shipping + tax;

  const progress = Math.min((subtotal / FREE_SHIPPING_MIN) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_MIN - subtotal, 0);

  const summaryRows = useMemo(() => [
    { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
    { label: 'Shipping', value: shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}` },
    { label: 'Tax (8%)', value: `$${tax.toFixed(2)}` },
    { label: 'Total', value: `$${grandTotal.toFixed(2)}`, highlight: true },
  ], [subtotal, shipping, tax, grandTotal]);

  if (itemCount === 0) {
    return (
      <main className="cart cart--empty">
        <div className="cart__empty-icon">🛒</div>
        <h1>Your cart is empty</h1>
        <p>Looks like you haven't added anything yet.</p>
        <button className="btn btn--primary" onClick={() => navigate('/')}>Start Shopping</button>
      </main>
    );
  }

  return (
    <main className="cart">
      <h1>Your Cart ({itemCount} item{itemCount !== 1 ? 's' : ''})</h1>

      <div className="cart__shipping-bar">
        <p>
          {remaining > 0
            ? `Add $${remaining.toFixed(2)} more for FREE shipping!`
            : '🎉 You get FREE shipping!'}
        </p>
        <div className="cart__progress">
          <div className="cart__progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="cart__items">
        {cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="cart__summary">
        {summaryRows.map((row) => (
          <div key={row.label} className={`cart__row ${row.highlight ? 'cart__total' : ''}`}>
            <span>{row.label}</span>
            <span>{row.value}</span>
          </div>
        ))}
      </div>

      <button className="btn btn--primary btn--full" onClick={() => navigate('/checkout')}>
        Proceed to Checkout
      </button>
      <button className="cart__continue" onClick={() => navigate('/')}>
        ← Continue Shopping
      </button>
    </main>
  );
}
