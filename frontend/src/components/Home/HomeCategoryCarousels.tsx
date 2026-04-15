import { useState, useEffect, useRef, useMemo } from 'react';
import { useCategoryCarouselLayout } from '../../hooks/useCategoryCarouselLayout';
import { useNavigate } from 'react-router-dom';
import Slider from '../../utils/reactSlickSlider';
import { useAuth } from '../../context/AuthContext';
import { categoryApi, galleryApi, pricingApi } from '../../services/api';
import type { Category, GalleryItem } from '../../types';
import { resolveUploadUrl } from '../../utils/apiOrigin';
import Loader from '../common/Loader';
import 'slick-carousel/slick/slick.css';
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

const AUTO_SCROLL_MS = 4000;

/** Common DB typo — display-only fix */
function displayCategoryName(name: string): string {
  return name.replace(/\bPotrait\b/gi, 'Portrait');
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
  const { user } = useAuth();
  const sliderRef = useRef<InstanceType<typeof Slider> | null>(null);
  const lightboxRef = useRef<InstanceType<typeof Slider> | null>(null);
  const layout = useCategoryCarouselLayout(items.length, AUTO_SCROLL_MS);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const goOrder = () => {
    const orderPath = `/order/${category.id}`;
    if (!user) {
      navigate('/login', { state: { returnTo: orderPath } });
      return;
    }
    navigate(orderPath);
  };

  const sliderSettings = useMemo(
    () => ({
      dots: false,
      infinite: items.length > 1,
      speed: 450,
      cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
      slidesToShow: layout.slidesToShow,
      slidesToScroll: layout.slidesToScroll,
      autoplay: layout.autoplay,
      autoplaySpeed: layout.autoplaySpeed,
      arrows: false,
      swipe: true,
      touchMove: true,
      touchThreshold: 5,
      pauseOnHover: true,
    }),
    [
      items.length,
      layout.slidesToShow,
      layout.slidesToScroll,
      layout.autoplay,
      layout.autoplaySpeed,
      layout.layoutKey,
    ]
  );

  const lightboxSettings = useMemo(
    () => ({
      dots: false,
      infinite: items.length > 1,
      speed: 350,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      swipe: true,
      touchMove: true,
      adaptiveHeight: true,
    }),
    [items.length]
  );

  const closePreview = () => setPreviewIndex(null);

  return (
    <section className="category-carousel-section" aria-labelledby={`cat-head-${category.id}`}>
      <div className="container">
        <div className="category-carousel-section__head">
          <div>
            <h2 className="category-carousel-section__title" id={`cat-head-${category.id}`}>
              {displayCategoryName(category.name)}
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
            <div className="category-carousel__frame">
              <button
                type="button"
                className="category-carousel__nav category-carousel__nav--prev"
                aria-label="Previous slide"
                disabled={items.length <= 1}
                onClick={() => sliderRef.current?.slickPrev()}
              >
                &#8249;
              </button>
              <div className="category-carousel__slick-wrap">
                <Slider
                  key={`${category.id}-${layout.layoutKey}`}
                  ref={sliderRef}
                  className="category-carousel__slider"
                  {...sliderSettings}
                >
                  {items.map((item, idx) => (
                    <div key={item.id} className="category-carousel__slide">
                      <article className="category-carousel__card" role="listitem">
                        <button
                          type="button"
                          className="category-carousel__image-link"
                          onClick={() => setPreviewIndex(idx)}
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
                    </div>
                  ))}
                </Slider>
              </div>
              <button
                type="button"
                className="category-carousel__nav category-carousel__nav--next"
                aria-label="Next slide"
                disabled={items.length <= 1}
                onClick={() => sliderRef.current?.slickNext()}
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
      {previewIndex !== null && items[previewIndex] ? (
        <div className="home-lightbox" onClick={closePreview}>
          <button type="button" className="home-lightbox__close" onClick={closePreview}>
            &#10005;
          </button>
          {items.length > 1 ? (
            <>
              <button
                type="button"
                className="home-lightbox__nav home-lightbox__nav--prev"
                aria-label="Previous artwork"
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxRef.current?.slickPrev();
                }}
              >
                &#8249;
              </button>
              <button
                type="button"
                className="home-lightbox__nav home-lightbox__nav--next"
                aria-label="Next artwork"
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxRef.current?.slickNext();
                }}
              >
                &#8250;
              </button>
            </>
          ) : null}
          <div className="home-lightbox__content" onClick={(e) => e.stopPropagation()}>
            <Slider
              key={`${category.id}-${previewIndex}`}
              ref={lightboxRef}
              className="home-lightbox__slider"
              initialSlide={previewIndex}
              {...lightboxSettings}
            >
              {items.map((item) => (
                <div key={item.id} className="home-lightbox__slide">
                  <img src={resolveUploadUrl(item.image_url)} alt={item.title || category.name} />
                  <div className="home-lightbox__info">
                    <h3>{item.title || displayCategoryName(category.name)}</h3>
                    {minPrice ? (
                      <p className="home-lightbox__price">{formatFromPrice(minPrice.min, minPrice.currency)}</p>
                    ) : null}
                    <button type="button" className="home-lightbox__order-btn" onClick={goOrder}>
                      Order This Style
                    </button>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      ) : null}
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
