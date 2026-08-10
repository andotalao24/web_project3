import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { knownCategories } from '../categories';
import GroceryItem from './GroceryItem';
import './Grocery.css';

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

  // Categories already on the list join the suggestions, so a custom one is
  // typed once and picked thereafter.
  const categoryOptions = useMemo(() => knownCategories(items), [items]);

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
          <input
            id="grocery-category"
            className="form-control"
            list="grocery-category-options"
            placeholder="Pick one or type your own"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <datalist id="grocery-category-options">
            {categoryOptions.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
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
