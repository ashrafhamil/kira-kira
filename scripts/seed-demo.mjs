import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(url, key, { auth: { persistSession: false } });

const slug = "mamak-supper-demo";
const manage = "demomanageboardkirakira2026x";

const { data: existing } = await sb.from("bills").select("id").eq("slug", slug).maybeSingle();
if (existing) await sb.from("bills").delete().eq("id", existing.id);

const { data: bill, error } = await sb
  .from("bills")
  .insert({
    slug,
    manage_token: manage,
    title: "Mamak Supper 🍢",
    description: "Roti, teh tarik & maggi goreng",
    currency: "MYR",
    total_amount: 86.0,
    split_type: "equal",
    organizer_name: "Aiman",
    payment_handle: "012-345 6789",
    payment_qr_payload: "duitnow://pay?to=012-3456789&amount=86.00&ref=KIRA",
  })
  .select()
  .single();
if (error) throw error;

const now = new Date().toISOString();
const ppl = [
  ["Aiman", "confirmed"],
  ["Siti", "confirmed"],
  ["Hafiz", "claimed"],
  ["Mei Ling", "unpaid"],
  ["Raj", "unpaid"],
];
const { error: pErr } = await sb.from("participants").insert(
  ppl.map(([name, status], i) => ({
    bill_id: bill.id,
    name,
    amount_owed: 17.2,
    status,
    sort_order: i,
    confirmed_at: status === "confirmed" ? now : null,
    claimed_at: status !== "unpaid" ? now : null,
  })),
);
if (pErr) throw pErr;

console.log("seeded /b/" + slug + "  manage: /manage/" + manage);
