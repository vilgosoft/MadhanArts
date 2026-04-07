import { useNavigate } from 'react-router-dom';
import HomeCategoryCarousels from '../components/Home/HomeCategoryCarousels';
import HeroShowcase from '../components/Gallery/HeroShowcase';
import '../styles/components/_home.scss';

const FEATURES = [
  { icon: '\u270F\uFE0F', title: 'Pencil Sketch', desc: 'Timeless black & white portraits with fine graphite details', variant: 'gold' },
  { icon: '\uD83C\uDFA8', title: 'Color Pencil', desc: 'Vibrant, detailed artwork blending rich colors beautifully', variant: 'rose' },
  { icon: '\uD83D\uDDBC\uFE0F', title: 'Acrylic Painting', desc: 'Bold and vivid paintings with rich texture and depth', variant: 'teal' },
  { icon: '\u2728', title: 'Oil Painting', desc: 'Classic, luxurious portraits with museum-quality finish', variant: 'purple' },
];

const STEPS = [
  { num: 1, title: 'Choose Style', desc: 'Pick your preferred art style from our collection' },
  { num: 2, title: 'Upload Photo', desc: 'Share the reference photo you want transformed' },
  { num: 3, title: 'Select Size', desc: 'Choose your canvas size and see the price' },
  { num: 4, title: 'Get Artwork', desc: 'We create and deliver your handcrafted masterpiece' },
];

export default function HomePage() {
  const navigate = useNavigate();

  const scrollToGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="hero">
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="hero__blob hero__blob--3" />
        <div className="hero__grid" />

        <div className="hero__content">
          <div className="hero__text">
            <span className="hero__label">Handcrafted Art Studio</span>
            <h1 className="hero__title">
              Your Photos,{' '}
              <span className="highlight">Our Canvas</span>
            </h1>
            <p className="hero__subtitle">
              Transform your cherished memories into stunning hand-drawn portraits.
              From pencil sketches to oil paintings — every stroke tells your story.
            </p>
            <div className="hero__actions">
              <button type="button" className="hero__btn-primary" onClick={scrollToGallery}>
                View Gallery
              </button>
              <button type="button" className="hero__btn-secondary" onClick={() => navigate('/login')}>
                Get Started
              </button>
            </div>
          </div>

          <div className="hero__visual">
            <HeroShowcase />
          </div>
        </div>

        <div className="hero__scroll">
          <span className="hero__scroll-text">Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ─── Art Styles Section ─── */}
      <section className="features">
        <div className="container">
          <div className="section-title">
            <span className="section-label">What We Create</span>
            <h2>Art Styles We Offer</h2>
            <p>Choose from a variety of handcrafted art styles</p>
          </div>

          <div className="features__grid">
            {FEATURES.map((f) => (
              <div key={f.title} className={`feature-card feature-card--${f.variant}`}>
                <div className="feature-card__icon">{f.icon}</div>
                <div className="feature-card__title">{f.title}</div>
                <div className="feature-card__desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Category carousels (scroll target #gallery) ─── */}
      <HomeCategoryCarousels />

      {/* ─── How It Works ─── */}
      <section className="process">
        <div className="container">
          <div className="section-title">
            <span className="section-label">Simple Process</span>
            <h2>How It Works</h2>
            <p>Get your custom artwork in 4 easy steps</p>
          </div>

          <div className="process__steps">
            {STEPS.map((s) => (
              <div key={s.num} className="process-step">
                <div className="process-step__number">{s.num}</div>
                <div className="process-step__title">{s.title}</div>
                <div className="process-step__desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="cta-section">
        <div className="cta-section__blob cta-section__blob--1" />
        <div className="cta-section__blob cta-section__blob--2" />
        <div className="cta-section__content">
          <div className="cta-section__tagline">&quot;Every portrait is a story&quot;</div>
          <h2>Ready to Get Your Portrait?</h2>
          <p>
            Choose your favorite art style and let us transform your precious memories
            into timeless handcrafted masterpieces.
          </p>
          <button type="button" className="cta-section__btn" onClick={() => navigate('/gallery')}>
            Start Your Commission
          </button>
        </div>
      </section>
    </>
  );
}
