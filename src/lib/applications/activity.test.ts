import { describe, expect, it } from "vitest";

import { applicationActivityContributions } from "./activity";

const berlinTimeZone = "Europe/Berlin";

describe("applicationActivityContributions", () => {
  it("attributes the entry day in the User's timezone, not the server's", () => {
    const createdAt = new Date("2026-09-08T22:58:00Z");

    const contributions = applicationActivityContributions(
      [{ createdAt, updatedAt: createdAt }],
      berlinTimeZone,
    );

    expect(contributions).toEqual([
      { date: "2026-09-09", color: "blue", intensity: 1 },
    ]);
  });

  it("attributes to the previous local day for a User further west", () => {
    const createdAt = new Date("2026-09-08T22:58:00Z");

    const contributions = applicationActivityContributions(
      [{ createdAt, updatedAt: createdAt }],
      "America/Los_Angeles",
    );

    expect(contributions).toEqual([
      { date: "2026-09-08", color: "blue", intensity: 1 },
    ]);
  });

  it("counts an update on a later day for that day, not the entry day", () => {
    const contributions = applicationActivityContributions(
      [
        {
          createdAt: new Date("2026-09-01T10:00:00Z"),
          updatedAt: new Date("2026-09-08T22:58:00Z"),
        },
      ],
      berlinTimeZone,
    );

    expect(contributions).toEqual([
      { date: "2026-09-01", color: "blue", intensity: 1 },
      { date: "2026-09-09", color: "blue", intensity: 1 },
    ]);
  });

  it("counts a same-day update as a second Hit-weight on that day", () => {
    const contributions = applicationActivityContributions(
      [
        {
          createdAt: new Date("2026-09-08T09:00:00Z"),
          updatedAt: new Date("2026-09-08T18:00:00Z"),
        },
      ],
      "UTC",
    );

    expect(contributions).toEqual([
      { date: "2026-09-08", color: "blue", intensity: 1 },
      { date: "2026-09-08", color: "blue", intensity: 1 },
    ]);
  });

  it("accumulates across applications on the same day", () => {
    const createdAt = new Date("2026-09-08T10:00:00Z");

    const contributions = applicationActivityContributions(
      [
        { createdAt, updatedAt: createdAt },
        { createdAt, updatedAt: createdAt },
        { createdAt, updatedAt: createdAt },
      ],
      "UTC",
    );

    expect(contributions).toHaveLength(3);
    expect(contributions.every((entry) => entry.date === "2026-09-08")).toBe(
      true,
    );
  });
});
