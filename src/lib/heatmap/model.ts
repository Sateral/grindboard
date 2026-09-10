import type { ActivityColor } from "@/lib/activity/model";

export type DateKey = `${number}-${number}-${number}`;

export type HeatmapDayStatus = "pending" | "gray" | "future" | "hit";

/**
 * A Heatmap square. Only a Hit carries the day's strongest Activity color
 * and its display intensity (1–4).
 */
export type HeatmapDay =
  | {
      date: DateKey;
      status: "pending" | "gray" | "future";
      isToday: boolean;
    }
  | {
      date: DateKey;
      status: "hit";
      isToday: boolean;
      color: ActivityColor;
      intensity: 1 | 2 | 3 | 4;
    };

export type HeatmapWeek = {
  start: DateKey;
  days: HeatmapDay[];
};

export type Heatmap = {
  today: DateKey;
  start: DateKey;
  end: DateKey;
  weeks: HeatmapWeek[];
};
