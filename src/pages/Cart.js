import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

export default function Cart() {
  const { cart, totalPrice, itemCount } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0) {
    return (
      <main className="cart cart--empty">
        <h1>Your cart is empty</h1>
        <Link to="/" className="btn btn--primary">Continue Shopping</Link>
      </main>
    );
  }

  return (
    <main className="cart">
      <h1>Your Cart</h1>
      <div className="cart__items">
        {cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className="cart__summary">
        <p>Total ({itemCount} item{itemCount !== 1 ? 's' : ''})</p>
        <p className="cart__total">${totalPrice.toFixed(2)}</p>
      </div>
      <button className="btn btn--primary btn--full" onClick={() => navigate('/checkout')}>
        Proceed to Checkout
      </button>
    </main>
  );
}
