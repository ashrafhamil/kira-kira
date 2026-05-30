import "server-only";
import { createClient } from "@supabase/supabase-js";
import { newManageToken, newSlug } from "./ids";
import { round2 } from "./format";
import type {
  Bill,
  BillWithParticipants,
  CreateBillInput,
  Participant,
} from "./types";

function service() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars are not configured");
  return createClient(url, key, { auth: { persistSession: false } });
}

// PostgREST returns numeric columns as strings to preserve precision.
function mapBill(row: Record<string, unknown>): Bill {
  return {
    ...(row as unknown as Bill),
    total_amount: Number(row.total_amount),
  };
}

function mapParticipant(row: Record<string, unknown>): Participant {
  return {
    ...(row as unknown as Participant),
    amount_owed: Number(row.amount_owed),
  };
}

function buildQrPayload(handle: string | undefined, amount: number): string {
  const to = (handle || "kira-kira").trim();
  return `duitnow://pay?to=${encodeURIComponent(to)}&amount=${amount.toFixed(2)}&ref=KIRA`;
}

function splitAmounts(input: CreateBillInput): { amounts: number[]; total: number } {
  const n = input.participants.length;
  if (n === 0) return { amounts: [], total: round2(input.totalAmount) };
  if (input.splitType === "equal") {
    const total = round2(input.totalAmount);
    const per = round2(total / n);
    const amounts = Array(n).fill(per);
    // Push any rounding remainder onto the last person so the sum is exact.
    const drift = round2(total - per * n);
    amounts[n - 1] = round2(amounts[n - 1] + drift);
    return { amounts, total };
  }
  const amounts = input.participants.map((p) => round2(p.amount ?? 0));
  const total = round2(amounts.reduce((a, b) => a + b, 0));
  return { amounts, total };
}

export async function createBill(
  input: CreateBillInput,
): Promise<{ slug: string; manageToken: string }> {
  const supabase = service();
  const slug = newSlug();
  const manageToken = newManageToken();
  const { amounts, total } = splitAmounts(input);

  const { data: bill, error } = await supabase
    .from("bills")
    .insert({
      slug,
      manage_token: manageToken,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      currency: input.currency || "MYR",
      total_amount: total,
      split_type: input.splitType,
      due_date: input.dueDate || null,
      organizer_name: input.organizerName.trim(),
      payment_handle: input.paymentHandle?.trim() || null,
      payment_qr_payload: buildQrPayload(input.paymentHandle, total),
    })
    .select()
    .single();
  if (error || !bill) throw error ?? new Error("Failed to create bill");

  const rows = input.participants.map((p, i) => ({
    bill_id: bill.id,
    name: p.name.trim(),
    phone: p.phone?.trim() || null,
    amount_owed: amounts[i] ?? 0,
    sort_order: i,
  }));
  const { error: pErr } = await supabase.from("participants").insert(rows);
  if (pErr) throw pErr;

  return { slug, manageToken };
}

async function fetchBill(
  column: "slug" | "manage_token",
  value: string,
): Promise<BillWithParticipants | null> {
  const supabase = service();
  const { data: bill } = await supabase
    .from("bills")
    .select("*")
    .eq(column, value)
    .maybeSingle();
  if (!bill) return null;
  const { data: participants } = await supabase
    .from("participants")
    .select("*")
    .eq("bill_id", bill.id)
    .order("sort_order", { ascending: true });
  return {
    ...mapBill(bill),
    participants: (participants ?? []).map(mapParticipant),
  };
}

export function getBillBySlug(slug: string) {
  return fetchBill("slug", slug);
}

export function getBillByManageToken(token: string) {
  return fetchBill("manage_token", token);
}

/** A member taps "I've paid". Moves unpaid -> claimed (awaiting confirmation). */
export async function claimPayment(
  participantId: string,
  proofUrl?: string | null,
): Promise<void> {
  const supabase = service();
  const { error } = await supabase
    .from("participants")
    .update({
      status: "claimed",
      proof_url: proofUrl || null,
      claimed_at: new Date().toISOString(),
    })
    .eq("id", participantId);
  if (error) throw error;
}

/** Organizer confirms (or un-confirms) a payment. Guarded by manage token. */
export async function setConfirmation(
  manageToken: string,
  participantId: string,
  confirmed: boolean,
): Promise<void> {
  const supabase = service();
  const { data: bill } = await supabase
    .from("bills")
    .select("id")
    .eq("manage_token", manageToken)
    .maybeSingle();
  if (!bill) throw new Error("Not authorized");

  const { error } = await supabase
    .from("participants")
    .update(
      confirmed
        ? { status: "confirmed", confirmed_at: new Date().toISOString() }
        : { status: "unpaid", confirmed_at: null, claimed_at: null, proof_url: null },
    )
    .eq("id", participantId)
    .eq("bill_id", bill.id);
  if (error) throw error;
}
