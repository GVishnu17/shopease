import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PaymentModal from '../components/PaymentModal';

export default function Checkout() {
  const { cart, totalPrice, clearCart, itemCount } = useCart();
  const [form, setForm] = useState({ name: '', address: '' });
  const [showPayment, setShowPayment] = useState(false);
  const [placed, setPlaced] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setPlaced(true);
    clearCart();
  };

  if (itemCount === 0 && !placed) {
    return (
      <main className="checkout">
        <p>Your cart is empty.</p>
        <Link to="/" className="btn btn--primary">Back to Shop</Link>
      </main>
    );
  }

  if (placed) {
    return (
      <main className="checkout checkout--confirmed">
        <h1>Order Placed!</h1>
        <p>Thanks, {form.name || "there"}! Your order has been received.</p>
        <Link to="/" className="btn btn--primary">Continue Shopping</Link>
      </main>
    );
  }

  return (
    <main className="checkout">
      <h1>Checkout</h1>
      <div className="checkout__grid">
        <form className="checkout__form" onSubmit={handlePlaceOrder}>
          <label>
            Full Name
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Shipping Address
            <input type="text" name="address" value={form.address} onChange={handleChange} required />
          </label>
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
          <div className="checkout__line checkout__line--total">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      {showPayment && (
        <PaymentModal
          total={totalPrice.toFixed(2)}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </main>
  );
}
