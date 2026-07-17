import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import './Grocery.css';

const CATEGORIES = ['Produce', 'Dairy', 'Meat', 'Grains', 'Snacks', 'Other'];

// Grocery page: add, adjust quantity, mark purchased, remove.
function Grocery() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Produce');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setItems(await api.get('/grocery'));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function add(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post('/grocery', { name, category, quantity: 1 });
    setName('');
    load();
  }

  async function update(item, changes) {
    await api.put(`/grocery/${item._id}`, { ...item, ...changes });
    load();
  }

  async function remove(id) {
    await api.del(`/grocery/${id}`);
    load();
  }

  return (
    <section className="grocery-page">
      <h2 className="h4">Grocery List</h2>
      <p className="text-muted small">
        Add what to buy, tick items off, then remove them.
      </p>

      <form className="row g-2 mb-3" onSubmit={add}>
        <div className="col">
          <input
            className="form-control"
            placeholder="e.g. Milk"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="col-auto">
          <button className="btn btn-success" type="submit">
            Add
          </button>
        </div>
      </form>

      {error && <p className="text-danger">{error}</p>}

      <ul className="list-group">
        {items.map((item) => (
          <li
            key={item._id}
            className="list-group-item d-flex align-items-center gap-2 flex-wrap"
          >
            <input
              className="form-check-input mt-0"
              type="checkbox"
              checked={item.purchased}
              onChange={(e) => update(item, { purchased: e.target.checked })}
            />
            <span
              className={
                item.purchased ? 'fw-semibold grocery-purchased' : 'fw-semibold'
              }
            >
              {item.name}
            </span>
            <span className="badge text-bg-success">{item.category}</span>
            <span className="ms-auto btn-group btn-group-sm">
              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  update(item, { quantity: Math.max(1, item.quantity - 1) })
                }
              >
                −
              </button>
              <span className="btn btn-outline-secondary disabled">
                {item.quantity}
              </span>
              <button
                className="btn btn-outline-secondary"
                onClick={() => update(item, { quantity: item.quantity + 1 })}
              >
                +
              </button>
            </span>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => remove(item._id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Grocery;
