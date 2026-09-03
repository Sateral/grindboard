# Auth.js with GitHub and Google OAuth, OAuth-only

Anyone can sign up, so v1 needs real auth. We use Auth.js (NextAuth v5) on Neon with OAuth-only sign-in via GitHub and Google — no email/password, so no verification or reset flows. Signing in with GitHub doubles as the commit-ingestion setup: we learn the user's username and hold a token that raises their API rate limit from 60 to 5,000 requests/hour. Supabase auth was rejected (it would re-platform the ADR-0001 database decision to buy auth we can wire in an afternoon), as was Clerk (extra identity vendor for a three-table app).

Consequence: users who sign up with Google get full tracking but no commit ingestion unless they also connect GitHub.
