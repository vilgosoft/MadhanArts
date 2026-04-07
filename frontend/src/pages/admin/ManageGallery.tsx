import { useState, useEffect, useRef } from 'react';
import { galleryApi, categoryApi } from '../../services/api';
import type { GalleryItem, Category } from '../../types';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { resolveUploadUrl } from '../../utils/apiOrigin';
import '../../styles/components/_admin.scss';

export default function ManageGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editSortOrder, setEditSortOrder] = useState(0);
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
    setShowUploadModal(false);
    setTitle('');
    setCategoryId('');
    load();
  };

  const openEdit = (item: GalleryItem) => {
    setEditItem(item);
    setEditTitle(item.title || '');
    setEditCategoryId(String(item.category_id));
    setEditSortOrder(item.sort_order);
    setShowEditModal(true);
  };

  const handleEdit = async () => {
    if (!editItem) return;
    await galleryApi.update(editItem.id, {
      title: editTitle || undefined,
      category_id: Number(editCategoryId),
      sort_order: editSortOrder,
    });
    setShowEditModal(false);
    setEditItem(null);
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
        <button type="button" className="admin-page-header__btn" onClick={() => setShowUploadModal(true)}>
          + Upload Image
        </button>
      </div>

      <div className="admin-gallery-grid">
        {items.map((item) => (
          <div key={item.id} className="admin-gallery-card">
            <div className="admin-gallery-card__image-wrapper">
              <img
                className="admin-gallery-card__image"
                src={resolveUploadUrl(item.image_url)}
                alt={item.title || 'Gallery'}
              />
            </div>
            <div className="admin-gallery-card__info">
              <div className="admin-gallery-card__info-title">{item.title || 'Untitled'}</div>
              <div className="admin-gallery-card__info-category">{item.category_name}</div>
            </div>
            <div className="admin-gallery-card__actions">
              <button type="button" className="admin-gallery-card__edit" onClick={() => openEdit(item)}>
                Edit
              </button>
              <button type="button" className="admin-gallery-card__delete" onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <Modal title="Upload Gallery Image" onClose={() => setShowUploadModal(false)}>
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
            <button type="button" className="btn-cancel" onClick={() => setShowUploadModal(false)}>Cancel</button>
            <button type="button" className="btn-save" onClick={handleUpload}>Upload</button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && editItem && (
        <Modal title="Edit Gallery Item" onClose={() => setShowEditModal(false)}>
          <div className="modal__field">
            <label>Preview</label>
            <img
              src={resolveUploadUrl(editItem.image_url)}
              alt="Preview"
              style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
            />
          </div>
          <div className="modal__field">
            <label>Title</label>
            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Enter a title" />
          </div>
          <div className="modal__field">
            <label>Category</label>
            <select value={editCategoryId} onChange={(e) => setEditCategoryId(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="modal__field">
            <label>Sort Order</label>
            <input type="number" value={editSortOrder} onChange={(e) => setEditSortOrder(Number(e.target.value))} />
          </div>
          <div className="modal__actions">
            <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="btn-save" onClick={handleEdit}>Save Changes</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
