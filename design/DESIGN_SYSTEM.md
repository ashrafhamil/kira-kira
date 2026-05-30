# Kira-Kira — Design System

> **Kira-Kira** · _colloquial Malay for "let's settle up / do the math."_
> Tagline: **"Jom settle, no drama."**
> Theme: **Kopitiam / Makan** — a warm, retro Malaysian coffee-shop aesthetic.
> Surface for: organizer creates a bill → shares a WhatsApp link → members pay
> via a simulated DuitNow QR → organizer dashboard tracks paid/unpaid with a
> progress ring + confetti at 100%.

**Design north star:** It should feel like a freshly-wiped marble kopitiam table
at 9am — warm, unfussy, a little nostalgic — but operate like a sharp modern
fintech. Premium = restraint + one or two unforgettable moments, not more chrome.

Mobile-first. Most sessions open from WhatsApp on a phone in one hand.

All tokens below map 1:1 to `design/theme.css`. Token names are canonical;
use the Tailwind utility (`bg-primary`, `text-paid-foreground`, `rounded-lg`…).

---

## 1. Color palette

Five kopitiam pigments + warm neutrals. Every pairing listed has been checked
for **WCAG AA (≥4.5:1)** for its intended use; AAA noted where it lands.

### Brand pigments (constant across light & dark)

| Role | Token | Hex | Notes |
|---|---|---|---|
| **Kopi** (espresso brown — primary / ink) | `--kopi-900` | `#2A1A12` | Headings on cream · AAA (15.3:1) |
| | `--kopi-600` | `#5A3A26` | Body text on cream · AAA (9.3:1) |
| | `--kopi-700` | `#4A2E1E` | Primary button fill (white text 12.3:1) |
| | `--kopi-400` | `#8A6A52` | Muted/secondary text · AA (4.5:1) |
| | `--kopi-100` | `#E9D8C4` | Dark-mode ink (light kopi on espresso) |
| **Krim** (condensed-milk cream — light surfaces) | `--krim-100` | `#FBF4E6` | App background |
| | `--krim-50` | `#FFFDF7` | Card surface |
| | `--krim-200` | `#F4E8D0` | Input wells |
| **Pandan-teal** (wall-tile — secondary/structure) | `--teal-400` | `#0F5C52` | Secondary button, focus ring (white 7.9:1) |
| | `--teal-200` | `#6FBFAE` | Tile patterns, illustration |
| **Sambal** (chili red — energy / CTA / alert) | `--sambal-500` | `#C8442B` | Accent fill, white text · AA (4.9:1) |
| | `--sambal-400` | `#D2462C` | Bright accent (icons, ring stop) |
| | `--sambal-600` | `#A8341E` | Sambal **as text** on cream · AA (6.0:1) → `text-sambal-text` |
| **Teh-tarik** (warm amber — pending / highlight) | `--teh-400` | `#C77F1A` | Amber fills, mid ring stop |
| | `--teh-500` | `#9A5B00` | Amber-as-text on cream |

> **Sambal rule:** bright sambal (`-400/-500`) is for **fills with white text**.
> When sambal needs to be **text on cream**, use `--sambal-text` (`#A8341E`).
> This single rule prevents the classic warm-palette contrast failure.

### Semantic surface & text tokens (these flip in dark mode)

| Token | Light | Dark |
|---|---|---|
| `--background` | `#FBF4E6` krim | `#17110C` espresso |
| `--surface` (cards) | `#FFFDF7` | `#22190F` |
| `--surface-raised` (QR card, modals) | `#FFFFFF` | `#2B2013` |
| `--surface-sunken` (inputs) | `#F4E8D0` | `#1B140D` |
| `--foreground` (headings) | `#2A1A12` | `#F3E7CE` |
| `--foreground-body` | `#5A3A26` | `#E4D3B7` |
| `--foreground-muted` | `#8A6A52` | `#C9B79A` |
| `--border` | `#E4D3B7` | `#3A2C1C` |
| `--border-strong` | `#CDB591` | `#4E3B26` |
| `--primary` / `--primary-foreground` | `#4A2E1E` / `#FFF9EE` | `#E9D8C4` / `#2A1A12` |
| `--accent` / `--accent-foreground` | `#C8442B` / `#FFFFFF` | `#D2462C` / `#FFFFFF` |
| `--secondary` / `--secondary-foreground` | `#0F5C52` / `#EAFBF6` | `#1A7A6D` / `#EAFBF6` |
| `--ring` (focus) | `#0F5C52` | `#5FD0BE` |

### Semantic status (paid / unpaid / pending) — chip text + bg pairs

| State | text token | bg token | Light (text/bg) | Dark (text/bg) |
|---|---|---|---|---|
| **Paid** | `--paid-foreground` | `--paid-bg` | `#1E6B3A` / `#DCEFD9` (AA 5.4) | `#7BD89A` / `#16301F` (AAA) |
| **Unpaid** | `--unpaid-foreground` | `--unpaid-bg` | `#B23A22` / `#FBE2DC` (AA 4.8) | `#F2937E` / `#3A1812` (AAA) |
| **Pending** | `--pending-foreground` | `--pending-bg` | `#9A5B00` / `#FBEBCB` (AA 4.6) | `#F0C46A` / `#34270C` (AAA) |

