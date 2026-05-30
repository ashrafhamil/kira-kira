# Kira-Kira — How to WIN the KrackedDevs $500 Split-Bill Bounty

Reverse-engineered from past winners, the KrackedDevs platform, and the founder's stated taste.
Date compiled: 2026-05-30. Evidence is cited inline. Where something could not be verified, it is flagged as UNVERIFIED.

---

## 0. What I actually saw (evidence base)

| Source | Status | Key observations |
|---|---|---|
| **Laman Troka** (venue winner) — lamantroka.vercel.app | ✅ Loaded | Luxury-minimalist dark theme, gold/charcoal palette, rich venue photography, card-based venue grid with capacity/area specs, theme carousel, 6-up service feature grid, prominent "Reserve Now / Book Your Date" CTAs, "Est. 2009" + RM18,000 starting price + capacity 100–1,200 (committed, believable detail). Next.js + TypeScript (97.5%) + Tailwind + PostgreSQL (repo language stats). |
| **PWB Vanguard** (community reporter winner) — pwb-vanguard.vercel.app (→ custom domain pwb-vanguard.nurlinasyahiirah.my) | ✅ Loaded + full README | **The single most informative artifact.** See section below. Immersive "Tactical Terminal OS" concept, gamified (10-tier ranks, XP, 3 badges, leaderboard), EN/MS bilingual, PWA installable, Next.js 15 + Supabase (Postgres + RLS + Google OAuth + Storage), PL/pgSQL XP triggers, custom PDF report engine, weighted "Impact Score" algorithm. Winner mapped **every** bounty requirement to a labelled feature (RE-01…RE-10) and then listed named "beyond-requirements" innovations. Uses its own custom domain. |
| **SenTracker** (MYR expense tracker winner) — sentracker.vercel.app | ✅ Loaded | Natural-language entry ("RM12 Grab to KLCC"), phone-mockup hero, "JUST TYPE. WE TRACK." bold headline, feature cards (Natural Language Engine, Liquid Budgets, Cinematic Analytics), budget progress ring (82% used), **🔥 3-day streak gamification**, "low-motion" accessibility toggle, fake social proof (4.9/5, 10k+ tx). **Deep Malaysian localization is the headline**: native RM formatting, understands "Mamak" vs fine dining, parses "semalam" (yesterday). Open-source, GitHub auth. |
| **KrekFood** (viral food map winner) — krekfood.vercel.app | ⚠️ UNVERIFIED | Client-rendered SPA; only the page `<title>` ("KrekFood \| Kracked Devs") rendered to the fetcher and it is not third-party-indexed. Could not inspect the actual UI. Treat any KrekFood-specific claim as unconfirmed. The category itself ("viral food map") signals the community rewards locally-viral, shareable, social consumer products. |
| **Rembayung / Khairul Aming redesign** — ajwdxr.free.nf/rembayung | ⚠️ UNVERIFIED | Hosted on InfinityFree (free.nf); returns a JS-gate ("This site requires Javascript") to non-browser agents and 403s WebFetch. Could not inspect. Note only: the winning brief was a **restaurant redesign of a famous local F&B brand (Khairul Aming)** — i.e. the community rewards taking a beloved Malaysian brand and making it look premium. |

**Honest caveat:** 3 of 5 reference sites were fully inspected. The two food/F&B sites are client-rendered SPAs that did not yield content; conclusions lean on the 3 verified winners + platform + founder signals, which are mutually consistent.

---

## 1. How bounties are submitted & judged (mechanism)

**This is a synthesis of split evidence — read both halves:**

- **Submission is ON-PLATFORM, not via an X post or a Google Form.** The KrackedDevs changelog states submissions accept **comma-separated URLs** for "live demos and deployment links" alongside the repo, and admin dashboards "render all submitted links for easier review and showcasing." So you submit your **live URL + GitHub repo** through the bounty entry on krackeddevs.com/code/bounty. (FAQ confirms bounties live in the Bounties section; XP is granted only for platform bounties.)
- **Winners are ANNOUNCED on X** by the founder **Danial (@masterofnone)** — winner posts and community hype surface there and in Discord. So: *submit on-site, expect the win to be celebrated on X/Discord.* Tagging @KrackedDevs / posting your build on X is good for visibility but is **not** the formal submission channel.
- **XP economy (from FAQ, verbatim):** Bounty Submission **+20 XP**; Honorable Mention (approved, not winner) **+50 XP**; Bounty Win **Base 100 XP + Bonus = Reward / 10**. Implication: there are **honorable mentions**, so a strong-but-not-winning entry still gets recognized — polish is never wasted.
- **Judge:** effectively the founder / KrackedDevs core team (Danial, @masterofnone). There is no published rubric. Judging is **taste-driven**, not checklist-scored — which is exactly why visual polish, concept, and local resonance dominate.

**Deadline & exact reward terms for the CURRENT Split-Bill bounty: VERIFY ON THE LIVE BOARD.** The board is a client-rendered SPA and API probes returned only the app shell, so I could not extract the live deadline. Do **not** assume PWB's `14 FEB 2026 15:59 GMT+8` — that was a *different past bounty* (it does confirm the format: a hard date + time in **GMT+8** down to the minute). Check krackeddevs.com/code/bounty for the Split-Bill bounty's own deadline before planning.

