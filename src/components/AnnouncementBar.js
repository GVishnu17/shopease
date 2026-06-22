import React from 'react';

const messages = [
  '🚚 Free shipping on orders above $50!',
  '🎉 New arrivals every week!',
  '💳 UPI & Card payments accepted!',
  '⭐ Rated #1 online shop in South India!',
  '📦 Easy returns within 30 days!',
  '🔒 100% Secure Checkout!',
];

export default function AnnouncementBar() {
  return (
    <div style={styles.bar}>
      <div style={styles.track}>
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} style={styles.item}>{msg}</span>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  bar: { background: '#4f46e5', color: '#fff', overflow: 'hidden', whiteSpace: 'nowrap', padding: '8px 0' },
  track: { display: 'inline-block', animation: 'scroll 25s linear infinite' },
  item: { display: 'inline-block', padding: '0 48px', fontSize: '13px', fontWeight: '500' },
};
