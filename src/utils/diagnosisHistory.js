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

export function recentHistory(history, count = 6) {
  return (Array.isArray(history) ? history : [])
    .filter(
      (entry) =>
        entry && MONTHS.includes(entry.month) && Number.isInteger(entry.year),
    )
    .sort(
      (a, b) =>
        a.year - b.year || MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month),
    )
    .slice(-count);
}
