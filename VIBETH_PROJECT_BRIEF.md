# VibeTH — Project Brief & Implementation Plan

> Thai AI builder community platform. Portfolio + discovery + connection.
> Domain: vibeth.app · Stack: Next.js + Supabase

---

## 1. Project Overview

**Name:** VibeTH  
**Tagline:** สิ่งที่คนไทยสร้างด้วย AI — portfolio สำหรับ vibe coders ไทย  
**Domain:** vibeth.app  
**MVP Goal:** Give Thai AI builders a permanent home for their work. One shareable URL per builder, multiple projects, optional contact info for connection.

### What makes VibeTH different from competitors

| | madewithclaude.peesamac.com | claudethweb.netlify.app | **VibeTH** |
|---|---|---|---|
| User accounts | None | None | ✅ Yes |
| Owns their data | No | No | ✅ Yes |
| Multiple projects per builder | No | No | ✅ Yes |
| Shareable profile URL | No | No | ✅ Yes |
| Mobile-friendly preview | No (hover-only) | No (hover-only) | ✅ Yes (tap) |
| Claim scraped projects | No | No | ✅ Yes |
| Contact info (LINE/FB) | No | No | ✅ User-controlled |
| PDPA compliant | No | No | ✅ Yes |

### Monetisation (later, not MVP)
- Donation / support link after traffic is established
- Potential B2B: hiring/collaboration connections

---

## 2. Competitive Context

