import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// One grocery row: purchased checkbox, name, category, quantity, remove.
//
// The quantity is a real input, not a stepper readout. Realising in the aisle
// that you need three of something should take one keystroke, not two taps —
// the ± buttons stay for small nudges.
function GroceryItem({ item, onUpdate, onDelete }) {
  const [draft, setDraft] = useState(String(item.quantity));

  // A quantity changed elsewhere (the ± buttons, another device) replaces what
  // is in the box — unless the box is where the change came from.
  useEffect(() => {
    setDraft(String(item.quantity));
  }, [item.quantity]);

  // Typing is not saved on every keystroke: "1" on the way to "12" would
  // otherwise be written first. Blur and Enter commit; anything unusable
  // falls back to what is stored.
  function commit() {
    const next = Math.max(1, Math.round(Number(draft)));
    if (!Number.isFinite(next)) return setDraft(String(item.quantity));
    setDraft(String(next));
    if (next !== item.quantity) onUpdate({ quantity: next });
    return undefined;
  }

  return (
    <li className="list-group-item d-flex align-items-center gap-2 flex-wrap">
      <input
        className="form-check-input mt-0"
        type="checkbox"
        checked={item.purchased}
        aria-label={`Mark ${item.name} as purchased`}
        onChange={(e) => onUpdate({ purchased: e.target.checked })}
      />
      <span className={item.purchased ? 'grocery-purchased' : 'grocery-name'}>
        {item.name}
      </span>
      <span className="badge text-bg-success">{item.category}</span>
      <span className="ms-auto grocery-stepper">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          aria-label={`Decrease quantity of ${item.name}`}
          onClick={() => onUpdate({ quantity: Math.max(1, item.quantity - 1) })}
        >
          −
        </button>
        <input
          className="form-control form-control-sm grocery-qty"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          value={draft}
          aria-label={`Quantity of ${item.name}`}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            // Enter saves and lets go of the field, rather than submitting
            // whatever form the row happens to sit in.
            e.preventDefault();
            commit();
            e.currentTarget.blur();
          }}
        />
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          aria-label={`Increase quantity of ${item.name}`}
          onClick={() => onUpdate({ quantity: item.quantity + 1 })}
        >
          +
        </button>
      </span>
      <button
        type="button"
        className="btn btn-sm btn-outline-danger"
        aria-label={`Remove ${item.name} from the shopping cart`}
        onClick={onDelete}
      >
        Remove
      </button>
    </li>
  );
}

GroceryItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    quantity: PropTypes.number.isRequired,
    purchased: PropTypes.bool,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default GroceryItem;
