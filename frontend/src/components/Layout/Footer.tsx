export default function Footer() {
  return (
    <footer
      style={{
        background: '#2c2c2c',
        color: '#999',
        textAlign: 'center',
        padding: '32px 24px',
        fontSize: '0.85rem',
      }}
    >
      <p style={{ color: '#c9a96e', fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', marginBottom: '8px' }}>
        Madhan Arts
      </p>
      <p>&copy; {new Date().getFullYear()} Madhan Arts. All rights reserved.</p>
    </footer>
  );
}
