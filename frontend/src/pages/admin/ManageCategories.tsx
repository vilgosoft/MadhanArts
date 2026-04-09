import { useState, useEffect } from 'react';
import { categoryApi } from '../../services/api';
import type { Category } from '../../types';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '', sort_order: 0 });

  const load = () => {
    categoryApi.listAll().then((res) => {
      setCategories(res.data.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', sort_order: 0 });
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || '', sort_order: cat.sort_order });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editing) {
      await categoryApi.update(editing.id, form);
    } else {
      await categoryApi.create(form);
    }
    setShowModal(false);
    load();
  };

  const handleDelete = async (id: number) => {
    await categoryApi.delete(id);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Categories</h1>
        <button className="admin-page-header__btn" onClick={openCreate}>+ Add Category</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Order</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td data-label="Name"><strong>{cat.name}</strong></td>
              <td data-label="Slug">{cat.slug}</td>
              <td data-label="Order">{cat.sort_order}</td>
              <td data-label="Status">
                <span className={`status-badge ${cat.is_active ? 'status-badge--paid' : 'status-badge--cancelled'}`}>
                  {cat.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td data-label="Actions">
                <div className="admin-table__actions">
                  <button className="edit" onClick={() => openEdit(cat)}>Edit</button>
                  <button className="delete" onClick={() => setDeleteTarget(cat)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <Modal title={editing ? 'Edit Category' : 'Add Category'} onClose={() => setShowModal(false)}>
          <div className="modal__field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="modal__field">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="modal__field">
            <label>Sort Order</label>
            <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
          </div>
          <div className="modal__actions">
            <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Category"
          message={`Delete "${deleteTarget.name}"? All gallery items and pricing rules in this category will also be deleted.`}
          confirmText="Delete"
          danger
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await handleDelete(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
}
