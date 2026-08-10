import express from 'express';
import { getDb } from '../db.js';
import { categoryFor } from '../food-categories.js';

const router = express.Router();

// Ingredient names are compared case-insensitively and trimmed, so an item
// typed as " onions " still matches a recipe calling for "Onions".
const key = (s) =>
  String(s || '')
    .trim()
    .toLowerCase();

// GET /api/recipes
// Ranks every stored recipe against what is actually in the pantry:
// recipes you can cook right now come first, then the near misses.
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();

    // The whole pantry, not just the first page of it. Categories come along
    // so an ingredient you already buy keeps the aisle you filed it under.
    const pantryItems = await db
      .collection('pantryItems')
      .find({}, { projection: { name: 1, category: 1 } })
      .toArray();
    const inPantry = new Map(
      pantryItems.map((i) => [key(i.name), i.category || categoryFor(i.name)]),
    );

    // An ingredient carries its aisle wherever it goes — notably onto the
    // shopping list, which used to file every recipe item under "Other".
    const describe = (name) => ({
      name,
      category: inPantry.get(key(name)) || categoryFor(name),
    });

    const recipes = await db.collection('recipes').find({}).toArray();

    const ranked = recipes
      .map((recipe) => {
        const have = recipe.ingredients
          .filter((i) => inPantry.has(key(i)))
          .map(describe);
        const missing = recipe.ingredients
          .filter((i) => !inPantry.has(key(i)))
          .map(describe);
        return { ...recipe, have, missing };
      })
      .sort(
        (a, b) =>
          a.missing.length - b.missing.length || // closest to cookable first
          a.minutes - b.minutes || // then quickest
          a.name.localeCompare(b.name),
      );

    res.json({
      pantryCount: inPantry.size,
      readyCount: ranked.filter((r) => r.missing.length === 0).length,
      recipes: ranked,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
