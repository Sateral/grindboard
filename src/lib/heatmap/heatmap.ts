import {
  type ActivityColor,
  type ActivityContribution,
  activityPrecedence,
} from "@/lib/activity/model";

import {
  addDays,
  addMonths,
  compareDateKeys,
  endOfSundayWeek,
  localDateKey,
  startOfMondayWeek,
} from "./dates";
import type { DateKey, Heatmap, HeatmapDay, HeatmapWeek } from "./model";

export type HeatmapOptions = {
  now: Date;
  timeZone: string;
  /** Recorded Activity; without it every elapsed day stays Gray. */
  activity?: Iterable<ActivityContribution>;
};

/** Display levels for Heatmap cells; weights above the ceiling cap at 4. */
const intensityCeiling = 4;

function groupByDate(
  activity: Iterable<ActivityContribution>,
): Map<DateKey, ActivityContribution[]> {
  const byDate = new Map<DateKey, ActivityContribution[]>();
  for (const contribution of activity) {
    const entries = byDate.get(contribution.date);
    if (entries) {
      entries.push(contribution);
    } else {
      byDate.set(contribution.date, [contribution]);
    }
  }
  return byDate;
}

/**
 * A day takes the color of its strongest Activity; the intensity is the sum
 * of the winning color's weights, capped at the display ceiling.
 */
function dayActivity(
  entries: ActivityContribution[] | undefined,
): { color: ActivityColor; intensity: number } | null {
  if (!entries || entries.length === 0) {
    return null;
  }

  let color = entries[0].color;
  for (const entry of entries) {
    if (activityPrecedence[entry.color] > activityPrecedence[color]) {
      color = entry.color;
    }
  }

  let intensity = 0;
  for (const entry of entries) {
    if (entry.color === color) {
      intensity += entry.intensity;
    }
  }

  return {
    color,
    intensity: Math.min(intensityCeiling, Math.max(1, intensity)),
  };
}

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

export function buildHeatmap({
  now,
  timeZone,
  activity,
}: HeatmapOptions): Heatmap {
  const byDate = groupByDate(activity ?? []);
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
    if (compareDateKeys(date, today) > 0) {
      days.push({ date, status: "future", isToday });
      continue;
    }

    const hit = dayActivity(byDate.get(date));
    if (hit) {
      days.push({
        date,
        status: "hit",
        isToday,
        color: hit.color,
        intensity: hit.intensity as 1 | 2 | 3 | 4,
      });
      continue;
    }

    days.push({ date, status: isToday ? "pending" : "gray", isToday });
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
