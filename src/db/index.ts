import { drizzle } from "drizzle-orm/neon-http";

export function createDatabase(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to connect to Neon Postgres");
  }

  return drizzle(databaseUrl);
}
