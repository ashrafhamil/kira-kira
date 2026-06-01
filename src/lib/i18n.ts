export type Lang = "manglish" | "en";

export function normalizeLang(value: string | undefined | null): Lang {
  return value === "en" ? "en" : "manglish";
}

export interface BillStrings {
  startOwn: string;
  collectedBy: (name: string) => string;
  total: string;
  collectedSoFar: string;
  theDamage: string;
  unassigned: string;
  allSettled: string;
  toGo: (amount: string) => string;
  settledCount: (paid: number, total: number) => string;
  checkingSuffix: (n: number) => string;
  receiptStamp: string;
  // Pay panel
  yourShare: string;
  findYourName: string;
  yourShareIs: (name: string) => string;
  payNow: string;
  sending: string;
  attachProof: string;
  optional: string;
  allSettledMember: string;
  markedPaid: string;
  celebrateTitle: string;
  celebrateBody: (name: string) => string;
  celebrateStamp: string;
  done: string;
  status: { confirmed: string; claimed: string; unpaid: string };
}

const manglish: BillStrings = {
  startOwn: "Start your own",
  collectedBy: (n) => `Collected by ${n}`,
  total: "Total",
  collectedSoFar: "Collected so far",
  theDamage: "The damage",
  unassigned: "Unassigned",
  allSettled: "Semua dah settle!",
  toGo: (a) => `${a} to go`,
  settledCount: (paid, total) => `${paid} of ${total} settled`,
  checkingSuffix: (n) => ` · ${n} checking`,
  receiptStamp: "LUNAS",
  yourShare: "Your share",
  findYourName: "Find your name, scan the DuitNow QR, then tap Dah bayar.",
  yourShareIs: (n) => `${n}, your share is`,
  payNow: "Dah bayar",
  sending: "Sending…",
  attachProof: "Attach payment screenshot",
  optional: "(optional)",
  allSettledMember: "You're all settled. Nothing to pay.",
  markedPaid: "Marked as paid — the organizer will confirm shortly. Terima kasih!",
  celebrateTitle: "Settled lah!",
  celebrateBody: (n) =>
    `Terima kasih, ${n}. The organizer will confirm shortly — no more chasing.`,
  celebrateStamp: "DAH BAYAR",
  done: "Done",
  status: { confirmed: "Settled", claimed: "Checking…", unpaid: "Belum bayar" },
};

const en: BillStrings = {
  startOwn: "Start your own",
  collectedBy: (n) => `Collected by ${n}`,
  total: "Total",
  collectedSoFar: "Collected so far",
  theDamage: "The bill",
  unassigned: "Unassigned",
  allSettled: "All settled!",
  toGo: (a) => `${a} to go`,
  settledCount: (paid, total) => `${paid} of ${total} paid`,
  checkingSuffix: (n) => ` · ${n} checking`,
  receiptStamp: "PAID",
  yourShare: "Your share",
  findYourName: "Find your name, scan the DuitNow QR, then tap I've paid.",
  yourShareIs: (n) => `${n}, your share is`,
  payNow: "I've paid",
  sending: "Sending…",
  attachProof: "Attach payment screenshot",
  optional: "(optional)",
  allSettledMember: "You're all paid up. Nothing to pay.",
  markedPaid: "Marked as paid — the organizer will confirm shortly. Thank you!",
  celebrateTitle: "All done!",
  celebrateBody: (n) =>
    `Thank you, ${n}. The organizer will confirm shortly — no more chasing.`,
  celebrateStamp: "PAID",
  done: "Done",
  status: { confirmed: "Paid", claimed: "Checking…", unpaid: "Unpaid" },
};

export const billStrings: Record<Lang, BillStrings> = { manglish, en };
