import { useNavigate } from 'react-router-dom';
import HomeCategoryCarousels from '../components/Home/HomeCategoryCarousels';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)',
          color: '#fff',
          textAlign: 'center',
          padding: '100px 24px 80px',
        }}
      >
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            marginBottom: '16px',
            fontWeight: 700,
          }}
        >
          Handcrafted Art,{' '}
          <span style={{ color: '#c9a96e' }}>Made For You</span>
        </h1>
        <p
          style={{
            fontSize: '1.1rem',
            color: '#bbb',
            maxWidth: '560px',
            margin: '0 auto 32px',
            lineHeight: 1.7,
          }}
        >
          Transform your favorite photos into stunning hand-drawn portraits.
          From pencil sketches to oil paintings — every piece tells your story.
        </p>
        <button
          type="button"
          onClick={() => navigate('/gallery')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 36px',
            background: '#c9a96e',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
          }}
        >
          View Gallery
        </button>
      </section>

      <HomeCategoryCarousels />

      {/* CTA Section */}
      <section
        style={{
          background: '#c9a96e',
          color: '#fff',
          textAlign: 'center',
          padding: '64px 24px',
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem',
            marginBottom: '12px',
          }}
        >
          Ready to get your portrait?
        </h2>
        <p style={{ marginBottom: '24px', opacity: 0.9 }}>
          Choose a category and place your order in just 3 simple steps.
        </p>
        <button
          type="button"
          onClick={() => navigate('/gallery')}
          style={{
            padding: '12px 32px',
            background: '#2c2c2c',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
          }}
        >
          Browse categories
        </button>
      </section>
    </>
  );
}
