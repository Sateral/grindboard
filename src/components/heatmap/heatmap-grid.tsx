import type { Heatmap, HeatmapDayStatus } from "@/lib/heatmap/model";

const statusStyles: Record<HeatmapDayStatus, string> = {
  pending: "border border-[#e7e7df] bg-[#e7e7df]/10",
  gray: "bg-[#2c2e29]",
  future: "bg-transparent",
};

const statusLabels: Record<HeatmapDayStatus, string> = {
  pending: "Pending day",
  gray: "Gray day",
  future: "Future day",
};

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
                aria-label={`${readableDate(cell.date)}: ${statusLabels[cell.status]}`}
                className={`size-3 rounded-[2px] ${statusStyles[cell.status]}`}
                key={cell.date}
                role="img"
                title={`${readableDate(cell.date)} · ${statusLabels[cell.status]}`}
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
    ["pending", "Pending"],
    ["gray", "No activity"],
  ] as const;

  return (
    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-[#979793]">
      {items.map(([status, label]) => (
        <span className="inline-flex items-center gap-2" key={status}>
          <span
            aria-hidden="true"
            className={`size-3 rounded-[2px] ${statusStyles[status]}`}
          />
          {label}
        </span>
      ))}
    </div>
  );
}
