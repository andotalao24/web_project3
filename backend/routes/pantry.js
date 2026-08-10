import express from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db.js';

const router = express.Router();

const collection = () => getDb().collection('pantryItems');

// A shopping day is a calendar date, not an instant. Storing it as a Date made
// "2026-08-10" mean midnight UTC, which any browser west of Greenwich then read
// back as the 9th. Keeping the plain YYYY-MM-DD string means the day a user
// picks is the day they see, everywhere. Legacy timestamps still in the
// database are trimmed to their date part on read.
export function toDayString(value) {
  if (!value) return null;
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(
    value instanceof Date ? value.toISOString() : String(value),
  );
  return match ? match[1] : null;
}

// Every item leaves the API with a plain date, whichever shape it was stored in.
const asDayDated = (item) => ({
  ...item,
  purchaseDate: toDayString(item.purchaseDate),
});

// Build a clean item document from the request body.
function buildItem(body) {
  return {
    name: (body.name || '').trim(),
    category: (body.category || 'Other').trim(),
    quantity: Number(body.quantity) || 1,
    purchaseDate: toDayString(body.purchaseDate),
    notes: (body.notes || '').trim(),
  };
}

// GET /api/pantry — list all pantry items.
// ?sort=purchased puts the most recently bought items first.
//
// Days are flattened to strings before sorting, not after: MongoDB orders by
// BSON type first, so a collection holding both new date strings and legacy
// timestamps would sort into two blocks and push a whole block past the limit.
router.get('/', async (req, res, next) => {
  try {
    const sort =
      req.query.sort === 'purchased' ? { purchaseDate: -1 } : { name: 1 };
    const items = await collection()
      .aggregate([
        {
          $addFields: {
            purchaseDate: {
              $cond: [
                { $eq: [{ $type: '$purchaseDate' }, 'date'] },
                {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$purchaseDate',
                  },
                },
                '$purchaseDate',
              ],
            },
          },
        },
        { $sort: sort },
        { $limit: 500 },
      ])
      .toArray();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET /api/pantry/:id — one item.
router.get('/:id', async (req, res, next) => {
  try {
    const item = await collection().findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(asDayDated(item));
  } catch (err) {
    next(err);
  }
});

// POST /api/pantry — create.
router.post('/', async (req, res, next) => {
  try {
    const doc = buildItem(req.body);
    if (!doc.name) return res.status(400).json({ error: 'Name is required' });
    doc.createdAt = new Date();
    const result = await collection().insertOne(doc);
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    next(err);
  }
});

// PUT /api/pantry/:id — update.
router.put('/:id', async (req, res, next) => {
  try {
    const doc = buildItem(req.body);
    const result = await collection().findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: doc },
      { returnDocument: 'after' },
    );
    if (!result) return res.status(404).json({ error: 'Item not found' });
    res.json(asDayDated(result));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/pantry/:id — remove.
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
