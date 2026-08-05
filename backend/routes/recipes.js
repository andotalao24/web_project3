import express from 'express';
import { getDb } from '../db.js';

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

    // distinct() covers the whole pantry, not just the first page of it.
    const pantryNames = await db.collection('pantryItems').distinct('name');
    const inPantry = new Set(pantryNames.map(key));

    const recipes = await db.collection('recipes').find({}).toArray();

    const ranked = recipes
      .map((recipe) => {
        const have = recipe.ingredients.filter((i) => inPantry.has(key(i)));
        const missing = recipe.ingredients.filter((i) => !inPantry.has(key(i)));
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
