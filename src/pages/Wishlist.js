import React from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-empty">
          <div className="wishlist-empty__icon">💖</div>
          <h1>Your wishlist is empty</h1>
          <p>Save products you love and come back anytime.</p>
          <a href="/" className="btn btn--primary">Shop now</a>
        </div>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <h1>Your Wishlist</h1>
      <div className="product-grid">
        {wishlist.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-card__image" />
            <div className="product-card__body">
              <span className="product-card__category">{product.category}</span>
              <h3 className="product-card__name">{product.name}</h3>
              <p className="product-card__price">${product.price.toFixed(2)}</p>
              <div className="wishlist-actions">
                <button className="btn btn--primary btn--full" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
                <button className="btn btn--secondary" onClick={() => removeFromWishlist(product.id)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
