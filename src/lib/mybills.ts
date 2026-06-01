export interface RememberedBill {
  token: string;
  title: string;
  ts: number;
}

const KEY = "kira-my-bills";
const MAX = 20;

export function getRememberedBills(): RememberedBill[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (b): b is RememberedBill => b && typeof b.token === "string",
    );
  } catch {
    return [];
  }
}

/** Upsert a bill into the device's remembered list (newest first, deduped). */
export function rememberBill(bill: { token: string; title: string }) {
  if (typeof window === "undefined" || !bill.token) return;
  try {
    const rest = getRememberedBills().filter((b) => b.token !== bill.token);
    const next = [
      { token: bill.token, title: bill.title || "Untitled bill", ts: Date.now() },
      ...rest,
    ].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage blocked — non-fatal */
  }
}
