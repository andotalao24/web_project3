// Shopping days are calendar dates, not instants.
//
// Passing "2026-08-10" to new Date() reads it as midnight UTC, which then
// renders as the 9th anywhere west of Greenwich — the item lands on the wrong
// calendar square. Nothing here ever converts between zones: a day is the
// YYYY-MM-DD string the user picked, from the form to the grid to the list.

// The day an item belongs to, tolerant of the ISO timestamps older records
// were stored with.
export function toDayKey(value) {
  if (!value) return null;
  const raw = value instanceof Date ? value.toISOString() : String(value);
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(raw);
  return match ? match[1] : null;
}

// A day key as a local Date, safe to format. Building it from parts keeps it
// on the intended day instead of shifting it by the UTC offset.
export function toLocalDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// How a day is shown to the reader.
export function formatDay(value, fallback = 'No date') {
  const key = toDayKey(value);
  return key ? toLocalDate(key).toLocaleDateString() : fallback;
}
