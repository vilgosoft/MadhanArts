import type { Category } from '../../types';
import '../../styles/components/_gallery.scss';

interface Props {
  categories: Category[];
  activeId: number | null;
  onSelect: (id: number | null) => void;
}

export default function CategoryFilter({ categories, activeId, onSelect }: Props) {
  return (
    <div className="category-filter">
      <button
        className={`category-filter__tab ${activeId === null ? 'category-filter__tab--active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`category-filter__tab ${activeId === cat.id ? 'category-filter__tab--active' : ''}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
