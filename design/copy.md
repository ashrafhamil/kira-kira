# Kira-Kira — Microcopy Deck (Manglish)

**Voice:** confident, warm, lightly Manglish. Like a friend who’s good with
money and never makes it awkward. **One strong Manglish phrase beats five.**
English carries the meaning; Manglish carries the warmth. Never cringe, never
try-hard. When unsure, say it plainer.

**Do:** "Jom split", "Belum bayar", "Settled ✅", "Dah settle?", "No drama".
**Don’t:** pile on "lah/leh/lor/sia" in one line; mock dialect; over-emoji
(one per line, max). Numbers and amounts are always exact and clear.

---

## 1. Brand
- **Wordmark:** Kira-Kira
- **Tagline:** Jom settle, no drama.
- **One-liner:** Split the bill, share the link, get paid. Senang.

---

## 2. Buttons / actions
| Context | Label |
|---|---|
| Create a bill (primary) | Start a bill |
| Add the items / people | Jom split |
| Share to the group | Share link |
| Copy link | Copy link |
| Pay now (member, hero CTA) | Bayar sekarang |
| Open DuitNow (simulated) | Open DuitNow |
| Confirm payment | Dah bayar ✅ |
| Mark someone paid (organizer) | Mark as paid |
| Send a reminder | Remind on WhatsApp |
| Remind everyone unpaid | Nudge the rest |
| Close / done | Done |
| Back | Back |
| Secondary / cancel | Not now |

---

## 3. Headings
- Create: **Start a new bill**
- Items: **What’s the damage?**
- Split: **Who’s in?**
- Share: **Send it to the group**
- Member pay screen: **Your share**
- Dashboard: **Who’s settled, who’s not**
- Unpaid section: **Belum bayar**
- Paid section: **Dah settle**
- All done: **Semua dah settle! 🎉**

---

## 4. Empty states
| Screen | Heading | Sub |
|---|---|---|
| No bills yet | No bills yet | Start one and share the link. Takes 30 seconds. |
| No items added | Nothing here yet | Add what everyone makan and we’ll split it. |
| No one’s paid yet | Still waiting | Nobody’s paid yet — send a friendly nudge. |
| Everyone paid | Semua dah settle! 🎉 | Full house. Nothing left to chase. |
| Link expired | This bill’s closed | Ask the organizer to start a fresh one. |

---

## 5. Toasts
| Type | Message |
|---|---|
| Bill created | Bill’s live. Share the link! |
| Link copied | Link copied — paste in the group. |
| Payment confirmed (member) | Settled lah! 🎉 You’re all clear. |
| Marked paid (organizer) | Noted — marked as paid. |
| Reminder sent | Nudge sent. No drama. |
| 100% collected | Semua dah settle! 🎉 |
| Saved | Saved. |
| Undo available | Marked unpaid. Undo? |

---

## 6. Error messages
Keep blame off the user. State the fix.
| Where | Message |
|---|---|
| Empty amount | Pop in an amount first. |
| Invalid amount | That doesn’t look like ringgit — try again. |
| No name | Give this person a name first. |
| Empty bill | Add at least one item before sharing. |
| Network fail | Connection dropped. Tap to try again. |
| QR / payment failed | Payment didn’t go through. No charge made — try again. |
| Link broken | This link’s not working. Ask for a fresh one. |
| Generic | Alamak, something broke. Give it another go. |

---

## 7. WhatsApp reminder templates  ⭐ the "stop chasing" feature
Prefilled into `wa.me`. Warm, never naggy — the app does the chasing so the
organizer stays the good guy. `{name}` `{amount}` `{bill}` `{link}` are merge fields.

**T1 — First gentle nudge**
> Hi {name}! 👋 Quick one for *{bill}* — your share is RM{amount}.
> Settle here whenever free, no rush: {link}

**T2 — Friendly follow-up**
> Hey {name}, still got RM{amount} outstanding for *{bill}* 🙂
> DuitNow QR’s in here — 30 seconds and you’re done: {link}

**T3 — Group blast (all unpaid)**
> Oi geng! 🍜 Still a few of us belum settle *{bill}*.
> Tap, scan, done — link’s here: {link}. Jom clear it, no drama!

**T4 — Final, light-hearted**
> {name}, last call for *{bill}* — RM{amount} 😄
> Settle and I’ll stop spamming you, promise: {link}

---

## 8. Status labels (match DESIGN_SYSTEM badges)
- Paid → **Settled ✅**
- Unpaid → **Belum bayar**
- Pending/checking → **Checking…**

## 9. Microcopy guardrails
- Money: always `RM` + exact figure (e.g. `RM12.50`). Never round silently.
- One emoji per line, max — and only where it adds warmth (🎉 ✅ 👋 🍜).
- Manglish in labels/celebration; **plain, precise English in errors & amounts.**
- "No drama" is the brand refrain — use it at moments of relief, not everywhere.