**Format rules to assume (evidence-backed):** public GitHub repo + live deployed URL (Vercel is the norm — every verified winner is on Vercel; a custom domain like PWB's is a bonus flourish). README should explicitly map your features to the brief.

---

## 2. The founder's taste (what the judge rewards)

Danial / @masterofnone, founder, stated ethos — quote his own words:
- *"help Malaysia by creating **beautiful software for the Rakyat** 🔥"*
- *"turn 1,000 Malaysians into Kracked Devs… bring more money home to their Families"*
- Hiring a UI/UX designer, he wrote: *"clean flows, fast iterations… **Hate boring corporate vibes?**"*

**Translation:** he rewards (1) genuine **visual beauty / craft**, (2) **distinctly Malaysian** soul, (3) **clean, fast, non-corporate** UX, (4) products that feel like they help ordinary Malaysians. "Vibe coding" with AI is openly embraced (PWB's README brags about building with Gemini 3 + Claude Opus) — so velocity + polish beats hand-rolled-from-scratch purity.

---

## 3. WINNING RUBRIC — scoring dimensions & weights

These weights reflect what actually separated the winners (taste-judged, design-heavy):

| # | Dimension | Weight | What "10/10" looks like here |
|---|---|---:|---|
| 1 | **Visual polish & craft** | **30%** | A cohesive, opinionated theme executed cleanly. Custom palette, real typographic hierarchy, micro-interactions, motion, empty/loading states. Looks like a real product, not a CRUD demo. (Laman Troka's luxe restraint; SenTracker's "cinematic" cards + progress rings.) |
| 2 | **Concept / creativity / theme** | **20%** | One strong, memorable concept executed end-to-end. PWB committed fully to a "Tactical Terminal OS" world; SenTracker to "just type, we track." Half-themes read as unfinished. → For us: **kopitiam/makan** identity carried through every screen. |
| 3 | **Local cultural resonance** | **20%** | Unmistakably Malaysian. SenTracker won largely on this (Mamak, "semalam", RM). DuitNow/DuitNow QR, kopitiam language, WhatsApp-native, ringgit everywhere, local makan archetypes. |
| 4 | **Completeness vs the brief** | **15%** | Every brief requirement working, demonstrably. PWB literally enumerated RE-01…RE-10. Nothing in the brief should be missing or obviously stubbed. |
| 5 | **Mobile / WhatsApp-share UX** | **10%** | Flawless on a phone; share link generates a rich WhatsApp preview; the payment-confirm flow is dead-simple on mobile. Brief explicitly calls out WhatsApp. |
| 6 | **"Beyond-requirements" delta** | **5%** | Named extra features that show ambition (PWB's PDF engine, Impact Score; SenTracker's NL engine, streaks). Small but a tiebreaker for the win vs honorable mention. |

Tie-break philosophy: between two complete apps, **the more beautiful + more Malaysian one wins.** Completeness gets you to the shortlist; polish + local soul win it.

---

## 4. Must-haves (or you get eliminated)

Every item in the brief, actually working on the live deploy:
- [ ] Organizer creates a bill: **title, total amount, participants, due date, description**.
- [ ] **Shareable payment link** generated (unique URL per bill, opens without login).
- [ ] Members **confirm payment** via that link (simulated payment is explicitly allowed — use it; don't burn time on a real gateway).
- [ ] **Organizer dashboard**: paid/unpaid per person, **total collected**, **remaining**, **progress** (a progress bar/ring — winners all use them).
- [ ] **Mobile-perfect** + the share action produces a clean **WhatsApp preview** (Open Graph image/title/desc on the bill link).
- [ ] **Live deployed URL** (Vercel) + **public GitHub repo** with a README that maps features to the brief.
- [ ] Currency is **RM/MYR**, formatted natively (RM 12.50), throughout.
- [ ] No dead buttons, no console errors, working empty/loading/success states.

---

## 5. Common mistakes that lose

- **Generic UI** — default shadcn/Tailwind with no theme, no identity. Reads as "tutorial project." (The opposite of every winner.)
- **Half-committed theme** — a kopitiam logo but otherwise a plain SaaS dashboard. Winners commit *fully* to their world.
- **No local soul** — could be from anywhere. SenTracker's win shows local-specificity is a primary axis, not decoration.
- **Broken on mobile / ugly WhatsApp preview** — fatal given the brief names WhatsApp.
- **Missing a brief item** — e.g. dashboard shows total but not "remaining," or no due date. Enumerate the brief and check each off (do what PWB did).
- **Over-engineering the wrong thing** — real Stripe integration instead of the allowed simulated payment, while the UI stays plain. Spend the budget on polish, not plumbing.
- **No live demo or private repo** — submission needs a live URL + public repo.
- **Lifeless copy** — placeholder lorem / robotic strings. Winners write with voice (SenTracker's "JUST TYPE. WE TRACK.").

---

## 6. "WOW" ideas a KrackedDevs judge would reward (split-bill specific)

Pick 3–4 and execute them flawlessly — depth beats a long shallow list.

1. **Kopitiam receipt as the core metaphor.** The bill renders as a thermal-printer makan receipt (monospace, dashed tear-edges, "TERIMA KASIH / JEMPUT DATANG LAGI" footer). Paid items get a red "LUNAS / PAID" chop stamp animation. This is the single highest-leverage idea — it nails polish + theme + Malaysian soul at once.

2. **DuitNow QR-style simulated payment.** The confirm screen shows a Malaysian-style QR (DuitNow look). Tapping "I've paid" plays a success state mimicking a local banking app (MAE / Touch 'n Go vibe). Simulated, but instantly recognizable to a Malaysian judge.

3. **WhatsApp-first share with a rich, generated OG card.** The share button opens WhatsApp with a pre-filled Manglish message ("Eh korang, settle our makan kira-kira ya 🙏 RM X each") and the link unfurls a custom OG image showing the bill + progress. Mobile share is in the brief — make it *delightful*.

4. **Live "kuah/tealeaf fills the glass" progress.** Collection progress visualized as a teh tarik glass / kopitiam cup filling up (instead of a plain bar). Animated, satisfying, on-theme. (Winners lean hard on progress visualizations — SenTracker's rings, PWB's bars.)

5. **Per-person Manglish nudge + status.** Each unpaid member shows a playful "belum bayar" tag; organizer can fire a one-tap WhatsApp reminder with auto-filled cheeky text. Real friction-killer for the actual use case (chasing friends to pay).

6. **Smart split modes.** Beyond equal split: split by item (assign satay to Ali, roti to Mira), or "I'll cover the kuih" partial amounts. Shows product thinking the way PWB's extra modules did — a tiebreaker delta.

7. **Settle-up celebration.** When the last person pays and collection hits 100%, a kopitiam confetti / "SEMUA DAH SETTLE! 🎉" moment. Winners reward emotional payoff; this is the screenshot people share.

8. **Bilingual EN/BM toggle + ringgit-native everywhere.** PWB and SenTracker both leaned bilingual/local-language. A clean BM/EN toggle with natural Manglish copy signals "built for the Rakyat."

**Recommended core combo for max win-probability:** #1 (receipt metaphor) + #2 (DuitNow QR confirm) + #3 (WhatsApp OG share) + #4 (teh tarik progress). That bundle scores hard on all six rubric dimensions simultaneously.

---

## 7. Execution checklist (turn the rubric into a build plan)

- Stack to mirror winners: **Next.js (App Router) + Tailwind + Supabase (Postgres/RLS, simple anon flow) + Vercel.** Optional custom domain for the PWB-style flourish.
- Theme system first: lock the kopitiam palette + type + the receipt component before building CRUD, so polish is structural, not bolted on.
- Implement **dynamic OG image** generation for bill links (Next.js `opengraph-image`) — this is the WhatsApp wow with low effort.
- Seed a **realistic demo bill** (real makan items, RM amounts, a few "paid" people) so judges land on a populated, alive screen — never an empty dashboard. (Laman Troka's committed details; PWB shipped demo data deliberately.)
- README: open with a feature-to-brief mapping table (copy PWB's pattern), screenshots, the live link, and the local-flavor pitch. Mention the design intent.
- Polish pass before submit: loading skeletons, empty states, success animations, mobile at 375px, zero console errors, fast LCP.
- **Before submitting, re-check the live bounty page for the exact deadline (GMT+8) and any submission field requirements**, then submit live URL + repo URL on-platform.

---

## Appendix — primary sources

- KrackedDevs bounty board: https://krackeddevs.com/code/bounty (client-rendered; check live for current bounty terms)
- KrackedDevs FAQ (XP economy, honorable mentions): https://krackeddevs.com/faq
- KrackedDevs changelog (submission = live demo + deploy URLs): https://krackeddevs.com/changelog
- Founder Danial / @masterofnone: https://x.com/masterofnone ("beautiful software for the Rakyat"; "hate boring corporate vibes")
- Winner — Laman Troka: https://lamantroka.vercel.app/ · repo https://github.com/danishsenju/Wedding-hall-booking (Next.js/TS/Tailwind/Postgres)
- Winner — PWB Vanguard: https://pwb-vanguard.vercel.app/ · repo https://github.com/syahiirah95/pwb-vanguard (README is the key artifact: RE-01…RE-10 mapping, RM500, GMT+8 deadline format, vibe-coding, EN/MS, PWA, Supabase)
- Winner — SenTracker: https://sentracker.vercel.app/ (Malaysian NL entry, Mamak/"semalam"/RM, streaks)
- Winner — KrekFood: https://krekfood.vercel.app/ (UNVERIFIED — SPA, not indexed)
- Winner — Rembayung/Khairul Aming redesign: https://ajwdxr.free.nf/rembayung/ (UNVERIFIED — JS-gated host)
- Example winner writeup: https://zafranudin.my/portfolio/kracked-dev (RM100 landing-page bounty, won in a weekend; 403 to fetcher, surfaced via search)
