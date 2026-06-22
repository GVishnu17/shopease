import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} style={{ fontSize: '14px', color: star <= Math.round(rating) ? '#f59e0b' : '#ddd' }}>★</span>
      ))}
      <span style={{ fontSize: '12px', color: '#888', marginLeft: '2px' }}>{rating}</span>
    </div>
  );
}

function QuickViewModal({ product, onClose, onAdd }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.close} onClick={onClose}>✕</button>
        <div style={styles.modalGrid}>
          <img src={product.image} alt={product.name} style={styles.modalImg} />
          <div style={styles.modalInfo}>
            <span style={styles.modalCategory}>{product.category}</span>
            <h2 style={styles.modalName}>{product.name}</h2>
            <StarRating rating={product.rating} />
            <p style={styles.modalReviews}>{product.reviews} customer reviews</p>
            <p style={styles.modalDesc}>{product.description}</p>
            <p style={styles.modalPrice}>${product.price.toFixed(2)}</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={styles.addBtn} onClick={() => { onAdd(); onClose(); }}>
                Add to Cart
              </button>
              <Link to={"/product/" + product.id} style={styles.viewBtn} onClick={onClose}>
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <div className="product-card">
        <Link to={"/product/" + product.id} className="product-card__image-link">
          <img src={product.image} alt={product.name} className="product-card__image" />
        </Link>
        <div className="product-card__body">
          <span className="product-card__category">{product.category}</span>
          <h3 className="product-card__name">{product.name}</h3>
          <StarRating rating={product.rating} />
          <p style={{ fontSize: '12px', color: '#888', margin: '2px 0 6px' }}>{product.reviews} reviews</p>
          <p style={{ fontSize: '13px', color: '#555', margin: '0 0 10px', lineHeight: '1.5' }}>
            {product.description.length > 60 ? product.description.slice(0, 60) + '...' : product.description}
          </p>
          <p className="product-card__price">${product.price.toFixed(2)}</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn--primary btn--full"
              onClick={handleAdd}
              style={{ background: added ? '#16a34a' : undefined }}
            >
              {added ? 'Added!' : 'Add to Cart'}
            </button>
            <button
              onClick={() => setShowModal(true)}
              style={{ padding: '8px 12px', border: '1.5px solid #4f46e5', borderRadius: '8px', background: '#fff', color: '#4f46e5', cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}
            >
              Quick View
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <QuickViewModal
          product={product}
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '680px', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' },
  close: { position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' },
  modalGrid: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
  modalImg: { width: '240px', height: '240px', objectFit: 'cover', borderRadius: '12px', flex: '0 0 auto' },
  modalInfo: { flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' },
  modalCategory: { fontSize: '12px', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '1px' },
  modalName: { fontSize: '22px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
  modalReviews: { fontSize: '13px', color: '#888', margin: 0 },
  modalDesc: { fontSize: '14px', color: '#555', lineHeight: '1.7', margin: 0 },
  modalPrice: { fontSize: '24px', fontWeight: '700', color: '#4f46e5', margin: 0 },
  addBtn: { padding: '12px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  viewBtn: { padding: '12px 20px', border: '1.5px solid #4f46e5', borderRadius: '8px', color: '#4f46e5', textDecoration: 'none', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center' },
};
