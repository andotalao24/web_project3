import express from 'express';
import { getDb } from '../db.js';

const router = express.Router();

const collection = () => getDb().collection('pantryItems');

// Fisher–Yates shuffle.
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// GET /api/suggestions/random — shuffle pantry items into a combo of 2–3.
router.get('/random', async (req, res, next) => {
  try {
    const items = await collection()
      .find({}, { projection: { name: 1, category: 1 } })
      .limit(200)
      .toArray();
    if (items.length === 0) {
      return res.json({ combination: [], message: 'Your pantry is empty.' });
    }
    const size = Math.min(items.length, 2 + Math.floor(Math.random() * 2));
    const combination = shuffle(items).slice(0, size);
    res.json({
      combination,
      message: `How about combining: ${combination
        .map((i) => i.name)
        .join(' + ')}?`,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/suggestions/category?category=Dairy — random picks from one category.
router.get('/category', async (req, res, next) => {
  try {
    const category = req.query.category;
    if (!category) {
      return res.status(400).json({ error: 'category query param required' });
    }
    const items = await collection()
      .find({ category }, { projection: { name: 1, category: 1 } })
      .limit(200)
      .toArray();
    if (items.length === 0) {
      return res.json({
        category,
        combination: [],
        message: `No pantry items in "${category}".`,
      });
    }
    const size = Math.min(items.length, 3);
    const combination = shuffle(items).slice(0, size);
    res.json({
      category,
      combination,
      message: `From ${category}, try: ${combination
        .map((i) => i.name)
        .join(', ')}.`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
