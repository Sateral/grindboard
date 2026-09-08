export type DateKey = `${number}-${number}-${number}`;

export type HeatmapDayStatus = "pending" | "gray" | "future";

export type HeatmapDay = {
  date: DateKey;
  status: HeatmapDayStatus;
  isToday: boolean;
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
