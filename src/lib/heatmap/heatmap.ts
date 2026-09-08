import {
  addDays,
  addMonths,
  compareDateKeys,
  endOfSundayWeek,
  localDateKey,
  startOfMondayWeek,
} from "./dates";
import type { DateKey, Heatmap, HeatmapDay, HeatmapWeek } from "./model";

export type EmptyHeatmapOptions = {
  now: Date;
  timeZone: string;
};

function daysBetween(start: DateKey, end: DateKey): number {
  let count = 0;
  for (
    let date = start;
    compareDateKeys(date, end) <= 0;
    date = addDays(date, 1)
  ) {
    count += 1;
  }
  return count;
}

export function buildEmptyHeatmap({
  now,
  timeZone,
}: EmptyHeatmapOptions): Heatmap {
  const today = localDateKey(now, timeZone);
  const requestedStart = addDays(addMonths(today, -12), 1);
  const start = startOfMondayWeek(requestedStart);
  const requestedEnd = today;
  const end = endOfSundayWeek(requestedEnd);
  const days: HeatmapDay[] = [];

  for (
    let date = start;
    compareDateKeys(date, end) <= 0;
    date = addDays(date, 1)
  ) {
    const isToday = date === today;
    days.push({
      date,
      status: isToday
        ? "pending"
        : compareDateKeys(date, today) > 0
          ? "future"
          : "gray",
      isToday,
    });
  }

  const weeks: HeatmapWeek[] = [];
  for (let index = 0; index < days.length; index += 7) {
    weeks.push({
      start: days[index].date,
      days: days.slice(index, index + 7),
    });
  }

  return {
    today,
    start,
    end,
    weeks,
  };
}

export function heatmapDayCount(heatmap: Heatmap): number {
  return daysBetween(heatmap.start, heatmap.end);
}
