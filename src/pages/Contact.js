import React from 'react';

export default function Contact() {
  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Contact Us</h1>
        <p style={styles.subtitle}>We would love to hear from you. Reach out to us anytime.</p>

        <div style={styles.grid}>
          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>Our Office</h3>
            <p style={styles.infoText}>ShopEase India Pvt. Ltd.</p>
            <p style={styles.infoText}>45, MG Road</p>
            <p style={styles.infoText}>Bengaluru, Karnataka - 560001</p>
            <p style={styles.infoText}>India</p>
          </div>

          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>Get In Touch</h3>
            <p style={styles.infoText}>
              <span style={styles.icon}>Email:</span>
              <a href="mailto:vishnugongadi02@gmail.com" style={styles.link}>vishnugongadi02@gmail.com</a>
            </p>
            <p style={styles.infoText}>
              <span style={styles.icon}>Phone:</span>
              <a href="tel:+919392637131" style={styles.link}>+91 9392637131</a>
            </p>
            <p style={styles.infoText}>
              <span style={styles.icon}>Hours:</span> Mon - Sat, 9am - 6pm IST
            </p>
          </div>

          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>Send a Message</h3>
            <input style={styles.input} type="text" placeholder="Your Name" />
            <input style={styles.input} type="email" placeholder="Your Email" />
            <textarea style={styles.textarea} placeholder="Your Message" rows={4} />
            <button style={styles.btn}>Send Message</button>
          </div>
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: '80vh', background: '#f5f5f5', padding: '48px 24px' },
  card: { maxWidth: '1000px', margin: '0 auto', background: '#fff', borderRadius: '16px', padding: '48px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  title: { fontSize: '32px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 8px' },
  subtitle: { color: '#666', fontSize: '16px', margin: '0 0 40px' },
  grid: { display: 'flex', gap: '32px', flexWrap: 'wrap' },
  infoBox: { flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '10px' },
  infoTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 8px', borderBottom: '2px solid #4f46e5', paddingBottom: '6px' },
  infoText: { fontSize: '14px', color: '#555', margin: 0, lineHeight: '1.7' },
  icon: { fontWeight: '600', color: '#4f46e5', marginRight: '6px' },
  link: { color: '#4f46e5', textDecoration: 'none', fontSize: '14px' },
  input: { padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  textarea: { padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical' },
  btn: { padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
};
