import { describe, expect, it } from "vitest";

import type { ActivityContribution } from "@/lib/activity/model";
import {
  addDays,
  endOfSundayWeek,
  localDateKey,
  startOfMondayWeek,
} from "./dates";
import { buildHeatmap, heatmapDayCount } from "./heatmap";
import type { DateKey } from "./model";
import { currentStreak } from "./streak";

const berlinTimeZone = "Europe/Berlin";

function day(date: string, time = "12:00:00Z") {
  return new Date(`${date}T${time}`);
}

function blue(date: DateKey, intensity = 1): ActivityContribution {
  return { date, color: "blue", intensity };
}

function yellow(date: DateKey, intensity = 1): ActivityContribution {
  return { date, color: "yellow", intensity };
}

function green(date: DateKey, intensity = 1): ActivityContribution {
  return { date, color: "green", intensity };
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

describe("buildHeatmap", () => {
  it("marks today Pending and elapsed days Gray", () => {
    const heatmap = buildHeatmap({
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
    const heatmap = buildHeatmap({
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
    const heatmap = buildHeatmap({
      now: day("2026-02-28", "23:00:00Z"),
      timeZone: "UTC",
    });

    expect(heatmapDayCount(heatmap)).toBe(371);
    expect(heatmap.start).toBe("2025-02-24");
    expect(heatmap.end).toBe("2026-03-01");
  });

  it("does not punish future days in the current week", () => {
    const heatmap = buildHeatmap({
      now: day("2026-09-08"),
      timeZone: "UTC",
    });

    const days = heatmap.weeks.flatMap((week) => week.days);
    expect(days.some((entry) => entry.status === "future")).toBe(true);
  });
});

describe("buildHeatmap with activity", () => {
  it("turns a recorded day Blue, and today stops being Pending", () => {
    const heatmap = buildHeatmap({
      now: day("2026-09-08"),
      timeZone: "UTC",
      activity: [blue("2026-09-08")],
    });

    const days = heatmap.weeks.flatMap((week) => week.days);
    expect(days.find((entry) => entry.date === "2026-09-08")).toMatchObject({
      status: "hit",
      color: "blue",
      intensity: 1,
      isToday: true,
    });
    expect(days.filter((entry) => entry.status === "pending")).toHaveLength(0);
  });

  it("sums same-day intensity and caps the display level at 4", () => {
    const heatmap = buildHeatmap({
      now: day("2026-09-08"),
      timeZone: "UTC",
      activity: [
        blue("2026-09-01", 1),
        blue("2026-09-01", 1),
        blue("2026-09-01", 1),
        blue("2026-09-01", 1),
        blue("2026-09-01", 1),
        blue("2026-09-01", 1),
      ],
    });

    const days = heatmap.weeks.flatMap((week) => week.days);
    expect(days.find((entry) => entry.date === "2026-09-01")).toMatchObject({
      status: "hit",
      color: "blue",
      intensity: 4,
    });
  });

  it("paints the strongest Activity: Blue over Yellow over Green", () => {
    const heatmap = buildHeatmap({
      now: day("2026-09-08"),
      timeZone: "UTC",
      activity: [
        blue("2026-09-01"),
        yellow("2026-09-01", 9),
        green("2026-09-01", 9),
        yellow("2026-09-02", 1),
        green("2026-09-02", 9),
      ],
    });

    const days = heatmap.weeks.flatMap((week) => week.days);
    expect(days.find((entry) => entry.date === "2026-09-01")).toMatchObject({
      status: "hit",
      color: "blue",
      intensity: 1,
    });
    expect(days.find((entry) => entry.date === "2026-09-02")).toMatchObject({
      status: "hit",
      color: "yellow",
      intensity: 1,
    });
  });

  it("leaves untouched elapsed days Gray", () => {
    const heatmap = buildHeatmap({
      now: day("2026-09-08"),
      timeZone: "UTC",
      activity: [blue("2026-09-08")],
    });

    const days = heatmap.weeks.flatMap((week) => week.days);
    expect(days.find((entry) => entry.date === "2026-09-07")).toMatchObject({
      status: "gray",
    });
  });
});

describe("currentStreak", () => {
  it("counts consecutive Hit-days ending today", () => {
    const today = "2026-09-08";
    const streak = currentStreak(
      new Set(["2026-09-06", "2026-09-07", "2026-09-08"]),
      today,
    );

    expect(streak).toBe(3);
  });

  it("counts through yesterday while today is still Pending", () => {
    const today = "2026-09-08";
    const streak = currentStreak(new Set(["2026-09-06", "2026-09-07"]), today);

    expect(streak).toBe(2);
  });

  it("resets to zero on a Gray day — no freeze", () => {
    const today = "2026-09-08";
    expect(currentStreak(new Set(["2026-09-05", "2026-09-06"]), today)).toBe(0);
  });

  it("never counts future days, and is zero without any Hit", () => {
    const today = "2026-09-08";
    expect(currentStreak(new Set(["2026-09-09", "2026-09-10"]), today)).toBe(0);
    expect(currentStreak(new Set(), today)).toBe(0);
  });
});
