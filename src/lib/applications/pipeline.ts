/**
 * The fixed Pipeline sequence: Saved → Applied → OA → Interview → Offer or
 * Rejected. Kept free of database imports so client components can share the
 * vocabulary with the Drizzle schema.
 */
export const pipelineStatuses = [
  "saved",
  "applied",
  "oa",
  "interview",
  "offer",
  "rejected",
] as const;

export type PipelineStatus = (typeof pipelineStatuses)[number];

export const pipelineStatusLabels: Record<PipelineStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  oa: "OA",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

/** Form and action input are untrusted until this passes. */
export function isPipelineStatus(value: unknown): value is PipelineStatus {
  return (
    typeof value === "string" &&
    (pipelineStatuses as readonly string[]).includes(value)
  );
}
