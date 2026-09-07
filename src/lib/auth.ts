import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { getOAuthState } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { eq } from "drizzle-orm";

import { getDatabase } from "@/db";
import { accounts, sessions, users, verifications } from "@/db/schema";
import { isIANATimeZone } from "@/lib/timezone";
import {
  decryptToken,
  encryptToken,
  isEncryptedToken,
} from "@/lib/token-crypto";

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const secret = process.env.BETTER_AUTH_SECRET;

/**
 * Backfills users.github_username from the GitHub API when an account links
 * GitHub without one. Provider profile mapping only fires on user creation;
 * linking GitHub onto an existing (Google-first) User needs this explicit
 * sync so Settings can name the account and ingestion knows its identity.
 */
async function syncGithubUsername(userId: string, encryptedToken: string) {
  const db = getDatabase();
  const [existing] = await db
    .select({ githubUsername: users.githubUsername })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (existing?.githubUsername) {
    return;
  }

  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${decryptToken(encryptedToken)}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "Grindboard",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    return;
  }

  const profile = (await response.json()) as { login?: string };
  if (profile.login) {
    await db
      .update(users)
      .set({ githubUsername: profile.login })
      .where(eq(users.id, userId));
  }
}

function createAuth() {
  if (!secret) {
    throw new Error(
      "BETTER_AUTH_SECRET is not set. Generate one with `npx @better-auth/cli secret`.",
    );
  }

  return betterAuth({
    appName: "Grindboard",
    baseURL: process.env.BETTER_AUTH_URL,
    secret,
    database: drizzleAdapter(getDatabase(), {
      provider: "pg",
      usePlural: true,
      schema: { users, sessions, accounts, verifications },
    }),
    user: {
      // Account deletion is one-button, immediate, and permanent (spec + #3).
      // Better Auth gates deleteUser on session freshness or a password; there
      // are no passwords in this OAuth-only app, so every session is treated
      // as fresh. The DB cascade removes sessions and provider accounts.
      deleteUser: {
        enabled: true,
      },
      additionalFields: {
        // Set by the GitHub profile mapping at OAuth sign-in; later used to
        // name the account when commit ingestion runs. Mirrors the provider
        // account that actually owns the access token.
        githubUsername: {
          type: "string",
          required: false,
        },
        // Captured from the browser at OAuth sign-up and edited in Settings.
        // input: false keeps it server-owned: the database hook sets it from
        // OAuth state, and Settings writes go through a validated server
        // action rather than the public update-user endpoint.
        timezone: {
          type: "string",
          required: true,
          defaultValue: "UTC",
          input: false,
        },
      },
    },
    session: {
      // Better Auth treats sessions older than `freshAge` as stale for
      // sensitive operations (deleteUser). This OAuth-only app has no password
      // step, so every signed-in session must be able to delete its own
      // account immediately (#3).
      freshAge: 0,
    },
    socialProviders: {
      ...(githubClientId && githubClientSecret
        ? {
            github: {
              clientId: githubClientId,
              clientSecret: githubClientSecret,
              mapProfileToUser: (profile: {
                login?: string;
                name?: string | null;
              }) => ({
                name: profile.name ?? profile.login,
                githubUsername: profile.login ?? null,
              }),
            },
          }
        : {}),
      ...(googleClientId && googleClientSecret
        ? {
            google: {
              clientId: googleClientId,
              clientSecret: googleClientSecret,
            },
          }
        : {}),
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user, context) => {
            if (context?.path !== "/callback/:id") return;
            const state = await getOAuthState();
            const timezone = state?.timezone;
            if (isIANATimeZone(timezone)) {
              return { data: { ...user, timezone } };
            }
          },
        },
      },
      account: {
        create: {
          before: async (account) => {
            if (account.providerId !== "github") return;
            const data = { ...account };
            if (typeof data.accessToken === "string") {
              data.accessToken = encryptToken(data.accessToken);
            }
            if (typeof data.refreshToken === "string") {
              data.refreshToken = encryptToken(data.refreshToken);
            }
            return { data };
          },
          after: async (account) => {
            if (account.providerId !== "github") return;
            if (typeof account.accessToken !== "string") return;
            try {
              await syncGithubUsername(account.userId, account.accessToken);
            } catch {
              // Non-fatal: linking must never fail because the sync did.
            }
          },
        },
        update: {
          before: async (account) => {
            if (account.providerId !== "github") return;
            const data = { ...account };
            if (
              typeof data.accessToken === "string" &&
              !isEncryptedToken(data.accessToken)
            ) {
              data.accessToken = encryptToken(data.accessToken);
            }
            if (
              typeof data.refreshToken === "string" &&
              !isEncryptedToken(data.refreshToken)
            ) {
              data.refreshToken = encryptToken(data.refreshToken);
            }
            return { data };
          },
        },
      },
    },
    plugins: [nextCookies()],
  });
}

export type GrindboardAuth = ReturnType<typeof createAuth>;
export type GrindboardSession = Awaited<
  ReturnType<GrindboardAuth["api"]["getSession"]>
>;
export type GrindboardUser = NonNullable<GrindboardSession>["user"];

const globalForAuth = globalThis as unknown as {
  grindboardAuth?: GrindboardAuth;
};

/**
 * Lazy singleton Better Auth instance. Building the app must not require
 * DATABASE_URL, so the instance is only created when a route actually uses it.
 */
export function getAuth() {
  if (!globalForAuth.grindboardAuth) {
    globalForAuth.grindboardAuth = createAuth();
  }
  return globalForAuth.grindboardAuth;
}
