import { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDay } from '../../dates';
import './PantryGroup.css';

// One food, however many times it was bought. The row shows the running
// total; expanding it lists each separate purchase so a single batch can
// still be edited or deleted on its own.
function PantryGroup({ group, onEdit, onDelete, onDeleteAll }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { name, category, entries, totalQuantity } = group;
  const times = entries.length;

  return (
    <li className="pgroup">
      <div className="pgroup-head">
        <button
          type="button"
          className="pgroup-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={`${name}. ${totalQuantity} in total from ${times} purchase${
            times === 1 ? '' : 's'
          }. Show each purchase.`}
        >
          <span className={`pgroup-caret ${open ? 'is-open' : ''}`}>›</span>
          <span className="pgroup-name">{name}</span>
        </button>

        <span className="badge text-bg-success">{category}</span>

        <span className="pgroup-times">
          {times} purchase{times === 1 ? '' : 's'}
        </span>

        <span className="pgroup-total pp-num">{totalQuantity} in total</span>

        {/* Clearing a whole food is worth a second look — several shopping
            trips disappear at once — so the button asks before it acts. */}
        {confirming ? (
          <span className="pgroup-confirm">
            <span className="pgroup-confirm-text">
              Delete all {times} purchase{times === 1 ? '' : 's'}?
            </span>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => {
                setConfirming(false);
                onDeleteAll();
              }}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            aria-label={`Delete all ${times} purchase${
              times === 1 ? '' : 's'
            } of ${name}`}
            onClick={() => setConfirming(true)}
          >
            Delete all
          </button>
        )}
      </div>

      {open && (
        <ul className="pgroup-entries">
          {entries.map((item) => (
            <li key={item._id} className="pentry">
              <span className="pentry-date pp-num">
                {formatDay(item.purchaseDate)}
              </span>
              <span className="pentry-qty pp-num">Qty {item.quantity}</span>
              {item.notes && item.notes.trim() ? (
                <span className="pentry-note">{item.notes}</span>
              ) : (
                <span className="pentry-note is-empty">No note</span>
              )}
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary ms-auto"
                aria-label={`Edit ${name} bought ${formatDay(item.purchaseDate)}`}
                onClick={() => onEdit(item)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                aria-label={`Delete ${name} bought ${formatDay(item.purchaseDate)}`}
                onClick={() => onDelete(item._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

PantryGroup.propTypes = {
  group: PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    totalQuantity: PropTypes.number.isRequired,
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        purchaseDate: PropTypes.string,
        notes: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDeleteAll: PropTypes.func.isRequired,
};

export default PantryGroup;
