import type { DateKey } from "./model";

const dateKeyPattern = /^\d{4}-\d{2}-\d{2}$/;

export function isDateKey(value: string): value is DateKey {
  return dateKeyPattern.test(value);
}

export function dateKeyFromParts(
  year: number,
  month: number,
  day: number,
): DateKey {
  const key = [year, month, day]
    .map((part, index) =>
      index === 0
        ? String(part).padStart(4, "0")
        : String(part).padStart(2, "0"),
    )
    .join("-");

  if (!isDateKey(key)) {
    throw new Error(`Invalid date key: ${key}`);
  }

  return key;
}

export function localDateKey(date: Date, timeZone: string): DateKey {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = new Map(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return dateKeyFromParts(
    Number(values.get("year")),
    Number(values.get("month")),
    Number(values.get("day")),
  );
}

function toUtcDate(date: DateKey): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function fromUtcDate(date: Date): DateKey {
  return dateKeyFromParts(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  );
}

export function addDays(date: DateKey, amount: number): DateKey {
  const result = toUtcDate(date);
  result.setUTCDate(result.getUTCDate() + amount);
  return fromUtcDate(result);
}

export function addMonths(date: DateKey, amount: number): DateKey {
  const result = toUtcDate(date);
  const originalDay = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + amount);
  const lastDay = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();
  result.setUTCDate(Math.min(originalDay, lastDay));
  return fromUtcDate(result);
}

export function weekday(date: DateKey): number {
  return toUtcDate(date).getUTCDay();
}

export function startOfMondayWeek(date: DateKey): DateKey {
  const sundayBasedDay = weekday(date);
  const daysSinceMonday = (sundayBasedDay + 6) % 7;
  return addDays(date, -daysSinceMonday);
}

export function endOfSundayWeek(date: DateKey): DateKey {
  return addDays(startOfMondayWeek(date), 6);
}

export function compareDateKeys(left: DateKey, right: DateKey): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
