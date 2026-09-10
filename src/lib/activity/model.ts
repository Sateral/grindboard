import type { DateKey } from "@/lib/heatmap/model";

/**
 * The three Activity kinds, named by their Heatmap color: Blue for job-app
 * activity, Yellow for LeetCode solves, Green for Counted commits.
 */
export type ActivityColor = "blue" | "yellow" | "green";

/**
 * Blue > Yellow > Green: a day takes the color of its strongest Activity.
 * Blue outranks Yellow when both occur, and Yellow outranks Green.
 */
export const activityPrecedence: Record<ActivityColor, number> = {
  blue: 3,
  yellow: 2,
  green: 1,
};

/**
 * One Activity recorded on one calendar day. The engine folds contributions
 * per day: the winning color comes from precedence, the day's intensity from
 * the sum of same-color weights.
 */
export type ActivityContribution = {
  date: DateKey;
  color: ActivityColor;
  /** Raw weight the contributing Activity assigns (events, solves, commits). */
  intensity: number;
};
