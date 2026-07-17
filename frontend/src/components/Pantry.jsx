import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import './Pantry.css';

const CATEGORIES = ['Produce', 'Dairy', 'Meat', 'Grains', 'Snacks', 'Other'];

const EMPTY = {
  name: '',
  category: 'Produce',
  quantity: 1,
  expirationDate: '',
  notes: '',
};

// Days until expiration (used to flag items expiring soon).
function daysLeft(date) {
  if (!date) return null;
  return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
}

// Pantry page: add, list (sorted by expiration), edit and delete items.
function Pantry() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setItems(await api.get('/pantry?sort=expiration'));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function reset() {
    setForm(EMPTY);
    setEditId(null);
  }

  async function save(e) {
    e.preventDefault();
    if (editId) await api.put(`/pantry/${editId}`, form);
    else await api.post('/pantry', form);
    reset();
    load();
  }

  function edit(item) {
    setEditId(item._id);
    setForm({
      name: item.name,
      category: item.category || 'Other',
      quantity: item.quantity,
      expirationDate: item.expirationDate
        ? item.expirationDate.slice(0, 10)
        : '',
      notes: item.notes || '',
    });
  }

  async function remove(id) {
    await api.del(`/pantry/${id}`);
    load();
  }

  return (
    <section className="pantry-page">
      <h2 className="h4">Pantry</h2>
      <p className="text-muted small">
        Add what you have. Items expiring soonest show first.
      </p>

      <form onSubmit={save} className="mb-3">
        <div className="row g-2 mb-2">
          <div className="col-sm-4">
            <input
              className="form-control"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="col-sm-3">
            <select
              className="form-select"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-sm-2">
            <input
              className="form-control"
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </div>
          <div className="col-sm-3">
            <input
              className="form-control"
              type="date"
              value={form.expirationDate}
              onChange={(e) =>
                setForm({ ...form, expirationDate: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row g-2">
          <div className="col">
            <input
              className="form-control"
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-success" type="submit">
              {editId ? 'Save' : 'Add'}
            </button>
          </div>
          {editId && (
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={reset}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>

      {error && <p className="text-danger">{error}</p>}

      <ul className="list-group">
        {items.map((item) => {
          const d = daysLeft(item.expirationDate);
          return (
            <li
              key={item._id}
              className="list-group-item d-flex align-items-center gap-2 flex-wrap"
            >
              <span className="fw-semibold">{item.name}</span>
              <span className="badge text-bg-success">{item.category}</span>
              <span className={d !== null && d <= 3 ? 'pantry-soon' : ''}>
                {item.expirationDate
                  ? new Date(item.expirationDate).toLocaleDateString()
                  : 'No date'}
              </span>
              <span className="ms-auto text-muted small">
                Qty: {item.quantity}
              </span>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => edit(item)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => remove(item._id)}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Pantry;
