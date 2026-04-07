import type { GalleryItem } from '../../types';
import { useNavigate } from 'react-router-dom';
import { resolveUploadUrl } from '../../utils/apiOrigin';
import '../../styles/components/_gallery.scss';

interface Props {
  item: GalleryItem;
}

export default function GalleryCard({ item }: Props) {
  const navigate = useNavigate();
  const imageUrl = resolveUploadUrl(item.image_url);

  return (
    <div className="gallery-card">
      <div className="gallery-card__image-wrapper">
        <img
          className="gallery-card__image"
          src={imageUrl}
          alt={item.title || 'Gallery image'}
          loading="lazy"
        />
        <div className="gallery-card__overlay">
          <button
            className="gallery-card__overlay-btn"
            onClick={() => navigate(`/order/${item.category_id}`)}
          >
            Order Now
          </button>
        </div>
      </div>
      <div className="gallery-card__info">
        {item.title && <h3>{item.title}</h3>}
        <span>{item.category_name}</span>
      </div>
    </div>
  );
}
