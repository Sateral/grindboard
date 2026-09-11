import { addDays, compareDateKeys, isDateKey } from "@/lib/heatmap/dates";
import type { DateKey } from "@/lib/heatmap/model";

import type { PipelineStatus } from "./pipeline";

/**
 * The panel's reach: a Deadline due today or in the following six days —
 * seven calendar days including today. Anything already past is the User's
 * to know about elsewhere; anything further out is not urgent yet.
 */
export const deadlineWindowDays = 7;

/** The slice of an Application the panel needs. */
export type DeadlineInput = {
  id: string;
  company: string;
  role: string;
  status: PipelineStatus;
  /** Plain calendar date (YYYY-MM-DD); null when the User left it empty. */
  deadline: string | null;
};

export type DeadlineItem = {
  id: string;
  company: string;
  role: string;
  status: PipelineStatus;
  deadline: DateKey;
  /** Days from the User's today until the deadline; 0 means due today. */
  daysUntil: number;
};

function daysUntilDate(today: DateKey, deadline: DateKey): number {
  let days = 0;
  for (
    let date = today;
    compareDateKeys(date, deadline) < 0;
    date = addDays(date, 1)
  ) {
    days += 1;
  }
  return days;
}

/**
 * Applications with a Deadline inside the next {@link deadlineWindowDays}
 * days, sorted by date (ties break by company, then role). The window
 * anchors on `today` — the User's local day, derived from their timezone
 * upstream — so "due tomorrow" means tomorrow for them, not for the server.
 * Past-due and more-than-a-week-out Applications never appear.
 */
export function upcomingDeadlines(
  applications: ReadonlyArray<DeadlineInput>,
  today: DateKey,
): DeadlineItem[] {
  const lastDay = addDays(today, deadlineWindowDays - 1);
  const items: DeadlineItem[] = [];

  for (const application of applications) {
    const deadline = application.deadline;
    if (!deadline || !isDateKey(deadline)) {
      continue;
    }
    if (
      compareDateKeys(deadline, today) < 0 ||
      compareDateKeys(deadline, lastDay) > 0
    ) {
      continue;
    }

    items.push({
      id: application.id,
      company: application.company,
      role: application.role,
      status: application.status,
      deadline,
      daysUntil: daysUntilDate(today, deadline),
    });
  }

  return items.sort(
    (left, right) =>
      compareDateKeys(left.deadline, right.deadline) ||
      left.company.localeCompare(right.company) ||
      left.role.localeCompare(right.role),
  );
}
