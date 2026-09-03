import { config } from "dotenv";
import { eq } from "drizzle-orm";

import { createDatabase } from "../src/db";
import { healthChecks } from "../src/db/schema";

config({ path: ".env.local" });

async function main() {
  const db = createDatabase();
  const [inserted] = await db
    .insert(healthChecks)
    .values({ source: "npm run db:check" })
    .returning({ id: healthChecks.id });

  if (!inserted) {
    throw new Error("Neon did not return the health-check row");
  }

  const [selected] = await db
    .select({ id: healthChecks.id, checkedAt: healthChecks.checkedAt })
    .from(healthChecks)
    .where(eq(healthChecks.id, inserted.id));

  if (!selected) {
    throw new Error("Neon health-check row could not be read back");
  }

  await db.delete(healthChecks).where(eq(healthChecks.id, inserted.id));

  console.info(`Neon round-trip passed at ${selected.checkedAt.toISOString()}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
