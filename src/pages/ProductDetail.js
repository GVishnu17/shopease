import React from 'react';
import { useParams, Link } from 'react-router-dom';
import products from '../data/products.json';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <main className="product-detail">
        <p>Product not found.</p>
        <Link to="/">Back to shop</Link>
      </main>
    );
  }

  return (
    <main className="product-detail">
      <Link to="/" className="product-detail__back">← Back to shop</Link>
      <div className="product-detail__grid">
        <img src={product.image} alt={product.name} className="product-detail__image" />
        <div className="product-detail__info">
          <span className="product-detail__category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-detail__price">${product.price.toFixed(2)}</p>
          <p className="product-detail__description">{product.description}</p>
          <button className="btn btn--primary" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
