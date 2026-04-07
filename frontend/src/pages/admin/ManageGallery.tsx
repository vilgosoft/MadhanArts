import { useState, useEffect, useRef } from 'react';
import { galleryApi, categoryApi } from '../../services/api';
import type { GalleryItem, Category } from '../../types';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { resolveUploadUrl } from '../../utils/apiOrigin';

export default function ManageGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    Promise.all([
      galleryApi.list(),
      categoryApi.listAll(),
    ]).then(([galRes, catRes]) => {
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
        <button className="admin-page-header__btn" onClick={() => setShowModal(true)}>+ Upload Image</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {items.map((item) => (
          <div key={item.id} style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <img
              src={resolveUploadUrl(item.image_url)}
              alt={item.title || 'Gallery'}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '12px' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.title || 'Untitled'}</p>
              <p style={{ fontSize: '0.75rem', color: '#999' }}>{item.category_name}</p>
              <button
                className="delete"
                onClick={() => handleDelete(item.id)}
                style={{ marginTop: '8px', padding: '4px 12px', border: 'none', borderRadius: '4px', background: 'rgba(231,76,60,0.1)', color: '#e74c3c', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Delete
              </button>
            </div>
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
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="modal__field">
            <label>Image</label>
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
