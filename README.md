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

Set `DATABASE_URL` in `.env.local`, then initialize and verify the database:

```bash
npm run db:migrate
npm run db:check
```

Start the app with `npm run dev`.

## Verification

```bash
npm run check
npm run typecheck
npm run test:run
npm run build
```

## Deployment

The application deploys to Vercel from `main`. Configure `DATABASE_URL` in the Vercel project before running migrations and the production database health check.

The project vocabulary lives in [CONTEXT.md](./CONTEXT.md). Architectural decisions live in [docs/adr](./docs/adr).
