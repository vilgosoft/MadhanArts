import type { GalleryItem } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { resolveUploadUrl } from '../../utils/apiOrigin';
import '../../styles/components/_gallery.scss';

interface Props {
  item: GalleryItem;
  onPreview: () => void;
  fromPrice?: string | null;
}

export default function GalleryCard({ item, onPreview, fromPrice = null }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const imageUrl = resolveUploadUrl(item.image_url);

  const goOrder = () => {
    const orderPath = `/order/${item.category_id}`;
    if (!user) {
      navigate('/login', { state: { returnTo: orderPath } });
      return;
    }
    navigate(orderPath);
  };

  const openLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview();
  };

  return (
    <>
      <div className="gallery-card">
        <div className="gallery-card__image-wrapper" onClick={openLightbox}>
          <img
            className="gallery-card__image"
            src={imageUrl}
            alt={item.title || 'Artwork by Madhan Arts'}
            loading="lazy"
          />
          {/* Desktop hover overlay */}
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
                  goOrder();
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
          {fromPrice ? <p className="gallery-card__price">{fromPrice}</p> : null}
        </div>
        {/* Mobile order button */}
        <button
          type="button"
          className="gallery-card__order-btn"
          onClick={goOrder}
        >
          Order This Style
        </button>
      </div>

    </>
  );
}