Both competitors scraped the same Facebook thread:  
[Claude Thailand Community — "ขอดูเว็บไซต์ที่ทำจาก CLAUDE"](https://www.facebook.com/groups/1745892855948687/permalink/2257853858085915/) (550+ comments)

- **madewithclaude.peesamac.com** — solo dev, manually curated, no auth, hover-only preview
- **claudethweb.netlify.app** — agency-built (Sociology), 323 sites, 15 categories, 286 creators, no auth

Both are read-only galleries. Neither gives builders ownership. That is VibeTH's moat.

---

## 3. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR for SEO + OG images, fast |
| Database | Supabase (PostgreSQL) | Built-in auth, row-level security for PDPA, free tier |
| Auth | Supabase Auth — Facebook + Google OAuth | No email/password friction |
| Hosting | Vercel | Zero-config Next.js deploy |
| OG Images | Vercel OG (`@vercel/og`) | Auto-generate profile share images |
| Styling | Tailwind CSS | Fast, consistent |
| Screenshots | Puppeteer or ScreenshotOne API | Auto-capture project previews |

---

## 4. Information Architecture

### Public routes (no auth required)
| Route | Page | Description |
|---|---|---|
| `/` | Gallery | Project grid, search, category pills, sort |
| `/u/[username]` | Public profile | Builder's portfolio — shareable URL |
| `/p/[slug]` | Project detail | Preview, description, builder card, claim CTA |
| `/claim` | Claim landing | Explains claiming, search to find your project |

### Auth routes
| Route | Page | Description |
|---|---|---|
| `/auth` | Sign in / Sign up | Facebook or Google OAuth only |
| `/auth/consent` | PDPA consent | Shown once on first sign-in, cannot skip |

### Authenticated routes
| Route | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard | My projects, profile completeness, quick actions |
| `/dashboard/submit` | Submit project | Add new project form |
| `/dashboard/settings` | Settings | Edit profile, contact info, manage data (PDPA) |

---

## 5. User Types & Journeys

### A. Visitor
Browse gallery → filter by category → tap card → see preview + builder → visit site or view profile  
*No account needed*

### B. Claimer (builder whose project was scraped)
1. Sees VibeTH shared in Facebook group
2. Searches for their name or project URL
3. Finds card with **unclaimed** badge
4. Clicks "นี่คือโปรเจกต์ของคุณ? Claim it"
5. Signs in with Facebook/Google (OAuth)
6. PDPA consent screen (first time only)
7. Claim form — confirm it's theirs + optional note (helps admin approve faster — ask them to paste their original FB comment link)
8. **Confirmation screen** — shows profile URL, tells them approval takes 24 hours (Mon–Fri), lets them add more projects immediately without waiting
9. Admin approves → profile goes live → user notified

### C. New builder (not in DB yet)
1. Lands on homepage
2. Clicks "+ submit project"
3. OAuth sign-in → PDPA consent
4. Fill project form → goes live immediately (no admin review for new submissions)
5. Gets shareable profile URL

### D. Member (already registered)
- Add more projects from dashboard (live immediately)
- Edit project info
- Toggle contact info visibility
- Manage PDPA consent / delete account

### E. Connector (wants to reach a builder)
1. Finds project in gallery
2. Opens project / views builder profile
3. Sees LINE or Facebook contact (if builder enabled it)
4. Contacts them directly outside the platform

---

## 6. Page Specs

### Gallery (`/`)

**Header:**
- Logo: VibeTH
- Nav: sign in · "+ submit project" CTA

**Hero:**
- Title: "สิ่งที่คนไทยสร้างด้วย AI"
- Subtitle: platform tagline
- Stats: [X projects] [X builders] [X categories] — updated daily via cron, not live queries

**Filter bar:**
- Search input: full-width, searches project name + builder name
- Category pills: horizontally scrollable on mobile — [All] [Tools] [Education] [Business] [Finance] …
- Sort tabs: [🔥 hot] [new] [a–z]

**Grid:**
- Desktop: `auto-fit minmax(200px, 1fr)` — typically 3–4 columns
- Mobile: single-column list rows (thumbnail left, title/builder/category right, chevron)
- Card tap on mobile → bottom sheet with live preview + "เปิดเว็บ" + "ดูโปรไฟล์" CTAs

**Card states:**
- **Unclaimed:** warning badge "unclaimed", no blue border, no clickable @username
- **Claimed:** info border, clickable @username links to profile
- **Site unavailable:** dimmed, broken link icon, "site unavailable" label

**Pagination:** prev / next with "page X of Y" — no infinite scroll

**Empty state (zero results):** icon + "ไม่พบโปรเจกต์ที่ค้นหา" + "+ submit โปรเจกต์ของคุณ" CTA

---

### Public Profile (`/u/[username]`)

**Nav breadcrumb:** VibeTH › @username + "copy link" button

**Profile header:**
- Avatar: initials circle (from name, colored by hash)
- Display name + username
- Bio (optional)
- Stats: [X projects] [joined Month Year]
- Contact buttons: Facebook, LINE — only shown if user enabled them

**Projects list:**
- Each row: thumbnail (90px) + name + category + domain URL + external link icon
- Dead links: dimmed row + broken link icon + "site unavailable"

**Footer strip:**
- "built with Claude" badge
- vibeth.app branding

**Owner-only edit bar (visible when logged in as this user):**
- "นี่คือโปรไฟล์ของคุณ" + Edit + "เพิ่มโปรเจกต์" buttons

**States:**
- Full profile (contact shown)
- Profile without contact: lock icon + "ผู้สร้างเลือกไม่แสดงช่องทางติดต่อ"
- Pending approval: yellow banner "รอการอนุมัติ — จะแสดงต่อสาธารณะหลังผ่านการตรวจสอบ"

**OG Image (auto-generated via Vercel OG):**
- Avatar + name + "X projects on VibeTH" + bio + 3 project thumbnails + VibeTH branding
- Generated at `/api/og/u/[username]`

---

### Claim Flow (`/claim`)

1. **Landing:** explain what claiming is, search bar to find project
2. **Claim form (after OAuth):**
   - Show matched project card
   - "ยืนยันว่านี่คือของคุณ" — Yes / No
   - Optional note textarea: "ชื่อ Facebook ที่คอมเมนต์ไว้ หรือ link คอมเมนต์ต้นฉบับ" (helps admin approve in 5 seconds)
   - Policy info box: "ทีมงานจะตรวจสอบและอนุมัติภายใน 24 ชั่วโมง (วันจันทร์–ศุกร์)"
   - Submit button
3. **Confirmation screen:**
   - Clock icon + "ส่งคำขอแล้ว"
   - Shows profile URL (pending state, bookmarkable)
   - "เพิ่มโปรเจกต์อื่น ไม่ต้องรออนุมัติ" — other projects go live immediately
   - "กลับไปดู Gallery"
4. **Profile pending state:**
   - Yellow banner visible only to owner
   - "ระหว่างรออนุมัติ คุณสามารถเพิ่มโปรเจกต์ใหม่ หรือตั้งค่าช่องทางติดต่อได้เลย"

---

### Admin Panel (`/admin` — password protected, not public)

Simple internal tool only. Needs:
- List of pending claims: project name, claimer name, note they wrote, original FB source URL
- One-click Approve / Reject per claim
- Reject sends reason (optional)
- Stats: total projects, claimed %, new submissions this week

---

## 7. PDPA Compliance

Thailand's PDPA applies. Key rules implemented:

### Consent screen (shown once on first sign-in, `/auth/consent`)
Four items — two required, two optional:

| Item | Required? | Default |
|---|---|---|
| Account + profile data (name, avatar, email) | Required | Pre-checked, disabled |
| Project data (URLs, names, descriptions) | Required | Pre-checked, disabled |
| Contact info (LINE ID, Facebook URL) | Optional | Unchecked |
| Analytics (page views, search) | Optional | Unchecked |

Rules:
- Cannot proceed without seeing this screen
- Optional items must NOT be pre-checked (PDPA requirement)
- Store consent with timestamp in `user_consents` table

### Data rights (Settings → จัดการข้อมูลของคุณ)
- **Download data** — export profile + projects as JSON
- **Edit consent** — change analytics / contact visibility
- **Delete account** — sets `deletion_requested_at`, purged within 30 days via cron job

### Scraped / unclaimed data
- Every unclaimed project card shows: "ข้อมูลนี้รวบรวมจากคอมเมนต์สาธารณะใน Facebook"
- Two links: "claim โปรเจกต์นี้" or "ส่งคำขอลบข้อมูล"
- Deletion requests from unclaimed profiles go to admin queue

### Contact info
- Off by default
- When user enables it → confirmation dialog: "ช่องทางติดต่อจะแสดงต่อสาธารณะ — คุณสามารถซ่อนได้ตลอดเวลา"
- Store in `user_contact` table with `is_public` boolean

---

## 8. Database Schema

```sql
-- Users (managed by Supabase Auth, extended here)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  facebook_url TEXT,
  line_id TEXT,
  contact_is_public BOOLEAN DEFAULT FALSE,
  analytics_consent BOOLEAN DEFAULT FALSE,
  deletion_requested_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id),  -- null if unclaimed
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  screenshot_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,         -- false if URL is dead
  source TEXT DEFAULT 'submitted',        -- 'scraped' | 'submitted'
  source_fb_comment_url TEXT,             -- original FB comment if scraped
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Claim requests
CREATE TABLE claim_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  claimer_id UUID REFERENCES profiles(id) NOT NULL,
  note TEXT,                              -- user's hint to admin
  status TEXT DEFAULT 'pending',          -- 'pending' | 'approved' | 'rejected'
  rejection_reason TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories (seeded)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_th TEXT NOT NULL,
  name_en TEXT NOT NULL
);

-- PDPA consent log
CREATE TABLE user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  contact_consent BOOLEAN DEFAULT FALSE,
  analytics_consent BOOLEAN DEFAULT FALSE,
  consented_at TIMESTAMPTZ DEFAULT NOW(),
  ip_hash TEXT                            -- hashed IP for audit trail
);

-- Site stats cache (updated by cron)
CREATE TABLE stats_cache (
  key TEXT PRIMARY KEY,
  value INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row-Level Security (Supabase RLS)
- `profiles`: public read, owner-only write
- `projects`: public read, owner-only write (where `owner_id = auth.uid()`)
- `claim_requests`: owner-only read/write
- `user_consents`: owner-only read/write
- Admin panel bypasses RLS using service role key

---

## 9. Seeding Strategy

### Phase 1: Import scraped data
Use `claudethweb.netlify.app` as the data source (already structured: 323 sites, 15 categories, 286 creators). Parse their public data and import as `source = 'scraped'`, `owner_id = null`.

### Phase 2: Recruit first claimers
Post in Claude Thailand Facebook group introducing VibeTH. Template:
> "สวัสดีครับ ผมทำ VibeTH ขึ้นมา — แพลตฟอร์มที่ให้ vibe coders ไทยมี portfolio URL เป็นของตัวเอง 
> ถ้าเคยแชร์โปรเจกต์ในกระทู้นี้ มา claim โปรเจกต์ของคุณที่ vibeth.app ได้เลยครับ 
> แต่ละคนจะได้ URL อย่าง vibeth.app/u/yourname แชร์ได้ทันที"

DM the top 20–30 commenters from the original FB thread individually.

### Phase 3: Open submissions
After 50+ claimed profiles, publicly announce the "submit your project" flow.

---

## 10. Build Phases

### Phase 1 — Core foundation (Week 1–2)
- [ ] Next.js project setup + Supabase connection
- [ ] Database schema migration
- [ ] Supabase Auth (Facebook + Google OAuth)
- [ ] PDPA consent screen (blocks access until completed)
- [ ] Username picker on first login
- [ ] Seed categories table (15 categories from competitor data)
- [ ] Import scraped projects (script to bulk insert)

### Phase 2 — Gallery (Week 2–3)
- [ ] Gallery page (`/`) with grid layout
- [ ] Project cards (unclaimed + claimed states)
- [ ] Search (full-text on project name + builder name)
- [ ] Category pill filter (horizontally scrollable)
- [ ] Sort: hot / new / a–z
- [ ] Pagination (page X of Y)
- [ ] Mobile list layout (responsive breakpoint)
- [ ] Card tap → bottom sheet preview (mobile)
- [ ] Daily stats cron job

### Phase 3 — Profile & Projects (Week 3–4)
- [ ] Public profile page (`/u/[username]`)
- [ ] Owner edit bar (visible only when logged in as owner)
- [ ] Submit project form (`/dashboard/submit`)
- [ ] Project screenshot auto-capture (ScreenshotOne API or Puppeteer)
- [ ] Dead link detection (periodic URL health check)
- [ ] OG image generation (`/api/og/u/[username]` via Vercel OG)

### Phase 4 — Claim flow (Week 4–5)
- [ ] Claim landing page (`/claim`)
- [ ] Claim form with note field
- [ ] Admin panel (`/admin`) — pending claims list, approve/reject
- [ ] Claim approval → project `owner_id` updated, profile goes live
- [ ] Notification on approval (Facebook message or email)
- [ ] Pending profile state UI

### Phase 5 — Settings & PDPA (Week 5)
- [ ] Settings page (`/dashboard/settings`)
- [ ] Edit profile (name, bio, username)
- [ ] Contact info toggle with confirmation dialog
- [ ] Download data (JSON export)
- [ ] Edit consent settings
- [ ] Delete account flow (sets `deletion_requested_at`)
- [ ] 30-day deletion cron job

### Phase 6 — Polish & launch (Week 6)
- [ ] Empty states for all pages
- [ ] Loading skeletons
- [ ] Error pages (404, 500)
- [ ] Privacy policy page (Thai + English)
- [ ] Terms of service page
- [ ] Mobile QA pass
- [ ] Performance audit (Core Web Vitals)
- [ ] Seed first 30 profiles before public announcement

---

## 11. Key UX Rules (do not break these)

1. **No hover-only interactions** — all previews must work on tap/click
2. **Contact info off by default** — never pre-enable, always require explicit user action
3. **Stats are cached, not live** — update via cron, show "updated daily" label
4. **Unclaimed cards always show source disclaimer** — PDPA requirement
5. **Auth consent screen cannot be skipped** — no workaround route
6. **New project submissions go live immediately** — only claim requests need admin review
7. **Profile URL is picked by user** — not auto-generated from name (identity matters)
8. **OG image is non-negotiable** — sharing without preview card kills viral loop
9. **Mobile list layout below 640px** — grid cards are too small on phone
10. **Pagination, not infinite scroll** — gallery is curated, not a feed

---

## 12. Categories (seed data)

Based on competitor data (15 categories):

| Slug | Thai | English |
|---|---|---|
| tools | เครื่องมือ | Tools |
| education | การศึกษา | Education |
| business | ธุรกิจ | Business |
| finance | การเงิน | Finance |
| food | อาหาร | Food & Lifestyle |
| health | สุขภาพ | Health |
| entertainment | บันเทิง | Entertainment |
| productivity | ประสิทธิภาพ | Productivity |
| creative | ความคิดสร้างสรรค์ | Creative |
| ecommerce | อีคอมเมิร์ซ | E-Commerce |
| social | สังคม | Social |
| travel | ท่องเที่ยว | Travel |
| real-estate | อสังหาริมทรัพย์ | Real Estate |
| hr | ทรัพยากรบุคคล | HR & Recruitment |
| other | อื่นๆ | Other |

---

## 13. Environment Variables Needed

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # admin operations only, never expose client-side
NEXT_PUBLIC_SITE_URL=https://vibeth.app
SCREENSHOTONE_API_KEY=           # for auto project screenshots
ADMIN_SECRET=                    # simple password for /admin route
```

---

---

## 14. UI Copy & Layout Notes

All Thai strings are final and approved. Use exactly as written.

### Global nav
```
Logo:        VibeTH
Sign in:     sign in
Submit CTA:  + submit project
Auth page:   เข้าสู่ระบบด้วย Facebook
             เข้าสู่ระบบด้วย Google
```

---

### Gallery page (`/`)

**Hero block**
```
Title:    สิ่งที่คนไทยสร้างด้วย AI — powered by Claude
Subtitle: พอร์ตโฟลิโอสำหรับ vibe coders ไทย · claim โปรเจกต์ของคุณ · แชร์ผลงาน
Stats:    [X] projects  |  [X] builders  |  [X] categories
          (label under each number — "updated daily" in small muted text)
```

**Filter bar**
```
Search placeholder: ค้นหาโปรเจกต์หรือชื่อผู้สร้าง...
Category dropdown:  ทุกหมวดหมู่
Sort tabs:          🔥 hot  |  new  |  a–z
```

**Card states**
```
Unclaimed badge:  unclaimed        (warning color)
Claimed badge:    claimed          (success color)
Tap hint:         tap to preview   (muted, bottom-right of card)
Dead link:        site unavailable (danger color, dimmed card)
Submit card:      + submit your project (dashed border, centered)
```

**Pagination**
```
← prev   |   page X of Y   |   next →
```

**Empty state (zero results)**
```
Icon:     search-off
Title:    ไม่พบโปรเจกต์ที่ค้นหา
Body:     ลองค้นหาด้วยคำอื่น หรือโปรเจกต์ของคุณยังไม่ได้อยู่ในระบบ?
CTA:      + submit โปรเจกต์ของคุณ
```

**Mobile bottom sheet (card tap)**
```
Button 1: เปิดเว็บ ↗   (secondary style)
Button 2: ดูโปรไฟล์    (primary/info style)
```

**Layout specifics**
```
Desktop grid:      auto-fit minmax(200px, 1fr) — typically 3–4 col
Card thumbnail:    height 110px
Mobile breakpoint: 640px → switch to list rows
Mobile row:        thumbnail 56×56px | title + builder + category | chevron-right
```

---

### Public profile (`/u/[username]`)

**Breadcrumb nav**
```
VibeTH  ›  @username          [copy link]
```

**Profile header**
```
Avatar:    56px circle, initials (e.g. "ส"), background color from name hash
Name:      display_name (large, font-weight 500)
Handle:    vibeth.app/u/username (mono font, muted)
Bio:       user bio text (if set)
Stats:     [X] projects  |  joined [Month Year]
Contacts:  [Facebook] [LINE]  — only rendered if contact_is_public = true
```

**Contact buttons**
```
Facebook:  Facebook   (neutral border style)
LINE:      LINE       (success/green style — LINE brand color association)
```

**Projects section**
```
Section label:   projects   (uppercase, muted, small)
Row layout:      90px thumbnail | name + category + domain | external-link icon
Dead link row:   broken-link icon in thumbnail | name | "site unavailable" in danger color | dimmed opacity
```

**Profile footer**
```
Left:   built with  [Claude]
Right:  vibeth.app
```

**No contact state**
```
Lock icon + "ผู้สร้างเลือกไม่แสดงช่องทางติดต่อ"  (muted, secondary bg)
```

**Owner edit bar (shown only to logged-in owner)**
```
Background: info color
Left:   👁 นี่คือโปรไฟล์ของคุณ
Right:  ✏ แก้ไข    +  เพิ่มโปรเจกต์
```

**Pending approval banner (shown only to owner while claim is pending)**
```
Background: warning color
Icon:    clock
Text:    รอการอนุมัติ — จะแสดงต่อสาธารณะหลังผ่านการตรวจสอบ
```

**Dashboard pending nudge (inside profile while waiting)**
```
Icon:    bulb
Text:    ระหว่างรออนุมัติ คุณสามารถ [เพิ่มโปรเจกต์ใหม่] หรือ [ตั้งค่าช่องทางติดต่อ] ได้เลย
         (bracketed terms are bold)
```

**OG image endpoint:** `/api/og/u/[username]`
```
Contents: avatar circle | display name | "X projects on VibeTH" | bio | 3 project thumbnails (+ N more) | VibeTH brand
```

---

### Claim flow

**Unclaimed card CTA**
```
Button: นี่คือโปรเจกต์ของคุณ? Claim it →
```

**Claim form (after OAuth + consent)**
```
Title:    ยืนยันโปรเจกต์ของคุณ
Subtitle: เราพบโปรเจกต์ที่อาจเป็นของคุณ — กรุณายืนยัน

Confirm buttons:
  Yes:  ใช่ นี่คือของฉัน   (info/primary style)
  No:   ไม่ใช่             (neutral)

Note field:
  Label:       หมายเหตุเพิ่มเติม (ไม่บังคับ) — ช่วยให้ admin อนุมัติเร็วขึ้น
  Placeholder: เช่น ชื่อ Facebook ที่คอมเมนต์ไว้ หรือ link คอมเมนต์ต้นฉบับ

Policy info box (info icon):
  ทีมงานจะตรวจสอบและอนุมัติภายใน 24 ชั่วโมง (วันจันทร์–ศุกร์)
  คุณจะได้รับแจ้งเมื่อผ่านการอนุมัติ

Submit button: ส่งคำขอ Claim
```

**Confirmation screen (after submitting claim)**
```
Icon:    clock (success color circle bg)
Title:   ส่งคำขอแล้ว
Body:    ทีมงานจะตรวจสอบและอนุมัติภายใน 24 ชั่วโมง
         คุณจะได้รับแจ้งผ่าน Facebook เมื่อผ่านการอนุมัติ

URL box:
  Label: Profile URL ของคุณ (พร้อมใช้หลังอนุมัติ)
  Value: vibeth.app/u/[username]  (mono font, info color)

Buttons:
  Primary:   กลับไปดู Gallery
  Secondary: เพิ่มโปรเจกต์อื่น (ส่งได้เลย ไม่ต้องรออนุมัติ)
```

---

### PDPA consent screen (`/auth/consent`)

```
Title:    ก่อนเริ่มใช้งาน VibeTH
Subtitle: เราเก็บข้อมูลของคุณเพื่อให้บริการ portfolio และการค้นพบผู้สร้าง
          กรุณาอ่านและยืนยันความยินยอมด้านล่าง
```

**Consent items**
```
1. ข้อมูลบัญชีและโปรไฟล์  [จำเป็น — pre-checked, disabled]
   ชื่อ, รูปโปรไฟล์จาก Facebook/Google, และ email —
   ใช้เพื่อสร้างบัญชีและแสดงผลโปรไฟล์สาธารณะ

2. ข้อมูลโปรเจกต์  [จำเป็น — pre-checked, disabled]
   URL, ชื่อ, และรายละเอียดโปรเจกต์ที่คุณ submit —
   แสดงต่อสาธารณะในแกลเลอรีและโปรไฟล์ของคุณ

3. ช่องทางติดต่อ  [ไม่บังคับ — unchecked by default]
   LINE ID หรือ Facebook URL —
   จะแสดงบนโปรไฟล์ก็ต่อเมื่อคุณเลือกเปิดใช้งานเองในการตั้งค่า

4. การวิเคราะห์การใช้งาน  [ไม่บังคับ — unchecked by default]
   ข้อมูลการใช้งาน (หน้าที่เข้าชม, การค้นหา) —
   ช่วยให้เราปรับปรุงแพลตฟอร์ม ไม่แชร์ให้บุคคลที่สาม
```

**Footer info + buttons**
```
Info text: คุณมีสิทธิ์ เข้าถึง แก้ไข และลบข้อมูล ของคุณได้ตลอดเวลาใน
           Settings → จัดการข้อมูล · [อ่านนโยบายความเป็นส่วนตัว]

Confirm:   ยืนยันและเริ่มใช้งาน
Cancel:    ยกเลิก — ออกจากระบบ
```

**Contact info enable confirmation (in Settings)**
```
Title: ช่องทางติดต่อจะแสดงต่อสาธารณะ
Body:  LINE ID หรือ Facebook ของคุณจะมองเห็นได้โดยทุกคนที่เข้าชมโปรไฟล์ของคุณ
       คุณสามารถซ่อนได้ตลอดเวลาใน Settings

Confirm: เข้าใจแล้ว เปิดใช้งาน
Cancel:  ยกเลิก
```

---

### Settings — data rights section

```
Section title: จัดการข้อมูลของคุณ

Row 1:
  Label:   ดาวน์โหลดข้อมูลของคุณ
  Sub:     ข้อมูลโปรไฟล์และโปรเจกต์ทั้งหมด (JSON)
  Button:  ดาวน์โหลด

Row 2:
  Label:   แก้ไขความยินยอม
  Sub:     เปลี่ยนการตั้งค่า analytics หรือ ช่องทางติดต่อ
  Button:  จัดการ

Row 3:
  Label:   ลบบัญชีและข้อมูลทั้งหมด   (danger color)
  Sub:     ลบข้อมูลทั้งหมดภายใน 30 วัน ตาม PDPA
  Button:  ลบบัญชี                    (danger border)
```

---

### Scraped data disclaimer (on every unclaimed card/page)

```
Icon:  info-circle
Text:  ข้อมูลนี้รวบรวมจากคอมเมนต์สาธารณะใน Facebook ·
       หากต้องการแก้ไขหรือลบ [claim โปรเจกต์นี้] หรือ [ส่งคำขอลบข้อมูล]
       (bracketed items are links)
```

---

### Stats cache keys (Supabase `stats_cache` table)
```
total_projects   → count of active projects
total_builders   → count of profiles with at least 1 project
total_categories → count of categories with at least 1 project
```
Updated by a daily cron job. Read these on gallery page load — do not run COUNT queries per request.

---

*Last updated: June 2026 — VibeTH project brief v1.0*
