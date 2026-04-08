import { useState, useEffect, useCallback } from 'react';
import { galleryApi } from '../../services/api';
import { resolveUploadUrl } from '../../utils/apiOrigin';
import type { GalleryItem } from '../../types';
import '../../styles/components/_hero-showcase.scss';

const PLACEHOLDER_IMAGES = [
  { id: 1, title: 'Pencil Sketch', category_name: 'Pencil Portrait', image_url: '' },
  { id: 2, title: 'Oil Painting', category_name: 'Oil Portrait', image_url: '' },
  { id: 3, title: 'Color Pencil', category_name: 'Color Portrait', image_url: '' },
  { id: 4, title: 'Acrylic Art', category_name: 'Acrylic Portrait', image_url: '' },
];

const AUTO_SLIDE_MS = 3000;

export default function HeroShowcase() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    galleryApi.list().then((res) => {
      const data = res.data.data;
      if (data.length > 0) setItems(data.slice(0, 4));
    }).catch(() => {});
  }, []);

  const showcase = items.length > 0 ? items : PLACEHOLDER_IMAGES as unknown as GalleryItem[];

  // Auto-carousel for mobile
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % showcase.length);
  }, [showcase.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const getImageUrl = (item: GalleryItem) => {
    if (!item.image_url) return '';
    return resolveUploadUrl(item.image_url);
  };

  return (
    <div className="hero-showcase">
      {/* ── Mobile: single auto-carousel ── */}
      <div className="hero-showcase__carousel">
        {showcase.map((item, i) => (
          <div
            key={item.id}
            className={`hero-showcase__slide ${i === activeIndex ? 'hero-showcase__slide--active' : ''}`}
          >
            {getImageUrl(item) ? (
              <img src={getImageUrl(item)} alt={item.title || 'Artwork'} />
            ) : (
              <div className="hero-showcase__placeholder">
                <span>&#127912;</span>
              </div>
            )}
            <div className="hero-showcase__label">
              <span className="hero-showcase__label-tag">Featured</span>
              <span className="hero-showcase__label-title">{item.title || item.category_name}</span>
            </div>
          </div>
        ))}
        <div className="hero-showcase__dots">
          {showcase.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`hero-showcase__dot ${i === activeIndex ? 'hero-showcase__dot--active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Desktop: grid layout (main + stack) ── */}
      <div className="hero-showcase__main">
        {showcase[0] && (
          <div className="hero-showcase__card hero-showcase__card--main">
            {getImageUrl(showcase[0]) ? (
              <img src={getImageUrl(showcase[0])} alt={showcase[0].title || 'Featured artwork'} />
            ) : (
              <div className="hero-showcase__placeholder">
                <span>&#127912;</span>
              </div>
            )}
            <div className="hero-showcase__label">
              <span className="hero-showcase__label-tag">Featured</span>
              <span className="hero-showcase__label-title">{showcase[0].title || showcase[0].category_name}</span>
            </div>
          </div>
        )}
      </div>

      <div className="hero-showcase__stack">
        {showcase.slice(1, 4).map((item, i) => (
          <div
            key={item.id}
            className={`hero-showcase__card hero-showcase__card--small hero-showcase__card--delay-${i + 1}`}
          >
            {getImageUrl(item) ? (
              <img src={getImageUrl(item)} alt={item.title || 'Artwork'} />
            ) : (
              <div className="hero-showcase__placeholder hero-showcase__placeholder--small">
                <span>{['&#9998;', '&#127912;', '&#10024;'][i]}</span>
              </div>
            )}
            <div className="hero-showcase__label hero-showcase__label--small">
              <span className="hero-showcase__label-title">{item.title || item.category_name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative elements */}
      <div className="hero-showcase__brush hero-showcase__brush--1" />
      <div className="hero-showcase__brush hero-showcase__brush--2" />
    </div>
  );
}
