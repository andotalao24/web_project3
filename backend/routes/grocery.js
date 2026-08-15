import express from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db.js';

const router = express.Router();

const collection = () => getDb().collection('groceryItems');

// Build a clean grocery document from the request body.
function buildItem(body) {
  return {
    name: (body.name || '').trim(),
    category: (body.category || 'Other').trim(),
    quantity: Number(body.quantity) || 1,
    purchased: Boolean(body.purchased),
  };
}

// GET /api/grocery — list all grocery items.
router.get('/', async (req, res, next) => {
  try {
    const items = await collection()
      .find({})
      .sort({ purchased: 1, name: 1 })
      .limit(500)
      .toArray();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET /api/grocery/:id — one item.
router.get('/:id', async (req, res, next) => {
  try {
    const item = await collection().findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/grocery — create.
//
// Adding an item that is already on the list (and not yet purchased) tops up
// its quantity instead of inserting a second row for the same food — the
// same "beef"/"Beef" case-insensitive match the pantry uses. A purchased
// item is left alone so buying it again starts a fresh, unchecked row.
router.post('/', async (req, res, next) => {
  try {
    const doc = buildItem(req.body);
    if (!doc.name) return res.status(400).json({ error: 'Name is required' });
    const result = await collection().findOneAndUpdate(
      {
        purchased: { $ne: true },
        $expr: {
          $eq: [
            { $toLower: { $trim: { input: '$name' } } },
            doc.name.toLowerCase(),
          ],
        },
      },
      {
        $inc: { quantity: doc.quantity },
        $setOnInsert: {
          name: doc.name,
          category: doc.category,
          purchased: false,
          createdAt: new Date(),
        },
      },
      { upsert: true, returnDocument: 'after' },
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// PUT /api/grocery/:id — update (quantity, purchased status, etc.).
router.put('/:id', async (req, res, next) => {
  try {
    const doc = buildItem(req.body);
    const result = await collection().findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: doc },
      { returnDocument: 'after' },
    );
    if (!result) return res.status(404).json({ error: 'Item not found' });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/grocery/:id — remove.
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await collection().deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
