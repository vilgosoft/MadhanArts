import GalleryGrid from '../components/Gallery/GalleryGrid';
import '../styles/components/_gallery.scss';

/**
 * Standalone gallery — not the home page. Distinct hero + full portfolio grid.
 */
export default function GalleryPage() {
  return (
    <div className="gallery-page">
      <header className="gallery-page__hero">
        <div className="gallery-page__hero-inner">
          <p className="gallery-page__eyebrow">Portfolio</p>
          <h1 className="gallery-page__title">Gallery</h1>
          <p className="gallery-page__lead">
            Explore our handcrafted portraits and commissions. Filter by style, then order your own piece.
          </p>
        </div>
      </header>

      <GalleryGrid />
    </div>
  );
}
