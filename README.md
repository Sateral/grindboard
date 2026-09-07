# Grindboard

One unforgiving board for the entire job-hunt grind: Applications, LeetCode solves, and Counted commits.

## Development

Requirements:

- Node.js 24+
- A Neon Postgres database

Install dependencies and configure the environment:

```bash
npm install
cp .env.example .env.local
```

Fill in `DATABASE_URL`, `BETTER_AUTH_SECRET` (generate one with
`npx @better-auth/cli secret`), and the GitHub/Google OAuth credentials in
`.env.local`. The OAuth callback/redirect URLs are:

- `{BETTER_AUTH_URL}/api/auth/callback/github`
- `{BETTER_AUTH_URL}/api/auth/callback/google`

Initialize and verify the database:

```bash
npm run db:migrate
npm run db:check
```

Start the app with `npm run dev`.

## Verification

```bash
npm run verify
```

## Deployment

The application deploys to Vercel from `main`. Configure `DATABASE_URL`,
`BETTER_AUTH_SECRET`, and the GitHub/Google OAuth credentials in the Vercel
project before running migrations and the production database health check.
Set `BETTER_AUTH_URL` to the production origin (e.g.
`https://grindboard.vercel.app`) and register the `/api/auth/callback/github`
and `/api/auth/callback/google` redirect URIs on the OAuth apps.

The project vocabulary lives in [CONTEXT.md](./CONTEXT.md). Architectural decisions live in [docs/adr](./docs/adr).
