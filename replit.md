# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the **Syllabus Tracker** — a fully client-side PWA for tracking study syllabus, spaced revision, streaks, and exam countdowns. All data is stored in `localStorage` (no backend API required by the frontend).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (serves the PWA static files in development)
- **Database**: PostgreSQL + Drizzle ORM (scaffolded, not used by the PWA)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Project Structure

```
artifacts/api-server/
  public/           ← PWA static files (deployed to Vercel)
    index.html
    script.js
    style.css
    manifest.json
    sw.js
  src/
    app.ts          ← Express app (serves public/ in dev)
    routes/         ← /api/healthz only
```

## Vercel Deployment

The app is configured for **static deployment** on Vercel via `vercel.json` at the repo root.

- **Output directory**: `artifacts/api-server/public`
- **Build command**: none (pure static files, no build step needed)
- **SPA routing**: rewrites all non-asset paths to `/index.html`
- **Service worker**: served with `no-cache` and `Service-Worker-Allowed: /` headers

### Steps to deploy to Vercel

1. Push this repo to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Vercel auto-detects `vercel.json` — no extra configuration needed
4. Deploy

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
