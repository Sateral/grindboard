"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getDatabase } from "@/db";
import { users } from "@/db/schema";
import { getAuth } from "@/lib/auth";
import { getCurrentSession } from "@/lib/session";
import { isIANATimeZone } from "@/lib/timezone";

export async function signOutAction() {
  const session = await getCurrentSession();
  if (session) {
    // Revokes the session server-side. The nextCookies plugin applies the
    // Set-Cookie from Better Auth's response, so the session cookie is cleared
    // in the browser as well.
    await getAuth().api.signOut({ headers: await headers() });
  }
  redirect("/");
}

export async function updateTimezoneAction(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/");
  }

  const timezone = formData.get("timezone");
  if (typeof timezone !== "string" || !isIANATimeZone(timezone)) {
    throw new Error("Please choose a valid IANA time zone");
  }

  await getDatabase()
    .update(users)
    .set({ timezone })
    .where(eq(users.id, session.user.id));

  redirect("/settings");
}

export async function deleteAccountAction() {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/");
  }

  // Hard deletion: Better Auth removes the User, cascades to sessions and
  // provider accounts, and clears the session cookie (nextCookies plugin).
  // Application-owned rows reference users.id with ON DELETE CASCADE and go
  // with it once they exist.
  await getAuth().api.deleteUser({
    headers: await headers(),
    body: {},
  });

  redirect("/");
}
