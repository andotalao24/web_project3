import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import GroceryItem from './GroceryItem';
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
      <h1 className="pp-page-title">Shopping Cart</h1>
      <p className="pp-page-intro">
        What you still need to buy. Tick items off as you shop, then clear them
        once they are home.
      </p>

      <form className="pp-panel row g-2 align-items-end" onSubmit={add}>
        <div className="col">
          <label className="form-label pp-field-label" htmlFor="grocery-name">
            Item
          </label>
          <input
            id="grocery-name"
            className="form-control"
            placeholder="e.g. Milk"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <label
            className="form-label pp-field-label"
            htmlFor="grocery-category"
          >
            Category
          </label>
          <select
            id="grocery-category"
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

      {items.length === 0 ? (
        <p className="pp-empty">
          Your list is empty. Add something you need to buy above.
        </p>
      ) : (
        <ul className="list-group">
          {items.map((item) => (
            <GroceryItem
              key={item._id}
              item={item}
              onUpdate={(changes) => update(item, changes)}
              onDelete={() => remove(item._id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default Grocery;
