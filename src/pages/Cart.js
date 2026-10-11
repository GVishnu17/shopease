import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const FREE_SHIPPING_MIN = 50; // free shipping above this amount
const SHIPPING_FEE = 5;       // shipping charge below that amount
const TAX_RATE = 0.08;        // 8% tax

export default function Cart() {
  const { cart, totalPrice, itemCount } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0) {
    return (
      <main className="cart cart--empty">
        <div className="cart__empty-icon">🛒</div>
        <h1>Your cart is empty</h1>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/" className="btn btn--primary">Start Shopping</Link>
      </main>
    );
  }

  const shipping = totalPrice >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const tax = totalPrice * TAX_RATE;
  const grandTotal = totalPrice + shipping + tax;
  const remaining = FREE_SHIPPING_MIN - totalPrice;
  const progress = Math.min((totalPrice / FREE_SHIPPING_MIN) * 100, 100);

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
        <div className="cart__row">
          <span>Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="cart__row">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="cart__row">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="cart__row cart__total">
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <button className="btn btn--primary btn--full" onClick={() => navigate('/checkout')}>
        Proceed to Checkout
      </button>
      <Link to="/" className="cart__continue">← Continue Shopping</Link>
    </main>
  );
}
