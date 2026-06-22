import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.col}>
          <h3 style={styles.brand}>ShopEase India</h3>
          <p style={styles.tagline}>Your one-stop shop for everything you need, delivered to your door.</p>
        </div>
        <div style={styles.col}>
          <h4 style={styles.heading}>Quick Links</h4>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/cart" style={styles.link}>Cart</Link>
          <Link to="/checkout" style={styles.link}>Checkout</Link>
          <Link to="/contact" style={styles.link}>Contact Us</Link>
        </div>
        <div style={styles.col}>
          <h4 style={styles.heading}>Contact Us</h4>
          <p style={styles.info}>ShopEase India Pvt. Ltd.</p>
          <p style={styles.info}>45, MG Road, Bengaluru</p>
          <p style={styles.info}>Karnataka - 560001</p>
          <p style={styles.info}>India</p>
          <a href="mailto:vishnugongadi02@gmail.com" style={styles.link}>vishnugongadi02@gmail.com</a>
          <a href="tel:+919392637131" style={styles.link}>+91 9392637131</a>
        </div>
      </div>
      <div style={styles.bottom}>
        <p style={styles.copy}>© 2026 ShopEase India Pvt. Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: '#1a1a2e', color: '#ccc', marginTop: '60px' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '48px 24px', display: 'flex', gap: '40px', flexWrap: 'wrap' },
  col: { flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' },
  brand: { color: '#fff', fontSize: '20px', fontWeight: '700', margin: '0 0 8px' },
  tagline: { fontSize: '14px', color: '#aaa', lineHeight: '1.6' },
  heading: { color: '#fff', fontSize: '15px', fontWeight: '600', margin: '0 0 8px' },
  info: { fontSize: '14px', color: '#aaa', margin: 0 },
  link: { fontSize: '14px', color: '#a78bfa', textDecoration: 'none', display: 'block' },
  bottom: { borderTop: '1px solid #333', padding: '16px 24px', textAlign: 'center' },
  copy: { fontSize: '13px', color: '#666', margin: 0 },
};
