import { useState, useEffect } from 'react';
import { pricingApi, categoryApi, sizeApi } from '../../services/api';
import type { PricingRule, Category, Size } from '../../types';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function ManagePricing() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PricingRule | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PricingRule | null>(null);
  const [form, setForm] = useState({ category_id: '', size_id: '', price: '' });

  const load = () => {
    Promise.all([
      pricingApi.list(),
      categoryApi.listAll(),
      sizeApi.list(),
    ]).then(([priceRes, catRes, sizeRes]) => {
      setRules(priceRes.data.data);
      setCategories(catRes.data.data);
      setSizes(sizeRes.data.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ category_id: '', size_id: '', price: '' });
    setShowModal(true);
  };

  const openEdit = (rule: PricingRule) => {
    setEditing(rule);
    setForm({
      category_id: String(rule.category_id),
      size_id: String(rule.size_id),
      price: rule.price,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editing) {
      await pricingApi.update(editing.id, {
        category_id: Number(form.category_id),
        size_id: Number(form.size_id),
        price: form.price,
      });
    } else {
      await pricingApi.create({
        category_id: Number(form.category_id),
        size_id: Number(form.size_id),
        price: Number(form.price),
      });
    }
    setShowModal(false);
    load();
  };

  const handleDelete = async (id: number) => {
    await pricingApi.delete(id);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Pricing Rules</h1>
        <button className="admin-page-header__btn" onClick={openCreate}>+ Add Rule</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Size</th>
            <th>Price (INR)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id}>
              <td data-label="Category">{rule.category_name}</td>
              <td data-label="Size">{rule.size_label}</td>
              <td data-label="Price (INR)"><strong>₹{parseFloat(rule.price).toLocaleString('en-IN')}</strong></td>
              <td data-label="Actions">
                <div className="admin-table__actions">
                  <button className="edit" onClick={() => openEdit(rule)}>Edit</button>
                  <button className="delete" onClick={() => setDeleteTarget(rule)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <Modal title={editing ? 'Edit Price' : 'Add Pricing Rule'} onClose={() => setShowModal(false)}>
          <div className="modal__field">
            <label>Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            >
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="modal__field">
            <label>Size</label>
            <select
              value={form.size_id}
              onChange={(e) => setForm({ ...form, size_id: e.target.value })}
            >
              <option value="">Select size...</option>
              {sizes.map((s) => (
                <option key={s.id} value={s.id}>{s.label} — {s.description}</option>
              ))}
            </select>
          </div>
          <div className="modal__field">
            <label>Price (INR)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="e.g. 2500"
            />
          </div>
          <div className="modal__actions">
            <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Pricing Rule"
          message={`Delete price rule for "${deleteTarget.category_name}" - "${deleteTarget.size_label}"?`}
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