**WhatsApp:** `--whatsapp` `#1FA855` (light) / `#25D366` (dark) with
`--whatsapp-foreground` text. Used only on the nudge button — borrowed brand
equity, deployed sparingly.

---

## 2. Typography

Loaded via single Google Fonts `@import` in `theme.css` (verified live, with the
exact weights cited). next/font is the production upgrade (see theme.css notes).

| Family | Token | Role | Weights used |
|---|---|---|---|
| **Fraunces** (opsz serif) | `--font-display` / `font-display` | Display, headings, big money figures, the brand wordmark. Soft, warm, slightly "old-shop signage" — carries the whole personality. | 400, 600, 700 |
| **Plus Jakarta Sans** | `--font-sans` / `font-sans` | All UI, body, labels, inputs. Made in Indonesia — a quiet SEA-origin nod. Clean, friendly, neutral. | 400, 500, 600, 700, 800 |
| **Space Grotesk** | `--font-mono` / `font-mono` | Money amounts in dense rows, DuitNow reference IDs, QR strings. Tabular feel keeps ringgit columns aligned. | 500, 700 |

**Why this pairing:** Fraunces gives retro-kopitiam soul without kitsch; Jakarta
Sans keeps the product crisp and trustworthy (fintech-grade); Space Grotesk’s
near-mono numerals make money feel precise. No generic Inter/Roboto — that’s how
you out-class the clones.

### Type scale (mobile-first, rem @ 16px base)

| Step | Size / line | Font · weight | Use |
|---|---|---|---|
| Display | 2.5rem / 1.05 | Fraunces 700, `-0.02em` | Hero "RM" total, splash |
| H1 | 2rem / 1.1 | Fraunces 700 | Bill name |
| H2 | 1.5rem / 1.2 | Fraunces 600 | Section, "Siapa belum bayar" |
| H3 | 1.25rem / 1.25 | Fraunces 600 | Card titles |
| Body-lg | 1.125rem / 1.5 | Jakarta 400 | Lead paragraph |
| Body | 1rem / 1.55 | Jakarta 400 | Default |
| Label | 0.875rem / 1.4 | Jakarta 600 | Buttons, field labels |
| Caption | 0.75rem / 1.4 | Jakarta 500 | Helper, timestamps |
| Money-lg | 2rem / 1 | Space Grotesk 700, tabular | Total / per-person |
| Money | 1rem / 1 | Space Grotesk 500, tabular | Row amounts |

> Enable `font-variant-numeric: tabular-nums` on all money + the progress %.

---

## 3. Spacing, radii, shadows

**Spacing** — Tailwind default 4px scale. Mobile rhythm: screen padding `16px`
(`px-4`), card padding `20–24px`, stack gap `12–16px`, section gap `32px`.
Thumb-reach: primary actions live in the bottom third; min tap target **44×44px**.

**Radii** (`rounded-*`): `--radius-xs 6` (chips/badges) · `--radius-sm 10`
(inputs) · `--radius-md 16` (buttons, default card) · `--radius-lg 24` (hero &
QR card) · `--radius-xl 32` (bottom sheet). Generous radii = the soft,
melamine-crockery feel. Pills (`rounded-full`) for status badges + WhatsApp btn.

**Shadows** — warm-tinted (kopi, never pure black) in light; deep black in dark.
`--shadow-xs/sm/md/lg` plus `--shadow-glow-accent` (sambal glow) reserved for
the single primary CTA and the confetti moment. Elevation is earned, not sprayed.

---

## 4. Component specs

> Convention below: token → Tailwind utility. Default to tokens so dark mode is automatic.

### Primary button
- Fill `--primary` (`bg-primary`), text `--primary-foreground`, `rounded-md`,
  height `48px` mobile, label Jakarta 600, `px-5`.
- The **one hero CTA per screen** ("Settle now", "Bayar sekarang") uses
  `--accent` (sambal) + `--shadow-glow-accent` instead — sambal is the spark.
- States: hover `brightness-105`; active `scale-[0.98] translate-y-px`;
  focus `ring-2 ring-ring ring-offset-2 ring-offset-background`;
  disabled `opacity-50`. Full-width on mobile.

### Secondary button
- `bg-transparent`, `text-primary`, `border border-border-strong`, `rounded-md`.
  Or tonal variant: `bg-teal-50 text-secondary`. Same sizing as primary.

### Card
- `bg-surface`, `border border-border`, `rounded-lg`, `--shadow-sm`, `p-5`.
- Optional `.kopi-grain` (pure-CSS warm grain) on the app shell only.
- Hover (interactive cards): lift to `--shadow-md`, `-translate-y-0.5`, 150ms.

### Text input
- `bg-surface-sunken`, `border border-border`, `rounded-sm`, height `48px`,
  `px-4`, text `--foreground`, placeholder `--foreground-muted`.
- Focus: `border-ring` + `ring-2 ring-ring/30`. Error: `border-unpaid` + helper
  in `text-unpaid-foreground`. Money inputs use `font-mono` + a leading "RM"
  adornment in `--foreground-muted`.

