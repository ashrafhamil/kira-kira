import type { ParticipantStatus } from "./types";
import { formatMoney } from "./format";

export const STATUS_LABEL: Record<ParticipantStatus, string> = {
  confirmed: "Settled ✅",
  claimed: "Checking…",
  unpaid: "Belum bayar",
};

export interface ReminderFields {
  name: string;
  amount: number;
  bill: string;
  link: string;
}

/** WhatsApp reminder templates — the "stop chasing" feature. */
export function reminderText(
  variant: "first" | "followup" | "blast" | "final",
  f: ReminderFields,
): string {
  const amount = formatMoney(f.amount).replace("RM ", "RM");
  switch (variant) {
    case "first":
      return `Hi ${f.name}! 👋 Quick one for *${f.bill}* — your share is ${amount}.\nSettle here whenever free, no rush: ${f.link}`;
    case "followup":
      return `Hey ${f.name}, still got ${amount} outstanding for *${f.bill}* 🙂\nDuitNow QR's in here — 30 seconds and you're done: ${f.link}`;
    case "final":
      return `${f.name}, last call for *${f.bill}* — ${amount} 😄\nSettle and I'll stop spamming you, promise: ${f.link}`;
    case "blast":
      return `Oi geng! 🍜 Still a few of us belum settle *${f.bill}*.\nTap, scan, done — link's here: ${f.link}. Jom clear it, no drama!`;
  }
}
