import { useState, useEffect } from 'react';
import axios from 'axios';
import { userApi } from '../../services/api';
import type { UserListRow } from '../../types';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';

export default function ManageUsers() {
  const [users, setUsers] = useState<UserListRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<UserListRow | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = (p = page) => {
    setLoading(true);
    userApi.list(p, 20).then((res) => {
      const data = res.data.data;
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
      setLoading(false);
    });
  };

  useEffect(() => {
    load(1);
    setPage(1);
  }, []);

  const openEdit = (u: UserListRow) => {
    setEditUser(u);
    setName(u.name);
    setEmail(u.email || '');
    setPhone(u.phone || '');
    setSaveError('');
  };

  const closeEdit = () => {
    setEditUser(null);
    setSaveError('');
  };

  const handleSave = async () => {
    if (!editUser) return;
    setSaving(true);
    setSaveError('');
    try {
      await userApi.update(editUser.id, {
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      closeEdit();
      load(page);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data && typeof err.response.data === 'object') {
        const d = err.response.data as { message?: string; error?: string };
        setSaveError(d.message || d.error || 'Could not save');
      } else {
        setSaveError('Could not save');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Users ({total})</h1>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td data-label="ID">{u.id}</td>
                  <td data-label="Name"><strong>{u.name}</strong></td>
                  <td data-label="Email">{u.email || '—'}</td>
                  <td data-label="Phone">{u.phone || '—'}</td>
                  <td data-label="Registered" style={{ fontSize: '0.85rem', color: '#999' }}>
                    {new Date(u.created_at).toLocaleString('en-IN')}
                  </td>
                  <td data-label="Actions">
                    <button
                      type="button"
                      onClick={() => openEdit(u)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: '1px solid #c9a96e',
                        background: 'rgba(201,169,110,0.12)',
                        color: '#8a7349',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p style={{ color: '#999', marginTop: '16px' }}>No registered customers yet.</p>
          )}

          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPage(p);
                    load(p);
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '4px',
                    border: p === page ? '2px solid #c9a96e' : '1px solid #e8e4df',
                    background: p === page ? 'rgba(201,169,110,0.1)' : '#fff',
                    cursor: 'pointer',
                    fontWeight: p === page ? 600 : 400,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {editUser && (
        <Modal title={`Edit user #${editUser.id}`} onClose={closeEdit}>
          <div className="modal__field">
            <label>Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="modal__field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="modal__field">
            <label>Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '12px' }}>
            At least one of email or phone must be filled.
          </p>
          {saveError && (
            <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '12px' }}>{saveError}</p>
          )}
          <div className="modal__actions">
            <button type="button" className="btn-cancel" onClick={closeEdit}>Cancel</button>
            <button type="button" className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
