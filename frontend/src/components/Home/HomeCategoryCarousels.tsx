import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryApi, galleryApi, pricingApi } from '../../services/api';
import type { Category, GalleryItem } from '../../types';
import { resolveUploadUrl } from '../../utils/apiOrigin';
import Loader from '../common/Loader';
import '../../styles/components/_home-category-carousels.scss';

const CAROUSEL_LIMIT = 4;

type CategoryMinPrice = { min: number; currency: string };

function formatFromPrice(min: number, currency: string): string {
  const n = min.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  if (currency === 'INR') {
    return `From ₹${n}`;
  }
  return `From ${currency} ${n}`;
}

function CategoryCarousel({
  category,
  items,
  minPrice,
}: {
  category: Category;
  items: GalleryItem[];
  minPrice: CategoryMinPrice | null;
}) {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const goOrder = () => navigate(`/order/${category.id}`);

  const updateNav = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 6);
    setCanNext(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateNav();
    el.addEventListener('scroll', updateNav, { passive: true });
    const ro = new ResizeObserver(updateNav);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateNav);
      ro.disconnect();
    };
  }, [items, updateNav]);

  const scrollByDir = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.category-carousel__card');
    const step = (card?.offsetWidth ?? 280) + 18;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className="category-carousel-section" aria-labelledby={`cat-head-${category.id}`}>
      <div className="container">
        <div className="category-carousel-section__head">
          <div>
            <h2 className="category-carousel-section__title" id={`cat-head-${category.id}`}>
              {category.name}
            </h2>
            {category.description ? (
              <p className="category-carousel-section__desc">{category.description}</p>
            ) : null}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="category-carousel__empty">
            <p>Artwork coming soon in this category.</p>
            {minPrice ? (
              <p className="category-carousel__empty-price">{formatFromPrice(minPrice.min, minPrice.currency)}</p>
            ) : null}
            <button type="button" className="category-carousel__card-order category-carousel__card-order--standalone" onClick={goOrder}>
              Order this style
            </button>
          </div>
        ) : (
          <div className="category-carousel">
            <div className="category-carousel__row">
              <button
                type="button"
                className="category-carousel__nav"
                aria-label="Scroll left"
                disabled={!canPrev}
                onClick={() => scrollByDir(-1)}
              >
                &#8249;
              </button>
              <div ref={trackRef} className="category-carousel__track" role="list">
                {items.map((item) => (
                  <article key={item.id} className="category-carousel__card" role="listitem">
                    <button
                      type="button"
                      className="category-carousel__image-link"
                      onClick={goOrder}
                      aria-label={item.title ? `View order options: ${item.title}` : 'View order options'}
                    >
                      <img
                        className="category-carousel__image"
                        src={resolveUploadUrl(item.image_url)}
                        alt={item.title || category.name}
                        loading="lazy"
                      />
                    </button>
                    <div className="category-carousel__meta">
                      {item.title ? <h3 className="category-carousel__item-title">{item.title}</h3> : null}
                      {minPrice ? (
                        <p className="category-carousel__from">{formatFromPrice(minPrice.min, minPrice.currency)}</p>
                      ) : null}
                      <button type="button" className="category-carousel__card-order" onClick={goOrder}>
                        Order this style
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="category-carousel__nav"
                aria-label="Scroll right"
                disabled={!canNext}
                onClick={() => scrollByDir(1)}
              >
                &#8250;
              </button>
            </div>

            <div className="category-carousel__footer">
              <button
                type="button"
                className="category-carousel__full-gallery"
                onClick={() => navigate('/gallery')}
              >
                View Full Gallery &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function HomeCategoryCarousels() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [byCategory, setByCategory] = useState<Map<number, GalleryItem[]>>(new Map());
  const [minPrices, setMinPrices] = useState<Map<number, CategoryMinPrice>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([categoryApi.list(), galleryApi.list()])
      .then(async ([catRes, galRes]) => {
        if (cancelled) return;
        const cats = [...catRes.data.data].sort((a, b) => a.sort_order - b.sort_order);
        const items = galRes.data.data.filter((i) => Number(i.is_active) === 1);
        const map = new Map<number, GalleryItem[]>();
        for (const i of items) {
          const list = map.get(i.category_id) ?? [];
          list.push(i);
          map.set(i.category_id, list);
        }
        for (const [k, list] of map) {
          list.sort((a, b) => a.sort_order - b.sort_order || b.id - a.id);
          map.set(k, list.slice(0, CAROUSEL_LIMIT));
        }

        const priceMap = new Map<number, CategoryMinPrice>();
        await Promise.all(
          cats.map((c) =>
            pricingApi
              .byCategory(c.id)
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
        setCategories(cats);
        setByCategory(map);
        setMinPrices(priceMap);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="home-category-carousels" aria-busy="true">
        <div className="container home-category-carousels__loader-wrap">
          <Loader />
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="home-category-carousels" id="gallery" aria-label="Artwork by category">
      <div className="container">
        <div className="home-category-carousels__intro">
          <h2>Explore by category</h2>
          <p>
            Up to four highlights per style — each card shows our best price for that category. Swipe or use the arrows
            to browse.
          </p>
        </div>
      </div>

      {categories.map((cat) => (
        <CategoryCarousel
          key={cat.id}
          category={cat}
          items={byCategory.get(cat.id) ?? []}
          minPrice={minPrices.get(cat.id) ?? null}
        />
      ))}
    </section>
  );
}
