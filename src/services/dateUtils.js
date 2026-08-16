/**
 * All dates are stored and compared as ISO date strings (YYYY-MM-DD) in the
 * device's local timezone. Keeping everything as plain strings avoids
 * timezone bugs that come from comparing Date objects across day boundaries,
 * and makes the persisted data trivially serializable to AsyncStorage.
 */

export function todayISO() {
  return toISODate(new Date());
}

export function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(isoDate, delta) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return toISODate(date);
}

export function isToday(isoDate) {
  return isoDate === todayISO();
}

/**
 * Calculate the current streak (consecutive days completed, counting
 * backward from today). If today isn't completed yet, we still count
 * backward from yesterday so the streak doesn't drop to 0 just because
 * the user hasn't checked in yet today.
 *
 * @param {string[]} completions - array of ISO date strings
 * @returns {number} current streak length
 */
export function calculateStreak(completions) {
  if (!completions || completions.length === 0) return 0;

  const completedSet = new Set(completions);
  const startDate = completedSet.has(todayISO())
    ? todayISO()
    : addDays(todayISO(), -1);

  let streak = 0;
  let cursor = startDate;

  while (completedSet.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

/**
 * Longest streak ever achieved, scanning the full completion history.
 * @param {string[]} completions - array of ISO date strings
 */
export function calculateLongestStreak(completions) {
  if (!completions || completions.length === 0) return 0;

  const sorted = [...completions].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (addDays(sorted[i - 1], 1) === sorted[i]) {
      current += 1;
      longest = Math.max(longest, current);
    } else if (sorted[i - 1] !== sorted[i]) {
      current = 1;
    }
  }

  return longest;
}

/**
 * Returns the last N days as ISO date strings, oldest first, for rendering
 * a small calendar strip / history view.
 */
export function lastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    days.push(addDays(todayISO(), -i));
  }
  return days;
}
