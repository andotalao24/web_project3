// Which aisle a known food belongs to.
//
// Shared by the seed (so stored items carry a truthful category) and by the
// recipe matcher (so ingredients pushed onto the shopping list arrive already
// sorted by aisle instead of landing in "Other").

export const FOOD_CATEGORIES = {
  Apples: 'Produce',
  Bananas: 'Produce',
  Broccoli: 'Produce',
  Carrots: 'Produce',
  Corn: 'Produce',
  Lettuce: 'Produce',
  Mushrooms: 'Produce',
  Onions: 'Produce',
  Potatoes: 'Produce',
  Spinach: 'Produce',
  Strawberries: 'Produce',
  Tomatoes: 'Produce',

  Butter: 'Dairy',
  Cheese: 'Dairy',
  Eggs: 'Dairy',
  'Ice Cream': 'Dairy',
  Milk: 'Dairy',
  Yogurt: 'Dairy',

  Beef: 'Meat',
  Chicken: 'Meat',
  Salmon: 'Meat',

  Bread: 'Grains',
  Cereal: 'Grains',
  Flour: 'Grains',
  Oats: 'Grains',
  Pasta: 'Grains',
  Rice: 'Grains',

  Almonds: 'Snacks',
  Chips: 'Snacks',
  Crackers: 'Snacks',
  'Peanut Butter': 'Snacks',

  Beans: 'Other',
  Coffee: 'Other',
  Honey: 'Other',
  Juice: 'Other',
  Ketchup: 'Other',
  'Olive Oil': 'Other',
  Tea: 'Other',
};

// Case- and whitespace-insensitive lookup, so " olive oil " still resolves.
const byKey = new Map(
  Object.entries(FOOD_CATEGORIES).map(([name, category]) => [
    name.trim().toLowerCase(),
    category,
  ]),
);

export function categoryFor(name) {
  return (
    byKey.get(
      String(name || '')
        .trim()
        .toLowerCase(),
    ) || 'Other'
  );
}
