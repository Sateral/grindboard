import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const healthChecks = pgTable("health_checks", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  source: text("source").notNull(),
  checkedAt: timestamp("checked_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
