import type { ActivityColor } from "@/lib/activity/model";
import type {
  Heatmap,
  HeatmapDay,
  HeatmapDayStatus,
} from "@/lib/heatmap/model";

const statusStyles: Record<Exclude<HeatmapDayStatus, "hit">, string> = {
  pending: "border border-[#e7e7df] bg-[#e7e7df]/10",
  gray: "bg-[#2c2e29]",
  future: "bg-transparent",
};

// Intensity levels 1–4, from the day's summed Activity weight. Activity
// colors stay desaturated and vary in opacity, never electric.
const hitStyles: Record<ActivityColor, Record<1 | 2 | 3 | 4, string>> = {
  blue: {
    1: "bg-[#6799bc]/40",
    2: "bg-[#6799bc]/60",
    3: "bg-[#6799bc]/80",
    4: "bg-[#6799bc]",
  },
  yellow: {
    1: "bg-[#c1aa67]/40",
    2: "bg-[#c1aa67]/60",
    3: "bg-[#c1aa67]/80",
    4: "bg-[#c1aa67]",
  },
  green: {
    1: "bg-[#729c83]/40",
    2: "bg-[#729c83]/60",
    3: "bg-[#729c83]/80",
    4: "bg-[#729c83]",
  },
};

const statusLabels: Record<Exclude<HeatmapDayStatus, "hit">, string> = {
  pending: "Pending day",
  gray: "Gray day",
  future: "Future day",
};

const colorLabels: Record<ActivityColor, string> = {
  blue: "Application day",
  yellow: "LeetCode day",
  green: "Commit day",
};

function dayStyle(day: HeatmapDay): string {
  if (day.status === "hit") {
    return hitStyles[day.color][day.intensity];
  }
  return statusStyles[day.status];
}

function dayLabel(day: HeatmapDay): string {
  if (day.status === "hit") {
    return colorLabels[day.color];
  }
  return statusLabels[day.status];
}

const weekdays = [
  ["M", "Monday"],
  ["T", "Tuesday"],
  ["W", "Wednesday"],
  ["T", "Thursday"],
  ["F", "Friday"],
  ["S", "Saturday"],
  ["S", "Sunday"],
] as const;

function readableDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function HeatmapGrid({ heatmap }: { heatmap: Heatmap }) {
  const columns = heatmap.weeks.length;
  const cells = heatmap.weeks.flatMap((week) => week.days);

  return (
    <div className="overflow-x-auto pb-2">
      <p className="sr-only">
        Heatmap from {readableDate(heatmap.start)} to{" "}
        {readableDate(heatmap.end)}. Each square is labeled with its date and
        status.
      </p>
      <div className="min-w-max">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-[#979793]">
          <span>{columns} weeks</span>
          <span>{readableDate(heatmap.today)}</span>
        </div>
        <div className="grid grid-cols-[16px_1fr] gap-2">
          <div
            aria-hidden="true"
            className="grid grid-rows-7 gap-1 pt-0.5 font-mono text-[9px] leading-3 text-[#979793]"
          >
            {weekdays.map(([shortName, name]) => (
              <span key={name} title={name}>
                {shortName}
              </span>
            ))}
          </div>
          <div
            className="grid grid-rows-7 grid-flow-col gap-1"
            style={{ gridTemplateColumns: `repeat(${columns}, 12px)` }}
          >
            {cells.map((cell) => (
              <div
                aria-label={`${readableDate(cell.date)}: ${dayLabel(cell)}`}
                className={`size-3 rounded-[2px] ${dayStyle(cell)}`}
                key={cell.date}
                role="img"
                title={`${readableDate(cell.date)} · ${dayLabel(cell)}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeatmapLegend() {
  const items = [
    { className: hitStyles.blue[2], label: "Application" },
    { className: statusStyles.pending, label: "Pending" },
    { className: statusStyles.gray, label: "No activity" },
  ];

  return (
    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-[#979793]">
      {items.map((item) => (
        <span className="inline-flex items-center gap-2" key={item.label}>
          <span
            aria-hidden="true"
            className={`size-3 rounded-[2px] ${item.className}`}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}
