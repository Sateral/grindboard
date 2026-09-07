import { headers } from "next/headers";

import { type GrindboardSession, getAuth } from "@/lib/auth";

/** The active session, or null when the visitor is signed out. */
export async function getCurrentSession(): Promise<GrindboardSession> {
  return getAuth().api.getSession({ headers: await headers() });
}
