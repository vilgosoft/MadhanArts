import { useState } from 'react';
import type { GalleryItem } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { resolveUploadUrl } from '../../utils/apiOrigin';
import '../../styles/components/_gallery.scss';

interface Props {
  item: GalleryItem;
}

export default function GalleryCard({ item }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const imageUrl = resolveUploadUrl(item.image_url);
  const [lightbox, setLightbox] = useState(false);

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
    setLightbox(true);
  };

  const closeLightbox = () => setLightbox(false);

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

      {/* Lightbox popup */}
      {lightbox && (
        <div className="lightbox" onClick={closeLightbox}>
          <button type="button" className="lightbox__close" onClick={closeLightbox}>
            &#10005;
          </button>
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <img src={imageUrl} alt={item.title || 'Artwork'} />
            <div className="lightbox__info">
              <h3>{item.title || 'Untitled'}</h3>
              <span>{item.category_name}</span>
              <button
                type="button"
                className="lightbox__order-btn"
                onClick={() => {
                  closeLightbox();
                  goOrder();
                }}
              >
                Order This Style
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
