import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api';
import RecipeCard from './RecipeCard';
import './Recipes.css';

const EMPTY_RECIPE = {
  name: '',
  minutes: 30,
  servings: 2,
  ingredients: '',
  steps: '',
};

// Recipes page: every stored recipe ranked against what is in the pantry,
// so the ones you can cook right now come first.
function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [readyCount, setReadyCount] = useState(0);
  const [filter, setFilter] = useState('ready'); // 'ready' | 'close' | 'all'
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [recipeForm, setRecipeForm] = useState(EMPTY_RECIPE);

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

  // Put a recipe's missing ingredients straight onto the shopping list, each
  // under its own aisle so the list stays sortable once you are in the shop.
  async function addMissing(recipe) {
    setError('');
    try {
      await Promise.all(
        recipe.missing.map(({ name, category }) =>
          api.post('/grocery', { name, category, quantity: 1 }),
        ),
      );
      setNotice(
        `Added ${recipe.missing.length} item(s) for ${recipe.name} to your Shopping Cart.`,
      );
    } catch (err) {
      setError(err.message);
    }
  }

  // Feeds the same collection the curated recipes are ranked from, so a
  // recipe you add shows up matched against your pantry and can send its
  // missing ingredients to the Shopping Cart exactly like any other recipe.
  async function addRecipe(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/recipes', recipeForm);
      setRecipeForm(EMPTY_RECIPE);
      setShowForm(false);
      setNotice(`Added "${recipeForm.name}" to your recipes.`);
      load();
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
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary ms-auto"
          aria-expanded={showForm}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Cancel' : '+ Add your own recipe'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addRecipe} className="pp-panel">
          <p className="pp-label mb-3">Add a recipe</p>
          <div className="row g-2 mb-2">
            <div className="col-sm-6">
              <label
                className="form-label pp-field-label"
                htmlFor="recipe-name"
              >
                Name
              </label>
              <input
                id="recipe-name"
                className="form-control"
                placeholder="e.g. Tomato Basil Soup"
                value={recipeForm.name}
                onChange={(e) =>
                  setRecipeForm({ ...recipeForm, name: e.target.value })
                }
                required
              />
            </div>
            <div className="col-sm-3">
              <label
                className="form-label pp-field-label"
                htmlFor="recipe-minutes"
              >
                Minutes
              </label>
              <input
                id="recipe-minutes"
                type="number"
                min="1"
                className="form-control"
                value={recipeForm.minutes}
                onChange={(e) =>
                  setRecipeForm({ ...recipeForm, minutes: e.target.value })
                }
              />
            </div>
            <div className="col-sm-3">
              <label
                className="form-label pp-field-label"
                htmlFor="recipe-servings"
              >
                Servings
              </label>
              <input
                id="recipe-servings"
                type="number"
                min="1"
                className="form-control"
                value={recipeForm.servings}
                onChange={(e) =>
                  setRecipeForm({ ...recipeForm, servings: e.target.value })
                }
              />
            </div>
          </div>
          <div className="row g-2 mb-2">
            <div className="col-sm-6">
              <label
                className="form-label pp-field-label"
                htmlFor="recipe-ingredients"
              >
                Ingredients (one per line)
              </label>
              <textarea
                id="recipe-ingredients"
                className="form-control"
                rows="4"
                placeholder={'Tomatoes\nOnions\nOlive Oil'}
                value={recipeForm.ingredients}
                onChange={(e) =>
                  setRecipeForm({
                    ...recipeForm,
                    ingredients: e.target.value,
                  })
                }
                required
              />
              <p className="recipes-form-hint">
                Use the same names you use in your pantry, so this recipe
                matches what you already have.
              </p>
            </div>
            <div className="col-sm-6">
              <label
                className="form-label pp-field-label"
                htmlFor="recipe-steps"
              >
                Steps (one per line)
              </label>
              <textarea
                id="recipe-steps"
                className="form-control"
                rows="4"
                placeholder={
                  'Chop the onions and soften them in the oil.\nAdd the tomatoes and simmer.'
                }
                value={recipeForm.steps}
                onChange={(e) =>
                  setRecipeForm({ ...recipeForm, steps: e.target.value })
                }
                required
              />
            </div>
          </div>
          <button className="btn btn-success" type="submit">
            Add recipe
          </button>
        </form>
      )}

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
