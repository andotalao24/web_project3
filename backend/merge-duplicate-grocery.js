// One-off cleanup: collapses shopping-cart rows that are the same food.
//
// The list was seeded (and then added to) before POST /api/grocery learned to
// top up an existing row, so it carries a backlog of repeats — thirteen
// "Strawberries" rows, "chicken" sitting next to "Chicken". This merges that
// backlog so the list matches the invariant the route now maintains: at most
// one unpurchased row per food.
//
// Purchased rows are left alone. They are a record of what was ticked off, and
// two separate purchases are not the same event to be summed.
//
// Dry run by default:  node merge-duplicate-grocery.js
// Write the changes:   node merge-duplicate-grocery.js --apply
import 'dotenv/config';

import { connect, getDb, client } from './db.js';

const apply = process.argv.includes('--apply');
const key = (name) => name.trim().toLowerCase();

async function main() {
  await connect();
  const items = getDb().collection('groceryItems');

  const unpurchased = await items.find({ purchased: { $ne: true } }).toArray();

  // Oldest row of each food wins: it carries the canonical spelling the seed
  // used, so a later "chicken" folds into the original "Chicken" rather than
  // renaming it.
  const groups = new Map();
  unpurchased.forEach((item) => {
    const k = key(item.name);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(item);
  });

  const merges = [...groups.values()]
    .filter((rows) => rows.length > 1)
    .map((rows) => {
      const [keep, ...drop] = [...rows].sort((a, b) =>
        String(a._id).localeCompare(String(b._id)),
      );
      return {
        keep,
        drop,
        total: rows.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0),
      };
    });

  if (merges.length === 0) {
    console.log('No duplicate unpurchased rows. Nothing to do.');
    return;
  }

  merges.forEach(({ keep, drop, total }) => {
    const from = [keep, ...drop].map((r) => r.quantity).join(' + ');
    console.log(
      `${keep.name}: ${drop.length + 1} rows -> 1  (qty ${from} = ${total})`,
    );
  });

  const removed = merges.reduce((sum, m) => sum + m.drop.length, 0);
  console.log(
    `\n${merges.length} food(s) affected, ${removed} row(s) would be removed.`,
  );

  if (!apply) {
    console.log('\nDry run. Re-run with --apply to write these changes.');
    return;
  }

  // Copy the collection first: this deletes rows, and the aggregate below is
  // the only cheap way back if a merge turns out to be wrong.
  const backup = `groceryItems_backup_${Date.now()}`;
  await items.aggregate([{ $match: {} }, { $out: backup }]).toArray();
  console.log(`\nBacked up ${unpurchased.length}+ rows to "${backup}".`);

  for (const { keep, drop, total } of merges) {
    await items.updateOne({ _id: keep._id }, { $set: { quantity: total } });
    await items.deleteMany({ _id: { $in: drop.map((r) => r._id) } });
  }

  console.log(`Merged. ${removed} row(s) removed.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => client.close());
