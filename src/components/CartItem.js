import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item__image" />
      <div className="cart-item__info">
        <h4>{item.name}</h4>
        <p>${item.price.toFixed(2)} each</p>
      </div>
      <div className="cart-item__quantity">
        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
        <span>{item.quantity}</span>
        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
      </div>
      <p className="cart-item__subtotal">${(item.price * item.quantity).toFixed(2)}</p>
      <button className="cart-item__remove" onClick={() => removeFromCart(item.id)}>
        Remove
      </button>
    </div>
  );
}
