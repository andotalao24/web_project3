import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import PantryItem from './PantryItem';
import PantryCalendar from './PantryCalendar';
import './Pantry.css';

const CATEGORIES = ['Produce', 'Dairy', 'Meat', 'Grains', 'Snacks', 'Other'];

const EMPTY = {
  name: '',
  category: 'Produce',
  quantity: 1,
  purchaseDate: '',
  notes: '',
};

// Pantry page: add, list (newest purchases first), edit and delete items.
function Pantry() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [view, setView] = useState('calendar'); // 'calendar' | 'list'
  const [selectedDay, setSelectedDay] = useState(null);

  const load = useCallback(async () => {
    try {
      setItems(await api.get('/pantry?sort=purchased'));
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
      purchaseDate: item.purchaseDate ? item.purchaseDate.slice(0, 10) : '',
      notes: item.notes || '',
    });
  }

  async function remove(id) {
    await api.del(`/pantry/${id}`);
    load();
  }

  // Same local YYYY-MM-DD key the calendar uses, so the two agree.
  function dayKey(date) {
    const d = new Date(date);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  // "YYYY-MM-DD" parsed as a LOCAL date. Passing the string straight to
  // new Date() would read it as UTC midnight and shift the displayed day.
  function localDate(key) {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  // Clicking a calendar day both filters the list below and pre-fills the
  // add form with that date, so a day can be filled straight from the grid.
  function pickDay(key) {
    setSelectedDay(key);
    if (!editId) {
      setForm((f) => ({ ...f, purchaseDate: key || '' }));
    }
  }

  // In calendar view, the detail list shows only the chosen day.
  const visibleItems = selectedDay
    ? items.filter(
        (i) => i.purchaseDate && dayKey(i.purchaseDate) === selectedDay,
      )
    : items;

  return (
    <section className="pantry-page">
      <h1 className="pp-page-title">Your Pantry</h1>
      <p className="pp-page-intro">
        Everything you have at home, laid out by the day you bought it — click
        any day to add what you picked up.
      </p>

      <form onSubmit={save} className="pp-panel">
        <p className="pp-label mb-3">
          {editId ? 'Edit item' : 'Add an item'}
          {!editId && form.purchaseDate && (
            <span className="pantry-target">
              bought {localDate(form.purchaseDate).toLocaleDateString()}
            </span>
          )}
        </p>
        <div className="row g-2 mb-2">
          <div className="col-sm-4">
            <label className="form-label pp-field-label" htmlFor="pantry-name">
              Name
            </label>
            <input
              id="pantry-name"
              className="form-control"
              placeholder="e.g. Olive oil"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="col-sm-3">
            <label
              className="form-label pp-field-label"
              htmlFor="pantry-category"
            >
              Category
            </label>
            <select
              id="pantry-category"
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
            <label className="form-label pp-field-label" htmlFor="pantry-qty">
              Quantity
            </label>
            <input
              id="pantry-qty"
              className="form-control"
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </div>
          <div className="col-sm-3">
            <label className="form-label pp-field-label" htmlFor="pantry-date">
              Bought on
            </label>
            <input
              id="pantry-date"
              className="form-control"
              type="date"
              value={form.purchaseDate}
              onChange={(e) =>
                setForm({ ...form, purchaseDate: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row g-2 align-items-end">
          <div className="col">
            <label className="form-label pp-field-label" htmlFor="pantry-notes">
              Notes
            </label>
            <input
              id="pantry-notes"
              className="form-control"
              placeholder="Optional"
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

      <div className="pantry-views">
        <button
          type="button"
          className={`btn btn-sm ${
            view === 'calendar' ? 'btn-success' : 'btn-outline-secondary'
          }`}
          onClick={() => setView('calendar')}
        >
          Calendar
        </button>
        <button
          type="button"
          className={`btn btn-sm ${
            view === 'list' ? 'btn-success' : 'btn-outline-secondary'
          }`}
          onClick={() => setView('list')}
        >
          List
        </button>
      </div>

      {items.length === 0 ? (
        <p className="pp-empty">
          Nothing in your pantry yet. Add your first item above.
        </p>
      ) : view === 'calendar' ? (
        <>
          <PantryCalendar
            items={items}
            selectedDay={selectedDay}
            onSelectDay={pickDay}
          />
          {selectedDay ? (
            <>
              <p className="pp-label mb-2">
                Bought {localDate(selectedDay).toLocaleDateString()}
              </p>
              <ul className="list-group">
                {visibleItems.map((item) => (
                  <PantryItem
                    key={item._id}
                    item={item}
                    onEdit={() => edit(item)}
                    onDelete={() => remove(item._id)}
                  />
                ))}
              </ul>
            </>
          ) : (
            <p className="pp-hint">
              Click a day to add what you bought then, or to review that
              day&apos;s shopping.
            </p>
          )}
        </>
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
