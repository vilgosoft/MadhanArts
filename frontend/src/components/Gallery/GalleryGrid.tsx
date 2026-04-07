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
    categoryApi.list().then((res) => setCategories(res.data.data));
    galleryApi.list().then((res) => {
      setItems(res.data.data);
      setLoading(false);
    });
  }, []);

  const filtered = activeCategory
    ? items.filter((item) => item.category_id === activeCategory)
    : items;

  if (loading) return <Loader />;

  return (
    <section className="gallery-section">
      <div className="container">
        <div className="section-title">
          <h2>Our Portfolio</h2>
          <p>Each artwork is crafted with passion and precision</p>
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
          <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
            No artworks found in this category.
          </p>
        )}
      </div>
    </section>
  );
}
