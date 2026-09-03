# Neon Postgres instead of local SQLite

The original spec called for SQLite under a "local-first" framing, but the product is now a multi-user app with open signup, deployed to Vercel, and each user's grind (including per-user GitHub commit ingestion and timezone-dependent day boundaries) must be scoped and persistent from day one. We use hosted Postgres on Neon with Drizzle as the data layer: serverless-friendly connections, a generous free tier, and no infrastructure to operate. Supabase was considered and rejected — its differentiators (bundled auth, storage, realtime) are covered by Auth.js or out of scope for v1.

Consequence: "local-first" no longer describes the product; it is a personal, single-founder-built, multi-user cloud app.
