import { describe, expect, it } from "vitest";

import {
  addDays,
  endOfSundayWeek,
  localDateKey,
  startOfMondayWeek,
} from "./dates";
import { buildEmptyHeatmap, heatmapDayCount } from "./heatmap";

const berlinTimeZone = "Europe/Berlin";

function day(date: string, time = "12:00:00Z") {
  return new Date(`${date}T${time}`);
}

describe("timezone-aware date utilities", () => {
  it("uses the user's local date rather than the server date", () => {
    const instant = day("2026-09-08", "22:58:00Z");

    expect(localDateKey(instant, berlinTimeZone)).toBe("2026-09-09");
    expect(localDateKey(instant, "America/Los_Angeles")).toBe("2026-09-08");
  });

  it("handles calendar-day arithmetic without using the server timezone", () => {
    expect(addDays("2026-03-29", 1)).toBe("2026-03-30");
    expect(startOfMondayWeek("2026-09-09")).toBe("2026-09-07");
    expect(endOfSundayWeek("2026-09-09")).toBe("2026-09-13");
  });
});

describe("buildEmptyHeatmap", () => {
  it("marks today Pending and elapsed days Gray", () => {
    const heatmap = buildEmptyHeatmap({
      now: day("2026-09-08", "22:58:00Z"),
      timeZone: berlinTimeZone,
    });

    expect(heatmap.today).toBe("2026-09-09");
    const days = heatmap.weeks.flatMap((week) => week.days);
    expect(days.find((entry) => entry.isToday)).toMatchObject({
      date: "2026-09-09",
      status: "pending",
    });
    expect(days.some((entry) => entry.status === "gray")).toBe(true);
    expect(days.filter((entry) => entry.status === "pending")).toHaveLength(1);
  });

  it("aligns every rendered week from Monday through Sunday", () => {
    const heatmap = buildEmptyHeatmap({
      now: day("2026-09-08"),
      timeZone: "UTC",
    });

    expect(heatmap.weeks.length).toBeGreaterThanOrEqual(52);
    expect(heatmap.weeks.every((week) => week.days)).toBe(true);
    expect(heatmap.weeks.every((week) => week.days).valueOf()).toBe(true);
    expect(heatmap.weeks[0].days).toHaveLength(7);
    expect(heatmap.weeks.at(-1)?.days).toHaveLength(7);
    expect(heatmap.weeks[0].start).toBe("2025-09-08");
    expect(heatmap.weeks.at(-1)?.days.at(-1)?.date).toBe("2026-09-13");
  });

  it("covers the requested trailing year plus only week-alignment padding", () => {
    const heatmap = buildEmptyHeatmap({
      now: day("2026-02-28", "23:00:00Z"),
      timeZone: "UTC",
    });

    expect(heatmapDayCount(heatmap)).toBe(371);
    expect(heatmap.start).toBe("2025-02-24");
    expect(heatmap.end).toBe("2026-03-01");
  });

  it("does not punish future days in the current week", () => {
    const heatmap = buildEmptyHeatmap({
      now: day("2026-09-08"),
      timeZone: "UTC",
    });

    const days = heatmap.weeks.flatMap((week) => week.days);
    expect(days.some((entry) => entry.status === "future")).toBe(true);
  });
});
