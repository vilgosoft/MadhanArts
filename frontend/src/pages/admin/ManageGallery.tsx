import { useState, useEffect, useRef } from 'react';
import { galleryApi, categoryApi } from '../../services/api';
import type { GalleryItem, Category } from '../../types';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import '../../styles/components/_admin.scss';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ManageGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    Promise.all([galleryApi.list(), categoryApi.listAll()]).then(([galRes, catRes]) => {
      setItems(galRes.data.data);
      setCategories(catRes.data.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file || !categoryId) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category_id', categoryId);
    if (title) formData.append('title', title);

    await galleryApi.upload(formData);
    setShowModal(false);
    setTitle('');
    setCategoryId('');
    load();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this gallery image?')) {
      await galleryApi.delete(id);
      load();
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Gallery</h1>
        <button className="admin-page-header__btn" onClick={() => setShowModal(true)}>
          + Upload Image
        </button>
      </div>

      <div className="admin-gallery-grid">
        {items.map((item) => (
          <div key={item.id} className="admin-gallery-card">
            <div className="admin-gallery-card__image-wrapper">
              <img
                className="admin-gallery-card__image"
                src={item.image_url.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`}
                alt={item.title || 'Gallery'}
              />
            </div>
            <div className="admin-gallery-card__info">
              <div className="admin-gallery-card__info-title">{item.title || 'Untitled'}</div>
              <div className="admin-gallery-card__info-category">{item.category_name}</div>
            </div>
            <button className="admin-gallery-card__delete" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title="Upload Gallery Image" onClose={() => setShowModal(false)}>
          <div className="modal__field">
            <label>Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="modal__field">
            <label>Title (optional)</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Portrait of a girl" />
          </div>
          <div className="modal__field">
            <label>Image File</label>
            <input type="file" ref={fileRef} accept="image/*" />
          </div>
          <div className="modal__actions">
            <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn-save" onClick={handleUpload}>Upload</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
