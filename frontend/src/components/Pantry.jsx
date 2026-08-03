import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import PantryItem from './PantryItem';
import './Pantry.css';

const CATEGORIES = ['Produce', 'Dairy', 'Meat', 'Grains', 'Snacks', 'Other'];

const EMPTY = {
  name: '',
  category: 'Produce',
  quantity: 1,
  expirationDate: '',
  notes: '',
};

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
      <h2 className="pp-page-title">Your Pantry</h2>
      <p className="pp-page-intro">
        Everything you have at home, soonest to expire first — so nothing gets
        forgotten at the back of the shelf.
      </p>

      <form onSubmit={save} className="pp-panel">
        <p className="pp-label mb-3">{editId ? 'Edit item' : 'Add an item'}</p>
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

      {items.length === 0 ? (
        <p className="pp-empty">
          Nothing in your pantry yet. Add your first item above.
        </p>
      ) : (
        <ul className="list-group">
          {items.map((item) => (
            <PantryItem
              key={item._id}
              item={item}
              onEdit={() => edit(item)}
              onDelete={() => remove(item._id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default Pantry;
