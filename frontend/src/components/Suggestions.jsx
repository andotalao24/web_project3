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
      <h2 className="pp-page-title">What Should I Cook?</h2>
      <p className="pp-page-intro">
        Too tired to decide? PantryPal shuffles what you already own into a
        combination — no recipe service, just your own shelves.
      </p>

      <div className="pp-panel d-flex flex-wrap gap-2 align-items-center">
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
        <button className="btn btn-outline-secondary" onClick={fromCategory}>
          Suggest from category
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {result && (
        <div className="suggestion-result">
          <p className="suggestion-message">{result.message}</p>
          <ul className="suggestion-chips">
            {result.combination.map((item) => (
              <li key={item._id} className="suggestion-chip">
                {item.name}
                <span className="suggestion-chip-cat">{item.category}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default Suggestions;
