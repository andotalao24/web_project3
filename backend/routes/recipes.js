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

// Turn a textarea's worth of typing into a clean list: one entry per line
// (a comma-separated line also splits), blanks dropped, nothing trimmed away
// to nothing.
function toList(value) {
  if (Array.isArray(value))
    return value.map((s) => String(s).trim()).filter(Boolean);
  return String(value || '')
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

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

// POST /api/recipes — add a recipe of your own.
//
// It lands in the same collection the curated recipes came from, so it is
// ranked against the pantry and can feed the shopping cart exactly like any
// other recipe — no separate code path for "my recipes" to keep in sync.
router.post('/', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const ingredients = toList(req.body.ingredients);
    const steps = toList(req.body.steps);
    const minutes = Number(req.body.minutes) || 30;
    const servings = Number(req.body.servings) || 1;

    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (ingredients.length === 0) {
      return res
        .status(400)
        .json({ error: 'At least one ingredient is required' });
    }
    if (steps.length === 0) {
      return res.status(400).json({ error: 'At least one step is required' });
    }

    const doc = {
      name,
      ingredients,
      steps,
      minutes,
      servings,
      isCustom: true,
      createdBy: req.user?.username || null,
      createdAt: new Date(),
    };
    const result = await getDb().collection('recipes').insertOne(doc);
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    next(err);
  }
});

export default router;