### DuitNow QR payment card  ⭐ signature surface
- `bg-surface-raised`, `rounded-lg`, `--shadow-md`, `p-6`, centered column.
- **Top strip:** a thin DuitNow-style band — a `4px` gradient rule
  `linear-gradient(90deg, var(--ring-fill-from), var(--ring-fill-to))` — evoking
  the DuitNow ribbon without copying the logo.
- QR sits in a white rounded `--radius-md` tile with `border-border`; four small
  corner ticks (sambal) frame it like a scanner viewport.
- Below QR: amount in **Money-lg** (Space Grotesk), payee name (H3 Fraunces),
  and a `font-mono` reference ID in `--foreground-muted`.
- Footer: "Open in DuitNow app" secondary button + "Dah bayar?" confirm
  (accent). Simulated flow: tapping confirm triggers the success toast + dashboard update.

### Status badges (paid / unpaid / pending)
- `rounded-full`, `px-2.5 py-1`, Caption Jakarta 600, leading dot (`6px` circle)
  in the foreground color.
- **Paid:** `bg-paid-bg text-paid-foreground` · label "Settled ✅".
- **Unpaid:** `bg-unpaid-bg text-unpaid-foreground` · label "Belum bayar".
- **Pending:** `bg-pending-bg text-pending-foreground` · label "Checking…"
  with a soft 1.2s pulse on the dot only.

### Circular progress ring ⭐ centerpiece of the dashboard
- SVG ring, `track` = `--ring-track`, `fill` = conic/stroke gradient
  `--ring-fill-from → --ring-fill-to`; at 100% it morphs to `--ring-fill-done`.
- `stroke-linecap: round`, stroke width `~10%` of radius. Center label:
  Money-lg "RM 240 / 300" + Caption "8 of 10 dah settle".
- Animates from previous value on each payment (see Motion).

### WhatsApp nudge button ("stop chasing")
- `bg-whatsapp text-whatsapp-foreground`, `rounded-full`, WhatsApp glyph + label
  "Remind on WhatsApp". On a member row: compact icon-only pill.
- Tapping opens a prefilled `wa.me` message (templates in `copy.md`). Subtle
  press-scale; no glow (WhatsApp green is loud enough).

### Toasts
- `--surface-raised` bg, `--shadow-lg`, `rounded-md`, left accent bar `4px` in
  the semantic color, leading icon, Label text. Top-center on mobile, auto-dismiss 4s.
- Success "Settled lah! 🎉" (paid color) · Error (unpaid color) · Info (teal).

---

## 5. Motion (Framer Motion)

**Principles**
1. **Purposeful, not decorative.** Motion confirms state changes (paid → ring
   advances) and guides attention to the next action.
2. **Warm & springy, never bouncy-cartoon.** Default spring
   `{ type: "spring", stiffness: 320, damping: 28 }`. Durations 150–250ms for UI.
3. **Stagger lists.** Member rows enter with `staggerChildren: 0.05`,
   `y: 8 → 0`, `opacity: 0 → 1`.
4. **One emotional payload:** the 100% moment. Everything else is quiet.

**Key choreography**
- **Page/sheet:** bottom sheet slides up `y: 100% → 0` spring; backdrop fades.
- **Payment confirmed:** the paid row flips badge to "Settled ✅" with a quick
  `scale 1 → 1.06 → 1`; ring animates `pathLength`/stroke from old → new % over
  600ms ease-out; a small sambal→amber spark traces the new arc.
- **🎉 100% collected — the signature moment:**
  - Ring snaps to `--ring-fill-done`, center swaps to "Semua dah settle! 🎉".
  - **Confetti** bursts from the ring center — particles tinted in the brand
    pigments (kopi, krim, teal, sambal, teh), ~80 pieces, 2.5s, gravity + fade.
  - Card does one celebratory `scale 1 → 1.03 → 1` with a brief
    `--shadow-glow-accent` bloom. Optional haptic on mobile.
- **Toasts:** enter `y: -12 → 0` + fade, spring; exit fade + `y: -8`.

**Accessibility:** all of the above respect `prefers-reduced-motion` (theme.css
ships the global reduce override). With reduced motion: **no confetti, no
spark**; the ring updates via a 1-step opacity cross-fade and the celebration is
delivered as a static state + toast. State is never communicated by motion alone
(badges carry text + a dot, not just color).

---

## 6. Quick implementation checklist
1. Paste `theme.css` into `globals.css`, **replacing** the existing
   `@import "tailwindcss"` + `:root` + `@theme` block — do not append, or you’ll
   duplicate `@import "tailwindcss"`. (theme.css ships its own copy of that import.)
2. Use semantic utilities (`bg-surface`, `text-foreground-body`, `text-paid-foreground`).
3. Headings → `font-display`; money → `font-mono` + `tabular-nums`.
4. One sambal CTA per screen; everything else kopi/teal.
5. Confetti only at 100%, gated behind `prefers-reduced-motion`.
6. Keep Manglish load-bearing and sparse (see `copy.md`).
