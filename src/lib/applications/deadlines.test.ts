import { describe, expect, it } from "vitest";

import { localDateKey } from "@/lib/heatmap/dates";

import { deadlineWindowDays, upcomingDeadlines } from "./deadlines";

const berlinTimeZone = "Europe/Berlin";

function application(
  overrides: Partial<Parameters<typeof upcomingDeadlines>[0][number]> = {},
) {
  return {
    id: overrides.id ?? "app-1",
    company: overrides.company ?? "Linear",
    role: overrides.role ?? "Product engineer",
    status: overrides.status ?? ("applied" as const),
    deadline: overrides.deadline ?? null,
  };
}

describe("upcomingDeadlines", () => {
  it("includes a deadline due today", () => {
    const items = upcomingDeadlines(
      [application({ deadline: "2026-09-10" })],
      "2026-09-10",
    );

    expect(items).toHaveLength(1);
    expect(items[0].daysUntil).toBe(0);
    expect(items[0].deadline).toBe("2026-09-10");
  });

  it("spans seven calendar days including today, not beyond", () => {
    const lastInWindow = `2026-09-${
      10 + deadlineWindowDays - 1
    }` as `${number}-${number}-${number}`;

    const items = upcomingDeadlines(
      [
        application({ id: "in-window", deadline: lastInWindow }),
        application({ id: "out-of-window", deadline: "2026-09-18" }),
      ],
      "2026-09-10",
    );

    expect(items.map((item) => item.id)).toEqual(["in-window"]);
  });

  it("excludes past-due Applications", () => {
    const items = upcomingDeadlines(
      [application({ deadline: "2026-09-09" })],
      "2026-09-10",
    );

    expect(items).toEqual([]);
  });

  it("excludes empty Deadlines", () => {
    const items = upcomingDeadlines(
      [application({ deadline: null })],
      "2026-09-10",
    );

    expect(items).toEqual([]);
  });

  it("sorts by deadline date, not insertion order", () => {
    const items = upcomingDeadlines(
      [
        application({ id: "later", company: "Vercel", deadline: "2026-09-14" }),
        application({
          id: "sooner",
          company: "Anthropic",
          deadline: "2026-09-11",
        }),
      ],
      "2026-09-10",
    );

    expect(items.map((item) => item.id)).toEqual(["sooner", "later"]);
  });

  it("breaks date ties by company name", () => {
    const items = upcomingDeadlines(
      [
        application({
          id: "second",
          company: "Vercel",
          deadline: "2026-09-11",
        }),
        application({
          id: "first",
          company: "Anthropic",
          deadline: "2026-09-11",
        }),
      ],
      "2026-09-10",
    );

    expect(items.map((item) => item.id)).toEqual(["first", "second"]);
  });

  it("anchors the window on the User's local today, not the server's", () => {
    // 2026-09-10 23:00 UTC is already 2026-09-11 in Berlin: for the User the
    // 09-10 deadline has passed, even though the server's UTC day says today.
    const today = localDateKey(
      new Date("2026-09-10T23:00:00Z"),
      berlinTimeZone,
    );

    const items = upcomingDeadlines(
      [
        application({ id: "expired", deadline: "2026-09-10" }),
        application({ id: "due-now", deadline: today }),
      ],
      today,
    );

    expect(today).toBe("2026-09-11");
    expect(items.map((item) => item.id)).toEqual(["due-now"]);
  });

  it("returns an empty list when nothing is due", () => {
    const items = upcomingDeadlines([], "2026-09-10");

    expect(items).toEqual([]);
  });
});
