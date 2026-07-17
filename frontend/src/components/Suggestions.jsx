import { useState } from 'react';
import { api } from '../api';
import './Suggestions.css';

const CATEGORIES = ['Produce', 'Dairy', 'Meat', 'Grains', 'Snacks', 'Other'];

// Suggestions page: shuffle pantry items into a random combo, or draw
// a few items from one category.
function Suggestions() {
  const [result, setResult] = useState(null);
  const [category, setCategory] = useState('Produce');
  const [error, setError] = useState('');

  async function surprise() {
    setError('');
    try {
      setResult(await api.get('/suggestions/random'));
    } catch (err) {
      setError(err.message);
    }
  }

  async function fromCategory() {
    setError('');
    try {
      setResult(await api.get(`/suggestions/category?category=${category}`));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="suggestions-page">
      <h2 className="h4">Suggestions</h2>
      <p className="text-muted small">
        Not sure what to cook? Shuffle what you already have — no recipe API.
      </p>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <button className="btn btn-success" onClick={surprise}>
          Surprise me
        </button>
        <select
          className="form-select w-auto"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button className="btn btn-outline-success" onClick={fromCategory}>
          Suggest from category
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {result && (
        <div className="card p-3">
          <p className="suggestion-message fw-semibold">{result.message}</p>
          <ul className="list-group list-group-flush">
            {result.combination.map((item) => (
              <li
                key={item._id}
                className="list-group-item d-flex align-items-center gap-2"
              >
                <span className="fw-semibold">{item.name}</span>
                <span className="badge text-bg-success">{item.category}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default Suggestions;
