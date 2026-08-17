import { useState } from 'react';
import PropTypes from 'prop-types';
import './RecipeCard.css';

// One recipe: what it needs, what you already have, and what is missing.
function RecipeCard({ recipe, onAddMissing }) {
  const [open, setOpen] = useState(false);
  const ready = recipe.missing.length === 0;

  return (
    <li className={`recipe ${ready ? 'is-ready' : ''}`}>
      <div className="recipe-head">
        <button
          type="button"
          className="recipe-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className={`recipe-caret ${open ? 'is-open' : ''}`}>›</span>
          <span className="recipe-name">{recipe.name}</span>
        </button>

        <span className="recipe-meta pp-num">
          {recipe.minutes} min · serves {recipe.servings}
        </span>

        {recipe.isCustom && <span className="recipe-status">Your recipe</span>}

        {ready ? (
          <span className="recipe-status is-ready">Ready to cook</span>
        ) : (
          <span className="recipe-status">Missing {recipe.missing.length}</span>
        )}
      </div>

      <ul className="recipe-ingredients">
        {recipe.have.map((i) => (
          <li key={i.name} className="ing has">
            {i.name}
          </li>
        ))}
        {recipe.missing.map((i) => (
          <li key={i.name} className="ing missing">
            {i.name}
            <span className="ing-aisle">{i.category}</span>
            <span className="visually-hidden"> — not in your pantry</span>
          </li>
        ))}
      </ul>

      {!ready && (
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary recipe-add"
          onClick={() => onAddMissing(recipe)}
        >
          Add {recipe.missing.length} missing to Shopping Cart
        </button>
      )}

      {open && (
        <ol className="recipe-steps">
          {recipe.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      )}
    </li>
  );
}

const ingredientShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  category: PropTypes.string,
});

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    minutes: PropTypes.number.isRequired,
    servings: PropTypes.number.isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
    have: PropTypes.arrayOf(ingredientShape).isRequired,
    missing: PropTypes.arrayOf(ingredientShape).isRequired,
    steps: PropTypes.arrayOf(PropTypes.string).isRequired,
    isCustom: PropTypes.bool,
  }).isRequired,
  onAddMissing: PropTypes.func.isRequired,
};

export default RecipeCard;
