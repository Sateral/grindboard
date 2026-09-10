import { addDays } from "./dates";
import type { DateKey } from "./model";

/**
 * Consecutive Hit-days ending today — or yesterday, when today is still
 * Pending. One Gray day resets the Streak to zero; there is no freeze.
 */
export function currentStreak(
  hitDays: ReadonlySet<DateKey>,
  today: DateKey,
): number {
  let cursor = today;
  if (!hitDays.has(cursor)) {
    cursor = addDays(today, -1);
  }

  let streak = 0;
  for (; hitDays.has(cursor); cursor = addDays(cursor, -1)) {
    streak += 1;
  }

  return streak;
}
