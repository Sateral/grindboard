"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getDatabase } from "@/db";
import { applications } from "@/db/schema";
import {
  isPipelineStatus,
  type PipelineStatus,
} from "@/lib/applications/pipeline";
import { isDateKey } from "@/lib/heatmap/dates";
import { getCurrentSession } from "@/lib/session";

export type QuickAddApplicationState = { error?: string };

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Trimmed field text, or null when the field is absent or blank. */
function optionalField(formData: FormData, field: string): string | null {
  const value = formData.get(field);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function parseUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

/** A Deadline is a plain calendar date, keyed like DateKey (YYYY-MM-DD). */
function parseDeadline(raw: string): string | null {
  return isDateKey(raw) ? raw : null;
}

function parsePipelineStatus(formData: FormData): PipelineStatus | null {
  const value = formData.get("status") ?? "saved";
  return isPipelineStatus(value) ? value : null;
}

export async function createApplicationAction(
  _previousState: QuickAddApplicationState,
  formData: FormData,
): Promise<QuickAddApplicationState> {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/");
  }

  const company = optionalField(formData, "company");
  const role = optionalField(formData, "role");
  const urlRaw = optionalField(formData, "url");
  const deadlineRaw = optionalField(formData, "deadline");
  const status = parsePipelineStatus(formData);

  if (company === null || role === null) {
    return { error: "Company and role are required." };
  }
  const url = urlRaw === null ? null : parseUrl(urlRaw);
  if (urlRaw !== null && url === null) {
    return { error: "The URL must be a valid http(s) link." };
  }
  const deadline = deadlineRaw === null ? null : parseDeadline(deadlineRaw);
  if (deadlineRaw !== null && deadline === null) {
    return { error: "The deadline must be a date (YYYY-MM-DD)." };
  }
  if (status === null) {
    return { error: "Please choose a valid Pipeline status." };
  }

  await getDatabase().insert(applications).values({
    userId: session.user.id,
    company,
    role,
    url,
    status,
    deadline,
  });

  revalidatePath("/board");
  return {};
}

export async function updateApplicationStatusAction(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/");
  }

  const id = formData.get("id");
  const status = parsePipelineStatus(formData);
  if (typeof id !== "string" || !uuidPattern.test(id) || status === null) {
    return;
  }

  // The User-id condition keeps the mutation scoped to the owner even for a
  // direct POST with a foreign application id.
  await getDatabase()
    .update(applications)
    .set({ status })
    .where(
      and(eq(applications.id, id), eq(applications.userId, session.user.id)),
    );

  revalidatePath("/board");
}
