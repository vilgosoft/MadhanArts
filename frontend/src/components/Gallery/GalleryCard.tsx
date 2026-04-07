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
    <div className="gallery-card" onClick={() => navigate(`/order/${item.category_id}`)}>
      <div className="gallery-card__image-wrapper">
        <img
          className="gallery-card__image"
          src={imageUrl}
          alt={item.title || 'Artwork by Madhan Arts'}
          loading="lazy"
        />
        <div className="gallery-card__overlay">
          <div className="gallery-card__overlay-content">
            {item.title && (
              <div className="gallery-card__overlay-title">{item.title}</div>
            )}
            <div className="gallery-card__overlay-category">{item.category_name}</div>
            <button
              className="gallery-card__overlay-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/order/${item.category_id}`);
              }}
            >
              Order This Style
            </button>
          </div>
        </div>
      </div>
      <div className="gallery-card__info">
        {item.title && <h3>{item.title}</h3>}
        <span>{item.category_name}</span>
      </div>
    </div>
  );
}
