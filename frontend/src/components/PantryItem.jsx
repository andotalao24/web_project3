import { useState } from 'react';
import PropTypes from 'prop-types';

// One pantry row. Clicking the row expands it to show the item's notes.
function PantryItem({ item, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const hasNotes = Boolean(item.notes && item.notes.trim());

  return (
    <li className="list-group-item pantry-row">
      <div className="pantry-row-main">
        {/* The name doubles as the expand control, so the whole row reads
            as clickable without nesting buttons inside a button. */}
        <button
          type="button"
          className="pantry-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className={`pantry-caret ${open ? 'is-open' : ''}`}>›</span>
          <span className="pantry-name">{item.name}</span>
        </button>

        <span className="badge text-bg-success">{item.category}</span>
        <span className="pantry-date">
          {item.purchaseDate
            ? `Bought ${new Date(item.purchaseDate).toLocaleDateString()}`
            : 'No date'}
        </span>

        {hasNotes && !open && (
          <span className="pantry-note-flag" title="Has a note">
            note
          </span>
        )}

        <span className="ms-auto text-muted small pp-num">
          Qty {item.quantity}
        </span>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          aria-label={`Edit ${item.name}`}
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          aria-label={`Delete ${item.name}`}
          onClick={onDelete}
        >
          Delete
        </button>
      </div>

      {open && (
        <p className="pantry-note">
          {hasNotes ? (
            item.notes
          ) : (
            <span className="pantry-note-empty">No note for this item.</span>
          )}
        </p>
      )}
    </li>
  );
}

PantryItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    purchaseDate: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PantryItem;
