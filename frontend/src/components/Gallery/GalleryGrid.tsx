import { useState, useEffect, useMemo, useRef } from 'react';
import type { Category, GalleryItem } from '../../types';
import { categoryApi, galleryApi, pricingApi } from '../../services/api';
import CategoryFilter from './CategoryFilter';
import GalleryCard from './GalleryCard';
import Loader from '../common/Loader';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { resolveUploadUrl } from '../../utils/apiOrigin';
import '../../styles/components/_gallery.scss';

export default function GalleryGrid() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [minPrices, setMinPrices] = useState<Map<number, { min: number; currency: string }>>(new Map());
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([categoryApi.list(), galleryApi.list()])
      .then(async ([catRes, galRes]) => {
        if (cancelled) return;
        const cats = catRes.data.data;
        setCategories(cats);
        setItems(galRes.data.data);

        const priceMap = new Map<number, { min: number; currency: string }>();
        await Promise.all(
          cats.map((c) =>
            pricingApi.byCategory(c.id)
              .then((res) => {
                if (cancelled) return;
                const rules = res.data.data.filter((r) => Number(r.is_active) === 1);
                if (rules.length === 0) return;
                const min = Math.min(...rules.map((r) => parseFloat(String(r.price))));
                const currency = rules[0].currency || 'INR';
                priceMap.set(c.id, { min, currency });
              })
              .catch(() => {})
          )
        );
        if (cancelled) return;
        setMinPrices(priceMap);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const formatFromPrice = (categoryId: number): string | null => {
    const p = minPrices.get(categoryId);
    if (!p) return null;
    const n = p.min.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    return p.currency === 'INR' ? `From ₹${n}` : `From ${p.currency} ${n}`;
  };

  const filtered = activeCategory
    ? items.filter((item) => item.category_id === activeCategory)
    : items;
  const activeItem = previewIndex === null ? null : filtered[previewIndex] ?? null;

  const goOrder = (item: GalleryItem) => {
    const orderPath = `/order/${item.category_id}`;
    if (!user) {
      navigate('/login', { state: { returnTo: orderPath } });
      return;
    }
    navigate(orderPath);
  };

  const closePreview = () => setPreviewIndex(null);
  const showPrev = useMemo(
    () => previewIndex !== null && filtered.length > 1,
    [previewIndex, filtered.length]
  );

  const moveBy = (dir: -1 | 1) => {
    if (previewIndex === null || filtered.length <= 1) return;
    const next = (previewIndex + dir + filtered.length) % filtered.length;
    setPreviewIndex(next);
  };

  useEffect(() => {
    if (previewIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePreview();
      if (e.key === 'ArrowLeft') moveBy(-1);
      if (e.key === 'ArrowRight') moveBy(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [previewIndex, filtered.length]);

  useEffect(() => {
    if (previewIndex === null) return;
    if (filtered.length === 0) {
      setPreviewIndex(null);
      return;
    }
    if (previewIndex >= filtered.length) {
      setPreviewIndex(filtered.length - 1);
    }
  }, [filtered.length, previewIndex]);

  if (loading) return <Loader />;

  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <div className="section-title">
          <span className="section-label">Our Portfolio</span>
          <h2>Handcrafted Masterpieces</h2>
          <p>Each artwork is crafted with passion, precision, and love for the art — use the filters to explore by style</p>
        </div>

        <CategoryFilter
          categories={categories}
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />

        <div className="gallery-grid">
          {filtered.map((item, idx) => (
            <GalleryCard
              key={item.id}
              item={item}
              onPreview={() => setPreviewIndex(idx)}
              fromPrice={formatFromPrice(item.category_id)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="gallery-empty">
            <div className="gallery-empty__icon">&#127912;</div>
            <p>No artworks found in this category yet. Check back soon!</p>
          </div>
        )}

        {activeItem && (
          <div className="lightbox" onClick={closePreview}>
            <button type="button" className="lightbox__close" onClick={closePreview}>
              &#10005;
            </button>
            {showPrev && (
              <>
                <button
                  type="button"
                  className="lightbox__nav lightbox__nav--prev"
                  aria-label="Previous artwork"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveBy(-1);
                  }}
                >
                  &#8249;
                </button>
                <button
                  type="button"
                  className="lightbox__nav lightbox__nav--next"
                  aria-label="Next artwork"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveBy(1);
                  }}
                >
                  &#8250;
                </button>
              </>
            )}
            <div
              className="lightbox__content"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => {
                touchStartX.current = e.changedTouches[0]?.clientX ?? null;
              }}
              onTouchEnd={(e) => {
                const start = touchStartX.current;
                const end = e.changedTouches[0]?.clientX ?? null;
                if (start === null || end === null) return;
                const delta = end - start;
                if (Math.abs(delta) < 40) return;
                if (delta > 0) moveBy(-1);
                else moveBy(1);
              }}
            >
              <img src={resolveUploadUrl(activeItem.image_url)} alt={activeItem.title || 'Artwork'} />
              <div className="lightbox__info">
                <h3>{activeItem.title || 'Untitled'}</h3>
                <span>{activeItem.category_name}</span>
                {formatFromPrice(activeItem.category_id) ? (
                  <p className="lightbox__price">{formatFromPrice(activeItem.category_id)}</p>
                ) : null}
                <button
                  type="button"
                  className="lightbox__order-btn"
                  onClick={() => {
                    closePreview();
                    goOrder(activeItem);
                  }}
                >
                  Order This Style
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
