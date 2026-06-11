# VibeTH

Thai AI builder community portal. Full product spec, SQL schema, UI copy, and build plan: **see `VIBETH_PROJECT_BRIEF.md`**.

---

## Stack

- **Next.js 14** — App Router, SSR for SEO + OG images
- **Supabase** — PostgreSQL + Auth (Facebook & Google OAuth) + Row-Level Security
- **Tailwind CSS** — mobile-first, 640px breakpoint
- **Vercel** — hosting + Vercel OG for auto-generated share images
- **ScreenshotOne API** — project preview screenshots

---

## Dev commands

```bash
npm run dev          # start local dev server
npm run build        # production build
npm run lint         # eslint check
npx supabase start   # start local Supabase (Docker)
npx supabase db push # push schema migrations
```

---

## Project structure

```
app/
  (public)/
    page.tsx              # / — gallery
    u/[username]/page.tsx # /u/[username] — public profile
    submit/page.tsx       # /submit — submit project
  (auth)/
    auth/callback/        # OAuth callback
    auth/consent/         # PDPA consent screen
  dashboard/
    page.tsx              # /dashboard — owner dashboard
    settings/page.tsx     # /settings — edit profile + data rights
  admin/
    page.tsx              # /admin — claim review panel (ADMIN_SECRET protected)
  api/
    og/u/[username]/      # OG image generation
    cron/stats/           # daily stats cache update
    cron/delete/          # 30-day PDPA deletion job
components/
  ProjectCard.tsx
  BottomSheet.tsx         # mobile tap → preview sheet
  ConsentForm.tsx
  ClaimForm.tsx
lib/
  supabase.ts             # client + server clients
  og.tsx                  # OG image template
```

---

## Key rules (do not break)

1. **Mobile-first** — all layouts start at 320px; grid only above 640px
2. **No contact info shown** unless `contact_is_public = true` on profile
3. **Scraped/unclaimed cards** must show the PDPA disclaimer (see brief §14)
4. **Stats** are read from `stats_cache` table — never run COUNT queries per request
5. **Claim flow** goes pending → admin approves → project owner set; never auto-approve
6. **PDPA deletion** sets `deletion_requested_at`; a cron job hard-deletes after 30 days
7. **OG image** auto-generated at `/api/og/u/[username]` — used in `<meta og:image>`
8. **Pagination** — 24 cards per page; no infinite scroll
9. **Admin routes** require `Authorization: Bearer $ADMIN_SECRET` header
10. **No email/password auth** — Facebook and Google OAuth only

---

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://vibeth.app
SCREENSHOTONE_API_KEY=
ADMIN_SECRET=
```

---

## Database (abbreviated)

Full schema in `VIBETH_PROJECT_BRIEF.md §11`. Core tables:

| Table | Purpose |
|---|---|
| `profiles` | One row per user; owns username + contact settings |
| `projects` | Many per profile; slug, URL, category, screenshot |
| `claim_requests` | Pending/approved/rejected claim queue |
| `user_consents` | PDPA consent log with IP hash |
| `stats_cache` | Pre-computed counters: `total_projects`, `total_builders`, `total_categories` |

RLS: users can only write their own rows. Service role used for admin + cron only.

---

## Build phases

| Phase | Scope |
|---|---|
| 1 | Supabase schema + seed data (323 projects from competitor scrape) |
| 2 | Gallery page — grid, filter, search, pagination, card states |
| 3 | Auth — Facebook/Google OAuth, PDPA consent screen |
| 4 | Profile page — public URL, OG image, contact toggle |
| 5 | Claim flow — form, pending state, admin panel |
| 6 | Submit flow — add new project, dashboard, settings/data rights |

Full phase details and acceptance criteria in `VIBETH_PROJECT_BRIEF.md §13`.

---

## Thai UI copy

All Thai strings for every screen are in `VIBETH_PROJECT_BRIEF.md §14`. Use exactly as written — do not translate or paraphrase.
