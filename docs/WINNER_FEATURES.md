# Kira-Kira — Winner Feature Extraction & Copyable Craft Checklist

Granular, evidence-based teardown of the **actual winning repos** of past KrackedDevs bounties, plus a concrete, copyable playbook for the "Split Bill & Payment Tracker" bounty.

This is the **deep companion** to `docs/WINNING_RUBRIC.md`. The rubric owns the high-level scoring weights, the judge's taste, and the "wow idea" list — **read it first**. This doc does NOT re-derive those. It extracts the code-level, file-level, copyable specifics the rubric couldn't see, because I cloned and read the source of all four winners.

Compiled: 2026-05-30. Every claim is cited to what I actually read. Unverified items are flagged.

> Caution for implementers: the winners ship **Next.js 14 (Laman Troka, SenTracker) / 15 (PWB)** with conventional App Router patterns. Kira-Kira's Next.js is pinned/modified (see `AGENTS.md` — "this is NOT the Next.js you know"). Treat every code snippet below as a **pattern to re-implement against Kira-Kira's actual Next APIs**, not a copy-paste. Read `node_modules/next/dist/docs/` before writing code.

---

## 0. Evidence base — what I actually cloned and read

| Winner | Bounty | Repo | Inspection |
|---|---|---|---|
| **Laman Troka** | Wedding/venue booking | `danishsenju/Wedding-hall-booking` | ✅ Full clone. Read tree, `package.json`, `globals.css`, `layout.tsx`, landing page, `CheckmarkAnimation.tsx`, `ActionButtons.tsx`, **`CHECKLIST.md`, `.claude/PERSONA.md`, `.claude/skills/design.md`** (the real craft artifacts). |
| **PWB Vanguard** | Community problem reporter | `syahiirah95/pwb-vanguard` | ✅ Full clone. Read the (huge) README, `manifest.json`, `globals.css`, `layout.tsx`, file tree, `prompt/` and `script/` folders. |
| **SenTracker** | MYR expense tracker | `MuhdAqmarr/SenTracker` | ✅ Full clone (found via `gh search repos sentracker`). Read README, `globals.css`, `manifest.json`, **`lib/nl/keywords.ts` + `lib/nl/date.ts`** (the Malaysian NL engine), landing hero copy. |
| **KrekFood** | Viral food directory/map (Bounty #4) | `4kmal/krekfood` | ⚠️ Repo cloned & README/deps read (found via `gh search repos krekfood`). **Rendered UI still UNVERIFIED** — colors/fonts below are *README claims*, not observed pixels. README confirms it's a fork of `hackathon-girls/orked`. |

**Upgrade vs the rubric:** the rubric marked SenTracker partially-inspected and KrekFood fully UNVERIFIED. Both are now **repo-confirmed** (SenTracker fully; KrekFood at README/code level).

---

## 1. THE single most copyable finding: Laman Troka won with a DEFAULT README

Laman Troka's `README.md` is **the untouched `create-next-app` boilerplate** ("This is a Next.js project bootstrapped with create-next-app… Learn More… Deploy on Vercel"). Verified by reading the file. So its win was **100% the live product + visual craft**, zero README salesmanship.

The craft instead lived in **agent-scaffolding files committed to the repo** — and *these* are the copyable tactic:

### 1a. `.claude/PERSONA.md` — "Razeen", the competitive-engineer persona (verbatim excerpts)
> "You are Razeen — an obsessively competitive senior fullstack engineer and UI/UX designer… You treat every project like a championship. Second place is failure."
> "Generic UI physically bothers you." · "Your hover states have hover states." · "You never use default Tailwind colors. Always custom tokens." · "You design mobile first because you know judges use phones." · "Inter is overused, purple gradients are lazy, equal-column grids are amateur." · "You handle loading, error, and empty states without being asked."

→ **Copy this device.** Give Kira-Kira a committed persona file ("kopitiam craftsman") so every generation is held to a non-corporate, detail-obsessed bar.

### 1b. `.claude/skills/design.md` — a hard design contract (verbatim)
> "Colors: CSS variables only. Never hardcode hex in components." · "Fonts: Cormorant Garamond for headings/display. DM Sans for body." · "Animations: aurora (8-16s), typewriter (80ms/char), flip words (2.5s)." · "Mobile: Floating Dock replaces navbar links. Table replaced by expandable cards." · "Gold rule: only one accent color. Rose as whisper only."

→ A **named-timing, single-accent, CSS-vars-only** rulebook. The discipline (one accent, documented durations, mobile component swaps) is exactly what reads as "designed, not generated."

### 1c. `CHECKLIST.md` — a 7-phase build plan with per-feature checkboxes
Phases: Setup → Database → Landing → Venue Details → Booking Form → Confirmation → Admin. Each phase enumerates concrete deliverables (e.g. confirmation phase: "Stroke-draw checkmark animation / Booking details card / Timeline component / WhatsApp button / Trust footer"). It even **documents trade-offs honestly** ("time_slots table — handled via time_slot text field"; "admin_users — using Supabase Auth, no separate table").

→ **Copy this structure** as Kira-Kira's own phased checklist (see §6).

**Meta-lesson:** the rubric is right that judging is taste-driven on the live product. Laman Troka proves the README can be throwaway **if the product is immaculate** — but you don't have to choose: PWB and SenTracker show a strong README is free upside. **Do both:** Laman Troka's craft + PWB/SenTracker's README.

---

## 2. Per-winner extraction

### 2.1 Laman Troka (venue booking) — craft-maximalist, README-minimalist

**Stack (from `package.json`):** Next.js **14.2.35**, React 18, TypeScript, Tailwind, Supabase JS, **Framer Motion 12 + GSAP 3** (dual motion libs), **`canvas-confetti`**, `react-hook-form` + `zod`, `exceljs` (admin Excel export), `leaflet` (map), **`three` + `@react-three/fiber` + `@react-three/drei` + `ogl`** (3D/WebGL backgrounds), `@tabler/icons` + `lucide`.

**Screen-by-screen (from `app/` tree + `CHECKLIST.md`):**
- **Landing:** Hero (Aurora WebGL bg + Typewriter + Flip Words) → Stats strip (animated number ticker) → Venue showcase grid → Theme carousel (Apple-cards style) → Bento feature grid → CTA band → Footer. Desktop navbar swaps to a **Floating Dock** on mobile.
- **Venue detail (`venues/[slug]`):** real photo hero, specs grid, amenities tags, inclusions checklist, **SVG floor-plan morph**, sticky pricing card, **live deposit calculator**.
- **Booking flow:** 4-step wizard (`Step1Details` → `Step2DateTime` calendar+slots → `Step3Addons` → `Step4Review`) with a `StepIndicator` and a **live summary sidebar** that updates as you fill.
- **Confirmation:** stroke-draw checkmark, booking card, next-steps timeline, WhatsApp button, trust footer.
- **Admin (`(admin)` route group):** Supabase-auth login, middleware-protected, live dashboard stats, bookings table (desktop) that becomes **expandable cards on mobile**, filter+search, approve/reject, detail modal, toast notifications, trend chart, activity log, Excel export.
- Every route ships its own `loading.tsx` + `error.tsx` (loading/error states "without being asked").

**Theme tokens (`app/globals.css`) — IMPORTANT discrepancy to flag:** the CSS variables are *named* `--gold` but actually hold **violet** values: `--gold: #6D28D9`, `--gold-hover: #7C3AED`, `--base: #0A0B10` (near-black), `--text: #EDE9FE`. The rubric described the **live site** as "gold/charcoal." Both can be true: the committed repo is a **violet-on-near-black** theme; the live deploy may have been re-themed to gold, or the rubric read the live differently. **Cited as: repo says violet; rubric saw gold live. Possible re-theme. Verify on live before quoting a palette.** The transferable craft is structural regardless: **one accent color, dark base, light text, CSS-vars-only.**

**Fonts (`layout.tsx`):** `Cinzel` (display caps) + `Cormorant Garamond` (serif headings, with italic) + `DM Sans` (body) via `next/font/google`, all wired to CSS variables. Three deliberate fonts, no Inter.

**Named animation — the stroke-draw checkmark (`CheckmarkAnimation.tsx`), copy this verbatim pattern for Kira-Kira's "LUNAS" stamp / settle-up tick:**
- Measure path with `path.getTotalLength()`, set `strokeDasharray = length` and `strokeDashoffset = length`, then animate offset → 0 over **800ms ease-out, delay 300ms** (the line "draws itself").
- The circle behind it pops in with Framer Motion `scale: 0→1, ease: "backOut", 0.4s`.
- Two **infinite pulse rings** expand `scale 1→1.5, opacity 1→0` over 1.5s, staggered 0.5s.

**WhatsApp share (`ActionButtons.tsx`) — copy this:** builds a **bold-formatted, emoji-structured** message and opens `https://wa.me/<number>?text=<encoded>`. Uses `*bold*` WhatsApp markdown, line-by-line fields with emoji labels (`📋 *Booking Reference:* …`, `📅 *Date:* …`), dates formatted with `toLocaleDateString("en-MY", …)`, then `[...].filter(Boolean).join("\n")` so empty fields drop out. Sibling actions: Copy, Download (HTML summary), Share, Home.

**Above & beyond the brief:** WebGL aurora/particle backgrounds, GSAP scroll animations, SVG floor-plan morph, live deposit calculator, Excel export in admin, Leaflet map picker, full admin CRUD for halls/packages/vendors/gallery. A venue *booking* brief got a full **two-sided product** (customer + operator).

---

### 2.2 PWB Vanguard (community reporter) — README-maximalist, immersive theme

**The README is the artifact.** It's a ~250-line "Tactical Terminal OS" manifesto. Devices to steal:

- **Mission-stats header table** up top: Mission Designation, **Bounty Reward `RM 500 [LOCKED]`**, Primary Objective, **Extraction Deadline `14 FEB 2026 [15:59 GMT+8]`**. (Confirms the deadline format: hard date + minute + GMT+8. This was *that* bounty — not split-bill.)
- **`[VIBE_CODING]` stack section** that openly credits the AI models used (Gemini 3 Flash, Claude Opus 4.5/4.6) — velocity-with-AI is a *flex* here, not a confession.
- **`RE-01 … RE-10` requirement-mapping table** — ID / Title / Description, one row per bounty requirement. This is the device the rubric named. **It is a PWB signature, not a universal law** (SenTracker won without it — see 2.3).
- **`[PERSONAL_IMPLEMENTATION]` "Operational Innovations" table** — the explicit *beyond-requirements* section: URL-driven state, custom PDF engine, weighted **Impact Score** algorithm, PL/pgSQL XP triggers.
- **A "Transparency Note" table** distinguishing **mock-data prototype** features (Leaderboard, Command Center, Quest Track marked `🟡 PROTOTYPE`) from **`✅ LIVE` Supabase-connected** ones. They told the judge exactly what's real — **and still won.** Honesty as a credibility device.
- Deep gamification spec tables: 10-tier rank ladder (named after Malaysian everyman archetypes — "The Mechanic", "The Delivery Rider", "The Mamak"-adjacent), XP table, 3 badges, role hierarchy, attribute formulas.
- **OWASP Top 10 coverage table** (A01–A10, each with implementation note) + a "Security Files Manifest." Over-the-top, but signals seriousness.

**Stack/craft:** Next.js 15 + React 19, Supabase (Postgres + RLS on 8 tables + Google OAuth + Storage), **PWA** (`manifest.json` with `display: standalone`, app shortcuts "Initiate Mission"/"Intel Feed", `sw.js` stale-while-revalidate, maskable icons), fonts **`Orbitron` (techy display) + `Inter`**. `globals.css` carries a full token system incl. **status-color tokens** (`--status-open/-acknowledged/-in-progress/-closed`) and **tier colors** (`--tier-legendary/-epic/-rare/-common`) — i.e. semantic colors per state, not ad-hoc.

**Bilingual:** layout metadata is EN+MS (`title: "PWB Reporter | Laporan Pinjaman Wang Berlesen"`, bilingual description). README states "Full EN/MS language coverage."

**Repo discipline:** committed `prompt/` folder (the AI prompts used: `ui_specification.md`, `category_prompts.md`, `levels_image_prompts.md`) and a `script/` folder of incremental SQL patches (`vanguard_schema.sql`, `..._gamification_fix.sql`, etc.) — a visible, auditable build trail.

---

### 2.3 SenTracker (MYR expense tracker) — clean README, deep local NL engine

**The README to model for Kira-Kira** (clean, scannable, not cosplay):
1. One-line positioning + a hook ("just type what you spent").
2. **🔒 Security Status table** — RLS per table with policy counts + "Security Guarantees" bullets. Cheap credibility.
3. **✨ Flagship Features** with **literal input→output examples**:
   - Input `"RM12 grab today"` → `RM12.00 • Transport • Grab • Today`
   - Input `"Spent 15 myr on nasi lemak at ali mamak"` → `RM15.00 • Food • Ali Mamak • Today`
4. **🛠️ Tech Stack** (Core / UI / Features, with links).
5. **📂 Project Structure** ASCII tree with inline comments (`lib/nl/ # Natural Language Engine 🧠`).
6. **🚀 Getting Started** (clone, env, run, `npm test`).
7. **🇲🇾 Malaysian Context** section — RM, `DD/MM` dates, "semalam/mamak/teh ais".

**Stack:** Next.js 14 App Router, TS, Supabase (Postgres+Auth, RLS), **shadcn/ui + Radix**, Framer Motion + GSAP, Zod + RHF, **`date-fns` with Malaysian formats**, `next-pwa`, **Jest unit tests** for the parser.

**Theme tokens (`globals.css`):** HSL design tokens, dark-first (`--background: 240 10% 3.9%`), an **emerald→cyan accent gradient** (`--sen-accent-start: 160 84% 39%` → `--sen-accent-end: 192 91% 36%`), **glassmorphism tokens** (`--sen-glass-bg/-border/-blur: 12px`), semantic success/warning/danger, full light-mode override block. Font: `Plus Jakarta Sans`. `manifest.json`: `theme_color #10b981`, `categories: ["finance","productivity","utilities"]`, `start_url: /dashboard`.

**The win engine — `lib/nl/` (the deepest local-resonance artifact across all four winners):**
- `keywords.ts`: `CATEGORY_KEYWORDS` maps categories to **hundreds of Malaysian-specific terms** — food: `nasi lemak, nasi kandar, char kuey teow, laksa, satay, mamak, kopitiam, teh, kopi, zus, tealive, oldtown`; transport: `grab, maxim, tng, touch n go, smarttag, lrt, mrt, rapidkl, petronas, minyak`; utilities: `tnb, tenaga, unifi, maxis, astro, indah water, cukai, dbkl`; etc. Plus a `MERCHANT_CATEGORY_MAP`.
- `date.ts`: bilingual month names (`mac, mei, ogos, disember`), and parses `today/hari ini`, `yesterday/semalam` with regex, `DD/MM` preferred over US `MM/DD`.

→ **This is what "Malaysian soul" looks like at the code level:** not a flag emoji — a **hardcoded local vocabulary** the app actually understands. Kira-Kira's equivalent: a local **makan-items dictionary** (roti canai, teh tarik, nasi lemak, mee goreng, milo ais, kaya toast…) seeded into the demo + used for quick-add.

---

### 2.4 KrekFood (viral food map) — ⚠️ README/code-level only

**Stack (from `package.json`):** **Vite + React + TypeScript** (NOT Next.js — the only non-Next winner), `react-router-dom`, **full shadcn/Radix suite**, `@tanstack/react-query`, Supabase + **Edge Functions**, Google Maps (`@react-google-maps/api`), Gemini 2.0 Flash, SerpAPI, `recharts`, `sonner` (toasts), `vaul` (drawer), Framer Motion. README says it's a fork of `hackathon-girls/orked`.

**Named-palette device (README "🎨 Design" — UNVERIFIED as rendered, but the *naming pattern* is the gold):**
> "Sambal Red (Primary) · Pandan Green (Secondary accents) · Nasi Cream (Warm backgrounds) · Poppins font — casual, friendly. Design inspired by Malaysian hawker centers."

→ **This is the cleanest template for Kira-Kira's palette:** name your colors after kopitiam objects so the theme is self-documenting and on-brand. Also: a **"Manglish comments generator"** Edge Function — voice/local-language as an explicit feature.

**Caveat:** I read README + deps only; I did not render the site. Treat the colors/fonts as *claims*.

---

## 3. Cross-winner pattern synthesis (the shared DNA)

| Signal | Laman Troka | PWB | SenTracker | KrekFood | Takeaway for Kira-Kira |
|---|---|---|---|---|---|
| Dark-first, **single/duo accent**, **CSS-vars-only** tokens | ✅ violet | ✅ cyan+violet | ✅ emerald→cyan | claimed | Lock a token system before CRUD. |
| **Named, deliberate fonts** (never default Inter alone) | Cinzel+Cormorant+DM Sans | Orbitron+Inter | Plus Jakarta | Poppins | Pick a kopitiam-appropriate display + body pair. |
| **Framer Motion (often +GSAP)** for signature motion | ✅✅ | ✅ | ✅✅ | ✅ | One signature animation done well > many cheap ones. |
| **Loading/error/empty states** shipped | ✅ per-route | ✅ | ✅ | ✅ | Non-negotiable. |
| **Supabase + RLS**, RLS bragged in README | ✅ | ✅ 8 tables | ✅ table+counts | ✅ | Put an RLS table in the README. |
| **Concrete RM amounts / local vocab** baked in | en-MY dates | RM500 framing | NL dictionary | hawker theme | Hardcode local specifics, don't gesture at them. |
| **Bilingual EN/MS** touch | en-MY locale | full EN/MS | "Malaysian Context" §, semalam | "Manglish" gen | At least a bilingual section + Manglish copy. |
| **Seed/demo data** so judge lands on a live screen | seed.sql | vanguard_seed.sql | — | — | Seed a populated, alive demo. |
| **Honest scope note** (mock vs live) | CHECKLIST trade-offs | Transparency table | — | — | Disclose the simulated payment as a deliberate choice. |
| README requirement-mapping | ❌ (default README) | ✅ RE-01..10 | ✅ Flagship+examples | ✅ feature list | Map to the brief — RE-table OR flagship-with-examples. |

**The two valid README archetypes:** PWB's **RE-01..RE-n immersive cosplay** vs SenTracker's **clean Flagship-Features-with-input/output-examples**. Both won. Pick the one that fits a fun consumer split-bill app — lean **SenTracker-clean with a light kopitiam voice**, and borrow PWB's **RE-mapping table** + **Transparency note** as two specific sections.

---

## 4. COPYABLE README TEMPLATE for Kira-Kira

Model = SenTracker structure + PWB's RE-table & Transparency note + KrekFood's named palette + Laman Troka's "ship loading/empty states" rigor. Light kopitiam voice; bilingual touches.

```markdown
# Kira-Kira — Split the makan, settle the kira ☕🧾
> Senang je. Scan, bayar, settle. The kopitiam way to split a bill.

A delightful split-bill & payment tracker for Malaysians. Create a bill, share
one link on WhatsApp, and watch the teh-tarik glass fill as everyone settles up.

## ✨ Flagship Features  (SenTracker-style, with input→output)
- 🧾 **Kopitiam Receipt Bills** — every bill renders as a thermal makan receipt.
- 📲 **One-tap WhatsApp share** — link unfurls a rich OG card showing live progress.
- ✅ **DuitNow-style confirm** — "Dah bayar?" → LUNAS chop stamp animation.
- 🫖 **Teh-tarik progress** — collection % fills a kopitiam glass, not a boring bar.
   - Example: 3 of 5 paid → glass 60% full, "RM 36.00 collected · RM 24.00 lagi"
- 🗣️ **Manglish nudges** — one-tap "Eh, belum bayar 🙏" WhatsApp reminder.

## 🎯 Bounty Requirements Mapping  (PWB-style RE table)
> Verify these against the LIVE split-bill brief before submission.
| ID | Requirement | How Kira-Kira delivers |
|----|-------------|------------------------|
| RE-01 | Organizer creates a bill (title, total, participants, due date, notes) | `/new` receipt-builder wizard |
| RE-02 | Shareable payment link (unique URL, opens without login) | `/bill/[slug]` public route |
| RE-03 | Members confirm payment (simulated allowed) | DuitNow-QR confirm + LUNAS stamp |
| RE-04 | Organizer dashboard: paid/unpaid per person | Receipt line-items with paid chops |
| RE-05 | Totals: collected, remaining, progress | Teh-tarik glass + RM totals strip |
| RE-06 | Mobile-perfect + WhatsApp rich preview | Dynamic OG image per bill |
| RE-07 | RM/MYR formatting throughout | `RM 12.50` via Intl, en-MY |
| RE-08 | Live deployed URL + public repo | Vercel + this repo |

## 🔒 Security (RLS) — SenTracker/PWB device
| Table | RLS | Policies |  ... (bill, participant, payment) ...

## 🛠️ Tech Stack
Next.js (App Router) · TypeScript · Supabase (Postgres + RLS) · Tailwind ·
Framer Motion · Vercel. Dynamic OG via Next image generation.

## 🎨 Design — named kopitiam palette (KrekFood device)
- **Kopi-O Black** — base ink / receipt text
- **Teh-Tarik Cream** — paper / background
- **Sambal Red** — LUNAS chop & primary CTA
- **Pandan Green** — paid/success state
- **Kaya Gold** — accents
- Display: <kopitiam-appropriate>; Body: clean sans. Receipt: monospace.

## 📂 Project Structure   (ASCII tree w/ inline comments)
## 🚀 Getting Started      (clone · env · dev · test)
## 🇲🇾 Malaysian Context   (RM, DuitNow, makan archetypes, Manglish, BM dates)
## 📝 Transparency Note    (PWB device)
> Payment is **simulated** by design — the brief allows it; we spent the
> budget on the experience (receipt, OG, animations), not a real gateway.
> | Feature | Status | Notes |  ... (live vs simulated) ...
```

Placement rules learned from winners: **screenshots/GIF right under the title** (SenTracker puts a hero image immediately after the tagline; Laman Troka relied on the live site). Include a short **demo GIF of the LUNAS stamp + teh-tarik fill + WhatsApp share** — the three screenshot-worthy moments.

---

## 5. PRIORITIZED FEATURE CHECKLIST (tagged to rubric dimensions)

Dimensions reference `WINNING_RUBRIC.md` §3: **[Visual] [Concept] [Local] [Complete] [Mobile/WA] [Beyond]**.

### Table-stakes — ship ALL or get eliminated
- [ ] Create bill: title, total, participants, due date, description — `[Complete]`
- [ ] Unique shareable link, opens **without login** — `[Complete][Mobile/WA]`
- [ ] Member confirm-payment flow (simulated) — `[Complete]`
- [ ] Dashboard: paid/unpaid per person, **total collected, remaining, progress** — `[Complete]`
- [ ] `RM 12.50` formatting everywhere (`Intl.NumberFormat('en-MY')`) — `[Local][Complete]`
- [ ] Per-route **loading + empty + success** states; zero dead buttons/console errors — `[Visual][Complete]`
- [ ] Flawless at **375px**; share button → `wa.me` deep link — `[Mobile/WA]`
- [ ] Live Vercel URL + public repo + brief-mapped README — `[Complete]`
- [ ] **Seeded demo bill** (real makan items, RM, some "paid") so the judge lands alive — `[Complete][Local]`

### Differentiators — pick and execute cleanly (these separate win from honorable mention)
- [ ] **Kopitiam thermal-receipt** bill component (monospace, dashed tear-edges, "TERIMA KASIH" footer) — `[Visual][Concept][Local]`
- [ ] **Dynamic OG image** per bill (Next image generation) → rich WhatsApp unfurl — `[Mobile/WA][Visual]`
- [ ] **Named CSS-vars palette** + deliberate font pair, single accent discipline — `[Visual][Concept]`
- [ ] **RLS** on bill/participant/payment tables + README RLS table — `[Complete]`
- [ ] **Bilingual EN/MS** toggle or copy + Manglish voice — `[Local][Concept]`
- [ ] **One-tap Manglish WhatsApp reminder** to unpaid members — `[Local][Mobile/WA]`

### Wow / tiebreaker — choose 2–3, do them flawlessly (depth > breadth)
- [ ] **LUNAS chop-stamp** animation on payment (stroke-draw + back-out pop + pulse rings, per Laman Troka's `CheckmarkAnimation`) — `[Visual][Concept][Beyond]`
- [ ] **Teh-tarik glass progress** fill instead of a bar — `[Visual][Concept][Local]`
- [ ] **DuitNow-QR-style** simulated confirm screen (MAE/TnG vibe) — `[Local][Beyond]`
- [ ] **Settle-up celebration** at 100% (`canvas-confetti` — Laman Troka ships it) + "SEMUA DAH SETTLE! 🎉" — `[Visual][Concept][Beyond]`
- [ ] **Smart split modes**: equal / by-item (assign satay to Ali) / partial — `[Beyond][Complete]`
- [ ] Optional **PWA** install (`manifest.json` standalone + maskable icons, like PWB/SenTracker) — `[Mobile/WA][Beyond]`
- [ ] **Makan-items quick-add dictionary** (SenTracker's local-vocab device, applied to bill line-items) — `[Local][Beyond]`

---

## 6. COPYABLE CRAFT DETAILS (specific, named, code-level)

**Theme system (do FIRST, like Laman Troka's CHECKLIST Phase 1):**
- CSS variables only, never hardcode hex in components (Laman Troka design.md rule).
- Named kopitiam tokens (KrekFood device): `--kopi-o`, `--teh-cream`, `--sambal`, `--pandan`, `--kaya-gold`. One primary accent (`--sambal` for CTA/chop), one success (`--pandan`).
- Semantic state tokens like PWB: `--status-unpaid`, `--status-paid`, `--status-overdue`.
- Glassmorphism tokens optional (SenTracker): `--glass-bg/-border/-blur:12px` for cards.
- Deliberate fonts via `next/font`: a warm display + clean body + **monospace for the receipt**. No bare Inter.

**Signature animations (named, with timings to match the winners' polish):**
- **LUNAS stamp** = Laman Troka checkmark recipe: SVG path, `getTotalLength()` → animate `strokeDashoffset` to 0 over **800ms ease-out (300ms delay)**; stamp container `scale 0→1 ease "backOut" 0.4s`; optional ink-splatter via 2 pulse rings (`scale 1→1.5, opacity 1→0, 1.5s, staggered 0.5s`).
- **Teh-tarik fill**: animate liquid height (Framer Motion / SVG clip) with a subtle surface wobble; document the duration (winners document theirs — design.md lists aurora 8–16s, typewriter 80ms/char).
- **Settle-up**: `canvas-confetti` burst (dependency Laman Troka already used) on 100%.
- Keep it to **2–3 signature motions**, executed cleanly — every winner had a few hero animations, not dozens of cheap ones.

**WhatsApp share (Laman Troka `ActionButtons` pattern):**
- Build a `*bold*`-formatted, emoji-labelled, line-by-line message; `.filter(Boolean).join("\n")` to drop empty fields; open `https://wa.me/?text=${encodeURIComponent(msg)}` (no number for share-to-anyone).
- Manglish voice: "Eh korang, settle our makan kira ya 🙏 RM 12.00 each. Link: …".
- Pair with a **dynamic OG image** so the link unfurls a branded card (receipt + progress).

**Local touches (SenTracker code-level standard):**
- `Intl.NumberFormat('en-MY', {style:'currency', currency:'MYR'})` everywhere.
- A makan-archetype dictionary for quick-add line items (roti canai, teh tarik, nasi lemak, milo ais, kaya toast, mee goreng…).
- BM date words and `DD/MM` formatting; "belum bayar / dah bayar / LUNAS" status copy.

**Repo discipline (copy the winners' scaffolding):**
- Commit a **`PERSONA.md`** ("kopitiam craftsman", Razeen-style bar) + a **`design.md` contract** (CSS-vars-only, named timings, mobile component swaps).
- Commit a **phased `CHECKLIST.md`** (Setup → Theme → DB → Bill builder → Public bill/confirm → Dashboard → Polish) with honest trade-off notes.
- Ship `seed.sql` with a realistic demo bill.

---

## 7. MISTAKES TO AVOID (observed or directly inferred)

- **Generic shadcn/Tailwind with no token system.** Every winner committed a named CSS-vars palette + deliberate fonts. Default = "tutorial project."
- **Bare Inter / lazy gradients / equal-column grids.** Explicitly called out as amateur in Laman Troka's `PERSONA.md`.
- **Hardcoding hex in components.** Laman Troka's design.md bans it; it's what makes re-theming and consistency break.
- **Gesturing at "Malaysian" instead of encoding it.** SenTracker won on a literal local-vocab dictionary + semalam parsing. A flag emoji is not local soul.
- **Skipping loading/empty/error states.** All four ship them; Laman Troka has per-route `loading.tsx`/`error.tsx`. Missing states read as unfinished.
- **Landing the judge on an empty dashboard.** Seed demo data (Laman Troka `seed.sql`, PWB `vanguard_seed.sql`).
- **Over-building plumbing, under-building experience.** Brief allows simulated payment — use it. Spend budget on receipt/OG/animations, not a real gateway. (PWB even shipped some features as honest mock and still won.)
- **Many shallow animations instead of 2–3 signature ones.** Depth beats breadth.
- **Ugly/missing WhatsApp unfurl.** The brief names WhatsApp; ship a dynamic OG image and a formatted `wa.me` message.
- **Lifeless copy.** Winners have voice ("JUST TYPE. WE TRACK.", "Manglish comments"). Write Manglish, not lorem.
- **Trusting the RE-01..RE-n table as mandatory or the deadline as known.** RE-table is a PWB *option*, not law (SenTracker skipped it). The `14 FEB 2026 15:59 GMT+8` deadline was PWB's bounty — **verify the split-bill brief's own requirements and deadline on the live board before submitting.**
- **Assuming the winners' Next.js APIs match Kira-Kira's.** They're stock Next 14/15; Kira-Kira's Next is modified (`AGENTS.md`). Re-implement patterns against the actual installed Next docs.

---

## Appendix — source provenance
- `danishsenju/Wedding-hall-booking` (Laman Troka) — cloned `/tmp/wedding-hall`. README = default CNA boilerplate; craft in `CHECKLIST.md`, `.claude/PERSONA.md`, `.claude/skills/design.md`, `globals.css`, `CheckmarkAnimation.tsx`, `ActionButtons.tsx`. Next 14.2.35.
- `syahiirah95/pwb-vanguard` (PWB Vanguard) — cloned `/tmp/pwb-vanguard`. README is the artifact (RE-01..10, Impact Score, Transparency note, OWASP table). Next 15, `manifest.json`, `globals.css` token system, `prompt/` + `script/` folders.
- `MuhdAqmarr/SenTracker` — cloned `/tmp/sentracker` (via `gh search repos`). README (Flagship + input/output + RLS table + Malaysian Context), `lib/nl/keywords.ts` + `date.ts`, `globals.css` HSL tokens. Next 14.
- `4kmal/krekfood` — cloned `/tmp/krekfood` (via `gh search repos`). ⚠️ README + deps read only, rendered UI UNVERIFIED. Vite+React (not Next), Supabase Edge Functions, Gemini, named palette claim. Fork of `hackathon-girls/orked`. Bounty #4 link in README: krackeddevs.com/code/bounty/viral-food-directory-map.
- Companion: `docs/WINNING_RUBRIC.md` (scoring weights, judge taste, wow-idea list — not re-derived here).
```
