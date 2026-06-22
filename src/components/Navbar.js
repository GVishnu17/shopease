import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Logo() {
  return (
    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="10" fill="#4f46e5"/>
        <path d="M8 12h3l2 10h10l2-10h3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14" cy="25" r="1.5" fill="#fff"/>
        <circle cx="22" cy="25" r="1.5" fill="#fff"/>
        <path d="M11 15h14" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 18h12" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M13 21h10" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span style={{ fontSize: '20px', fontWeight: '800', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        ShopEase
      </span>
    </Link>
  );
}

export default function Navbar() {
  const { itemCount } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Logo />
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/contact" title="Contact Us" style={styles.icon}>📞</Link>
          <Link to="/login" title="Login / Sign Up" style={styles.icon}>👤</Link>
          <Link to="/cart" title="Cart" style={{ ...styles.icon, position: 'relative' }}>
            🛒
            {itemCount > 0 && <span className="navbar__cart-badge">{itemCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  icon: { fontSize: '22px', textDecoration: 'none' },
};
