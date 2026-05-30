import type { Bill, BillProgress, Participant } from "./types";

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatMoney(amount: number, currency = "MYR"): string {
  const value = (amount ?? 0).toFixed(2);
  if (currency === "MYR") return `RM ${value}`;
  return `${currency} ${value}`;
}

/** Normalize a Malaysian phone number to international digits for wa.me. */
export function normalizePhone(phone: string): string {
  let p = (phone || "").replace(/\D/g, "");
  if (!p) return "";
  if (p.startsWith("0")) p = "60" + p.slice(1);
  else if (!p.startsWith("60")) p = "60" + p;
  return p;
}

export function waLink(phone: string, text: string): string {
  const num = normalizePhone(phone);
  const base = num ? `https://wa.me/${num}` : `https://wa.me/`;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function computeProgress(
  bill: Pick<Bill, "total_amount">,
  participants: Participant[],
): BillProgress {
  const total = round2(bill.total_amount);
  let collected = 0;
  let pending = 0;
  let paidCount = 0;
  let pendingCount = 0;
  let unpaidCount = 0;
  for (const p of participants) {
    if (p.status === "confirmed") {
      collected += p.amount_owed;
      paidCount += 1;
    } else if (p.status === "claimed") {
      pending += p.amount_owed;
      pendingCount += 1;
    } else {
      unpaidCount += 1;
    }
  }
  collected = round2(collected);
  pending = round2(pending);
  const remaining = round2(Math.max(0, total - collected));
  const percent = total > 0 ? Math.min(100, Math.round((collected / total) * 100)) : 0;
  return {
    total,
    collected,
    pending,
    remaining,
    count: participants.length,
    paidCount,
    pendingCount,
    unpaidCount,
    percent,
  };
}
