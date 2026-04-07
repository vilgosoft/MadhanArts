import { useState, useEffect } from 'react';
import { galleryApi } from '../../services/api';
import type { GalleryItem } from '../../types';
import '../../styles/components/_hero-showcase.scss';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const PLACEHOLDER_IMAGES = [
  { id: 1, title: 'Pencil Sketch', category_name: 'Pencil Portrait', image_url: '' },
  { id: 2, title: 'Oil Painting', category_name: 'Oil Portrait', image_url: '' },
  { id: 3, title: 'Color Pencil', category_name: 'Color Portrait', image_url: '' },
  { id: 4, title: 'Acrylic Art', category_name: 'Acrylic Portrait', image_url: '' },
];

export default function HeroShowcase() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    galleryApi.list().then((res) => {
      const data = res.data.data;
      if (data.length > 0) setItems(data.slice(0, 4));
    }).catch(() => {});
  }, []);

  const showcase = items.length > 0 ? items : PLACEHOLDER_IMAGES as unknown as GalleryItem[];

  const getImageUrl = (item: GalleryItem) => {
    if (!item.image_url) return '';
    return item.image_url.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`;
  };

  return (
    <div className="hero-showcase">
      {/* Main large image */}
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

      {/* Side stack of smaller images */}
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
