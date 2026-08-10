// Fills the database with 1000+ synthetic records plus a demo user.
// Run with: npm run seed
import 'dotenv/config';

import bcrypt from 'bcryptjs';
import { connect, getDb, client } from './db.js';
import { RECIPES } from './recipes-data.js';
import { categoryFor } from './food-categories.js';

const FOODS = [
  'Apples',
  'Bananas',
  'Carrots',
  'Milk',
  'Cheese',
  'Yogurt',
  'Chicken',
  'Beef',
  'Rice',
  'Pasta',
  'Bread',
  'Beans',
  'Corn',
  'Spinach',
  'Tomatoes',
  'Onions',
  'Potatoes',
  'Eggs',
  'Butter',
  'Cereal',
  'Oats',
  'Flour',
  'Olive Oil',
  'Ketchup',
  'Coffee',
  'Tea',
  'Juice',
  'Crackers',
  'Chips',
  'Ice Cream',
  'Salmon',
  'Lettuce',
  'Mushrooms',
  'Broccoli',
  'Strawberries',
  'Almonds',
  'Peanut Butter',
  'Honey',
];
const NOTES = ['', 'Opened', 'Almost gone', 'Bulk buy', 'For dinner'];

// A real pantry does not hold every food at once. Holding a few ingredients
// back keeps the recipe matcher meaningful: some recipes come out cookable,
// others one or two items short. The shopping list still draws on all foods.
const OUT_OF_STOCK = [
  'Salmon',
  'Beef',
  'Almonds',
  'Mushrooms',
  'Flour',
  'Strawberries',
  'Corn',
  'Carrots',
];
const PANTRY_FOODS = FOODS.filter((f) => !OUT_OF_STOCK.includes(f));

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// A shopping date in the recent past — you cannot buy food in the future.
// Stored as a plain YYYY-MM-DD calendar day, the same shape the API writes,
// so no timezone conversion can shift it onto the wrong square.
function randomPurchaseDate() {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * 60));
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

async function seed() {
  await connect();
  const db = getDb();

  await db.collection('pantryItems').deleteMany({});
  await db.collection('groceryItems').deleteMany({});
  await db.collection('recipes').deleteMany({});
  await db.collection('users').deleteMany({});

  // Recipes are curated, not generated — they are the app's own reference data.
  await db.collection('recipes').insertMany(RECIPES.map((r) => ({ ...r })));

  await db.collection('pantryItems').insertMany(
    Array.from({ length: 800 }, () => {
      const name = pick(PANTRY_FOODS);
      return {
        name,
        category: categoryFor(name),
        quantity: 1 + Math.floor(Math.random() * 10),
        purchaseDate: randomPurchaseDate(),
        notes: pick(NOTES),
      };
    }),
  );

  await db.collection('groceryItems').insertMany(
    Array.from({ length: 300 }, () => {
      const name = pick(FOODS);
      return {
        name,
        category: categoryFor(name),
        quantity: 1 + Math.floor(Math.random() * 6),
        purchased: Math.random() < 0.3,
      };
    }),
  );

  await db.collection('users').insertOne({
    username: 'demo',
    passwordHash: await bcrypt.hash('demo1234', 10),
  });

  console.log(
    `Seeded 800 pantry + 300 grocery + ${RECIPES.length} recipes ` +
      '+ demo user (demo / demo1234)',
  );
  await client.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
