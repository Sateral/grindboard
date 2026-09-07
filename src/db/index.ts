import { drizzle } from "drizzle-orm/neon-http";

export function createDatabase(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to connect to Neon Postgres");
  }

  return drizzle(databaseUrl);
}

// Keep a single Drizzle instance per process so Better Auth's adapter and the
// application queries share one client. Constructed lazily: building the app
// must not require a database URL.
const globalForDb = globalThis as unknown as {
  grindboardDb?: ReturnType<typeof createDatabase>;
};

export function getDatabase() {
  if (!globalForDb.grindboardDb) {
    globalForDb.grindboardDb = createDatabase();
  }
  return globalForDb.grindboardDb;
}
