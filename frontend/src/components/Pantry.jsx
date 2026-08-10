import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { knownCategories } from '../categories';
import { formatDay, toDayKey, toLocalDate } from '../dates';
import PantryItem from './PantryItem';
import PantryGroup from './PantryGroup';
import PantryCalendar from './PantryCalendar';
import './Pantry.css';

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
    ? items.filter((i) => toDayKey(i.purchaseDate) === selectedDay)
    : items;

  // Free-typed categories join the suggestions, so one used last week is one
  // click away this week.
  const categoryOptions = useMemo(() => knownCategories(items), [items]);

  // The list view is an inventory, so the same food bought on several days
  // collapses into one row carrying its running total. Each purchase stays
  // separately editable underneath.
  const groups = useMemo(() => {
    const byName = new Map();
    items.forEach((item) => {
      if (!byName.has(item.name)) byName.set(item.name, []);
      byName.get(item.name).push(item);
    });

    return [...byName.entries()]
      .map(([name, entries]) => ({
        name,
        category: entries[0].category,
        totalQuantity: entries.reduce(
          (sum, i) => sum + (Number(i.quantity) || 0),
          0,
        ),
        entries: [...entries].sort((a, b) =>
          String(toDayKey(b.purchaseDate) || '').localeCompare(
            String(toDayKey(a.purchaseDate) || ''),
          ),
        ),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

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
              bought {formatDay(form.purchaseDate)}
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
            <input
              id="pantry-category"
              className="form-control"
              list="pantry-category-options"
              placeholder="Pick one or type your own"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <datalist id="pantry-category-options">
              {categoryOptions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
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
                Bought {toLocalDate(selectedDay).toLocaleDateString()}
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
        <ul className="pantry-groups">
          {groups.map((group) => (
            <PantryGroup
              key={group.name}
              group={group}
              onEdit={edit}
              onDelete={remove}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default Pantry;
