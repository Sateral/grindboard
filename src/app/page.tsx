import {
  ArrowUpRight,
  Braces,
  BriefcaseBusiness,
  GitCommit,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const activityColors = {
  application: "bg-[#57a6ff]",
  leetcode: "bg-[#f5c451]",
  commit: "bg-[#7ee787]",
} as const;

const previewCells = Array.from({ length: 91 }, (_, index) => {
  let color = "bg-white/[0.055]";
  if ([12, 13, 28, 44, 45, 72].includes(index)) color = activityColors.commit;
  if ([20, 37, 60, 61].includes(index)) color = activityColors.leetcode;
  if ([29, 52, 75].includes(index)) color = activityColors.application;

  return { id: `preview-${index}`, color };
});

const activityLegend = [
  {
    label: "Applications",
    color: activityColors.application,
    icon: BriefcaseBusiness,
  },
  { label: "LeetCode solves", color: activityColors.leetcode, icon: Braces },
  { label: "Counted commits", color: activityColors.commit, icon: GitCommit },
];

export default function Home() {
  return (
    <main className="relative isolate min-h-svh overflow-hidden px-5 py-5 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_80%_0%,rgba(126,231,135,0.14),transparent_48%)]" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-white/10 pb-5">
        <a
          className="flex items-center gap-3 font-mono text-sm font-semibold tracking-[0.2em] uppercase"
          href="#top"
        >
          <span className="grid size-8 place-items-center border border-[#7ee787]/70 bg-[#7ee787]/10 text-[#7ee787]">
            G
          </span>
          Grindboard
        </a>
        <Badge
          variant="outline"
          className="border-white/15 bg-white/[0.03] font-mono text-[0.65rem] tracking-[0.18em] text-white/60 uppercase"
        >
          Foundation online
        </Badge>
      </nav>

      <section
        id="top"
        className="mx-auto grid min-h-[calc(100svh-6rem)] max-w-7xl items-center gap-14 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-20"
      >
        <div className="max-w-2xl">
          <p className="mb-5 font-mono text-xs font-medium tracking-[0.22em] text-[#7ee787] uppercase">
            Job hunt telemetry / 2026
          </p>
          <h1 className="text-balance text-5xl leading-[0.92] font-semibold tracking-[-0.055em] sm:text-7xl lg:text-[6.5rem]">
            The work
            <span className="block text-white/35">leaves a mark.</span>
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-white/55 sm:text-lg">
            Applications, LeetCode solves, and Counted commits on one board.
            Every day is visible. Every gap stays visible.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-11 rounded-none bg-[#7ee787] px-5 text-black hover:bg-[#9af0a0]"
            >
              <a href="#foundation">
                Inspect foundation <ArrowUpRight data-icon="inline-end" />
              </a>
            </Button>
            <span className="font-mono text-[0.7rem] tracking-[0.14em] text-white/35 uppercase">
              Next: identity + timezone
            </span>
          </div>
        </div>

        <Card
          id="foundation"
          className="overflow-hidden rounded-none border-white/10 bg-[#111411]/90 py-0 shadow-2xl shadow-black/40"
        >
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="font-mono text-[0.65rem] tracking-[0.18em] text-white/35 uppercase">
                  Heatmap preview
                </p>
                <p className="mt-1 text-sm text-white/70">
                  A preview of the system to come
                </p>
              </div>
              <span className="size-2 animate-pulse rounded-full bg-[#7ee787] shadow-[0_0_16px_#7ee787]" />
            </div>

            <div className="p-5 sm:p-7">
              <div
                className="grid grid-flow-col grid-rows-7 gap-1.5"
                aria-label="Heatmap preview"
                role="img"
              >
                {previewCells.map((cell) => (
                  <span
                    key={cell.id}
                    className={`aspect-square min-w-0 rounded-[2px] ${cell.color}`}
                  />
                ))}
              </div>

              <div className="mt-7 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3">
                {activityLegend.map(({ label, color, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 bg-[#111411] px-4 py-3.5"
                  >
                    <Icon className="size-4 text-white/40" />
                    <span className="text-sm text-white/65">{label}</span>
                    <span className={`ml-auto size-2 rounded-[2px] ${color}`} />
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-dashed border-white/10 pt-5 font-mono text-[0.65rem] tracking-[0.12em] uppercase">
                <span className="text-white/30">System status</span>
                <span className="text-[#7ee787]">Shell ready</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
