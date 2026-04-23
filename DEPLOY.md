# CrimsonWise — Public Education Deployment

Routes:

- `/` `/form` `/result` — clinical (醫護版)
- `/public` — public education (民眾衛教版)
- `/admin` — password-gated CSV export (calls `/api/admin/export`)

## 1. Supabase (one project serves both versions)

1. Create a new Supabase project in **Tokyo (ap-northeast-1)** or **Singapore (ap-southeast-1)**.
2. SQL Editor → paste and run `supabase/schema.sql`.
3. Project Settings → API → copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

Anon key is safe to ship: RLS only permits `INSERT`. `SELECT` is denied for anon, so nobody can scrape submissions with it.

## 2. Local dev

Create a `.env.local` file at the repo root (gitignored by default):

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```

Then:

```
npm install
npm run dev
```

Open `http://localhost:5173/public`.

If the env vars are missing the page still runs; submissions are queued in `localStorage` under `cw_pub_pending` and will flush to Supabase on the next visit that has network + env.

## 3. Deploy — Cloudflare Pages (recommended for Taiwan latency)

1. Push the repo to GitHub.
2. Cloudflare Pages → Connect to Git → pick the repo.
3. Build config:
   - Build command: `npm run build`
   - Build output: `dist`
   - Framework preset: `Vite`
4. Environment variables → add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Production + Preview).
5. SPA fallback: Pages auto-detects `index.html` fallback; if not, add a `public/_redirects` with `/* /index.html 200`.

## 3b. Deploy — Vercel (alternative)

1. Push to GitHub → Import in Vercel.
2. Framework preset: Vite. Build: `npm run build`. Output: `dist`.
3. Add the two `VITE_*` env vars in Project Settings.

## 4. Admin — how to download survey data

The hardcoded client-side password is gone. You have two options:

### Path A — Supabase Dashboard

- Supabase → Table Editor → `public_feedback` → `Export to CSV`.
- Protected by your Supabase account login. No public exposure.

### Path B — `/admin` route (already built)

A password-gated admin page at `/admin` posts to a Cloudflare Pages Function at `/api/admin/export`. The function verifies the password server-side and streams a CSV using Supabase's service role key.

Pieces involved:

- `src/pages/AdminPage.tsx` — password form + table picker (`public_feedback` / `sessions`)
- `functions/api/admin/export.ts` — Cloudflare Pages Function

**Server-only env vars** (NO `VITE_` prefix — these must never appear in the client bundle):

| Variable                    | Where to get it                          |
| --------------------------- | ---------------------------------------- |
| `SUPABASE_URL`              | Supabase → Settings → API → Project URL  |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role |
| `ADMIN_PASSWORD`            | Whatever you choose — min 16 chars       |

In Cloudflare Pages: Settings → Environment variables → add all three under **Production** (and optionally **Preview**). Redeploy afterward.

⚠️ The service role key bypasses RLS. Never prefix with `VITE_`, never commit it, never log it. Rotate immediately if leaked (Supabase → Settings → API → "Reset service_role").

### Vercel equivalent (if you pick Vercel instead of Cloudflare)

Cloudflare Pages Functions live at `functions/api/**`. Vercel uses `api/**` at the project root with a slightly different handler signature. If you deploy to Vercel, copy `functions/api/admin/export.ts` to `api/admin/export.ts` and replace the last few lines with:

```ts
export default async function handler(req: Request) {
  if (req.method !== "POST")
    return new Response("Method Not Allowed", { status: 405 });
  return onRequestPost({ request: req, env: process.env as any } as any);
}
```

Cloudflare Pages is the one-click path; this is only a fallback.

## 5. What was removed from the original public HTML

| Before                                         | After                                           | Why                                        |
| ---------------------------------------------- | ----------------------------------------------- | ------------------------------------------ |
| Babel-standalone + React UMD via CDN           | Vite + TSX build                                | ~4s faster on slow phones; proper bundling |
| `localStorage` as the only store               | Supabase INSERT + localStorage as offline queue | Admin can actually see aggregated data     |
| Admin modal with `bloodwise@2026` in client JS | Removed; dashboard or server-side endpoint      | Password was visible via view-source       |
