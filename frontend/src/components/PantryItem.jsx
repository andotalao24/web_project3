import PropTypes from 'prop-types';

// Days until expiration (used to flag items expiring soon).
function daysLeft(date) {
  if (!date) return null;
  return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
}

// One pantry row: name, category, expiration, quantity, edit/delete buttons.
function PantryItem({ item, onEdit, onDelete }) {
  const d = daysLeft(item.expirationDate);

  return (
    <li className="list-group-item d-flex align-items-center gap-2 flex-wrap">
      <span className="fw-semibold">{item.name}</span>
      <span className="badge text-bg-success">{item.category}</span>
      <span className={d !== null && d <= 3 ? 'pantry-soon' : ''}>
        {item.expirationDate
          ? new Date(item.expirationDate).toLocaleDateString()
          : 'No date'}
      </span>
      <span className="ms-auto text-muted small">Qty: {item.quantity}</span>
      <button className="btn btn-sm btn-outline-secondary" onClick={onEdit}>
        Edit
      </button>
      <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>
        Delete
      </button>
    </li>
  );
}

PantryItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    expirationDate: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PantryItem;
