import { useState } from 'react';
import PropTypes from 'prop-types';
import './PantryCalendar.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Local YYYY-MM-DD key so items land on the right calendar square.
function dateKey(date) {
  const d = new Date(date);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

// Month grid of shopping days: see at a glance what you bought when.
function PantryCalendar({ items, selectedDay, onSelectDay }) {
  const today = new Date();
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const todayKey = dateKey(today);
  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  // Bucket every dated item onto the day it was bought.
  const byDay = {};
  items.forEach((item) => {
    if (!item.purchaseDate) return;
    const key = dateKey(item.purchaseDate);
    (byDay[key] = byDay[key] || []).push(item);
  });

  const leadingBlanks = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Functional update: rapid clicks each read the latest month rather than
  // the one captured when this render ran, so none get dropped.
  const step = (delta) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  const undated = items.filter((i) => !i.purchaseDate).length;

  return (
    <div className="cal">
      <div className="cal-head">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => step(-1)}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2 className="cal-month">
          {MONTHS[month]} {year}
        </h2>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => step(1)}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="cal-grid cal-weekdays">
        {WEEKDAYS.map((d) => (
          <div key={d} className="cal-weekday">
            {d}
          </div>
        ))}
      </div>

      <div className="cal-grid">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`blank-${i}`} className="cal-cell is-blank" />;
          }
          const key = dateKey(new Date(year, month, day));
          const dayItems = byDay[key] || [];
          const classes = ['cal-cell'];
          if (key === todayKey) classes.push('is-today');
          if (key === selectedDay) classes.push('is-selected');
          if (dayItems.length) classes.push('has-items');

          return (
            <button
              type="button"
              key={key}
              className={classes.join(' ')}
              aria-pressed={key === selectedDay}
              aria-label={`${MONTHS[month]} ${day}, ${year}. ${
                dayItems.length
                  ? `${dayItems.length} item(s) bought`
                  : 'No items bought'
              }.`}
              onClick={() => onSelectDay(key === selectedDay ? null : key)}
            >
              {/* No aria-hidden here: the button's aria-label already
                  replaces its inner text for assistive technology, and
                  hiding visible content is flagged by auditing tools. */}
              <span className="cal-date">{day}</span>
              {dayItems.length > 0 && (
                <span className="cal-names">
                  {dayItems.slice(0, 2).map((it) => (
                    <span key={it._id} className="cal-chip">
                      {it.name}
                    </span>
                  ))}
                  {dayItems.length > 2 && (
                    <span className="cal-more">
                      +{dayItems.length - 2} more
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="cal-legend">
        <span className="cal-key has-items" /> Shopping day
        {undated > 0 && (
          <span className="cal-undated">{undated} item(s) with no date</span>
        )}
      </p>
    </div>
  );
}

PantryCalendar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      purchaseDate: PropTypes.string,
    }),
  ).isRequired,
  selectedDay: PropTypes.string,
  onSelectDay: PropTypes.func.isRequired,
};

PantryCalendar.defaultProps = {
  selectedDay: null,
};

export default PantryCalendar;
