import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import RecipeCard from './RecipeCard';
import './Recipes.css';

// Recipes page: every stored recipe ranked against what is in the pantry,
// so the ones you can cook right now come first.
function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [readyCount, setReadyCount] = useState(0);
  const [filter, setFilter] = useState('ready'); // 'ready' | 'close' | 'all'
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await api.get('/recipes');
      setRecipes(data.recipes);
      setReadyCount(data.readyCount);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Put a recipe's missing ingredients straight onto the shopping list.
  async function addMissing(recipe) {
    setError('');
    try {
      await Promise.all(
        recipe.missing.map((name) =>
          api.post('/grocery', { name, category: 'Other', quantity: 1 }),
        ),
      );
      setNotice(
        `Added ${recipe.missing.length} item(s) for ${recipe.name} to your Shopping Cart.`,
      );
    } catch (err) {
      setError(err.message);
    }
  }

  const closeCount = recipes.filter(
    (r) => r.missing.length > 0 && r.missing.length <= 2,
  ).length;

  const shown = recipes.filter((r) => {
    if (filter === 'ready') return r.missing.length === 0;
    if (filter === 'close')
      return r.missing.length > 0 && r.missing.length <= 2;
    return true;
  });

  const tab = (key, label) => (
    <button
      type="button"
      className={`btn btn-sm ${
        filter === key ? 'btn-success' : 'btn-outline-secondary'
      }`}
      aria-pressed={filter === key}
      onClick={() => setFilter(key)}
    >
      {label}
    </button>
  );

  return (
    <section className="recipes-page">
      <h1 className="pp-page-title">Recipes</h1>
      <p className="pp-page-intro">
        Real recipes matched against your pantry. What you can cook tonight
        comes first — no external recipe service, just your own shelves.
      </p>

      <div className="pp-panel d-flex flex-wrap gap-2 align-items-center">
        {tab('ready', `Ready to cook (${readyCount})`)}
        {tab('close', `Missing 1–2 (${closeCount})`)}
        {tab('all', `All recipes (${recipes.length})`)}
      </div>

      {error && <p className="text-danger">{error}</p>}
      {notice && (
        <p className="recipes-notice" role="status">
          {notice}
        </p>
      )}

      {shown.length === 0 ? (
        <p className="pp-empty">
          Nothing here yet. Add more items to your pantry and these will fill
          in.
        </p>
      ) : (
        <ul className="recipes-list">
          {shown.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onAddMissing={addMissing}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default Recipes;
