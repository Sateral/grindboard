import type { ActivityContribution } from "@/lib/activity/model";
import { localDateKey } from "@/lib/heatmap/dates";

/**
 * Every create or update of an Application row is Job-app activity — there is
 * no manual ritual. Both timestamps are attributed to the User's local day:
 * the entry day for the create, and the day of any later update for itself.
 * A same-instant create/update pair (an insert) counts once.
 */
export function applicationActivityContributions(
  applications: ReadonlyArray<{ createdAt: Date; updatedAt: Date }>,
  timeZone: string,
): ActivityContribution[] {
  const contributions: ActivityContribution[] = [];

  for (const application of applications) {
    contributions.push({
      date: localDateKey(application.createdAt, timeZone),
      color: "blue",
      intensity: 1,
    });

    if (application.updatedAt.getTime() !== application.createdAt.getTime()) {
      contributions.push({
        date: localDateKey(application.updatedAt, timeZone),
        color: "blue",
        intensity: 1,
      });
    }
  }

  return contributions;
}
