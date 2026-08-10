// Categories are suggestions, not a closed set. The six below cover most
// shopping, but people organise their own shelves — "Frozen", "Baby", "Spices"
// — so the pickers accept free text and offer whatever has been used before.

export const DEFAULT_CATEGORIES = [
  'Produce',
  'Dairy',
  'Meat',
  'Grains',
  'Snacks',
  'Other',
];

// The defaults plus every category already in use, de-duplicated
// case-insensitively so "Frozen" and "frozen" do not both appear.
export function knownCategories(items) {
  const seen = new Map();
  const add = (value) => {
    const name = String(value || '').trim();
    if (!name) return;
    const key = name.toLowerCase();
    if (!seen.has(key)) seen.set(key, name);
  };

  DEFAULT_CATEGORIES.forEach(add);
  items.forEach((item) => add(item.category));
  return [...seen.values()];
}
