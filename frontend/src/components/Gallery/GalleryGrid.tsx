import { useState, useEffect } from 'react';
import type { Category, GalleryItem } from '../../types';
import { categoryApi, galleryApi } from '../../services/api';
import CategoryFilter from './CategoryFilter';
import GalleryCard from './GalleryCard';
import Loader from '../common/Loader';
import '../../styles/components/_gallery.scss';

export default function GalleryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([categoryApi.list(), galleryApi.list()]).then(([catRes, galRes]) => {
      setCategories(catRes.data.data);
      setItems(galRes.data.data);
      setLoading(false);
    });
  }, []);

  const filtered = activeCategory
    ? items.filter((item) => item.category_id === activeCategory)
    : items;

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
          {filtered.map((item) => (
            <GalleryCard key={item.id} item={item} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="gallery-empty">
            <div className="gallery-empty__icon">&#127912;</div>
            <p>No artworks found in this category yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
