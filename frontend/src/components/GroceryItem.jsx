import PropTypes from 'prop-types';

// One grocery row: purchased checkbox, name, category, quantity stepper, remove.
function GroceryItem({ item, onUpdate, onDelete }) {
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
      <span className="ms-auto btn-group btn-group-sm">
        <button
          type="button"
          className="btn btn-outline-secondary"
          aria-label={`Decrease quantity of ${item.name}`}
          onClick={() => onUpdate({ quantity: Math.max(1, item.quantity - 1) })}
        >
          −
        </button>
        <span className="btn btn-outline-secondary disabled grocery-qty">
          <span className="visually-hidden">Quantity </span>
          {item.quantity}
        </span>
        <button
          type="button"
          className="btn btn-outline-secondary"
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
