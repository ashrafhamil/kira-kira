"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import {
  billExists,
  claimPayment,
  createBill,
  getBillByManageToken,
  setConfirmation,
} from "@/lib/db";
import { scanReceipt } from "@/lib/scan";
import type { CreateBillInput } from "@/lib/types";

const MAX_PARTICIPANTS = 100;
const MAX_AMOUNT = 1_000_000;

export async function createBillAction(input: CreateBillInput) {
  if (!input.title?.trim()) return { ok: false as const, error: "Bill needs a title." };
  if (!input.organizerName?.trim())
    return { ok: false as const, error: "Tell us who's collecting." };
  if (!input.participants?.length)
    return { ok: false as const, error: "Add at least one person." };
  if (input.participants.length > MAX_PARTICIPANTS)
    return { ok: false as const, error: `That's a lot of people — max ${MAX_PARTICIPANTS}.` };
  if (input.participants.some((p) => !p.name?.trim()))
    return { ok: false as const, error: "Give everyone a name first." };
  const total = Number(input.totalAmount);
  if (!Number.isFinite(total) || total <= 0 || total > MAX_AMOUNT)
    return { ok: false as const, error: "That doesn't look like ringgit — try again." };
  if (
    input.splitType === "custom" &&
    input.participants.some(
      (p) => !Number.isFinite(Number(p.amount)) || Number(p.amount) < 0,
    )
  )
    return { ok: false as const, error: "Check the custom amounts — they must be valid." };
  try {
    const { slug, manageToken } = await createBill(input);
    return { ok: true as const, slug, manageToken };
  } catch (e) {
    console.error("createBillAction", e);
    return { ok: false as const, error: "Couldn't create the bill. Try again." };
  }
}

export async function claimPaymentAction(
  slug: string,
  participantId: string,
  proofUrl?: string | null,
) {
  try {
    await claimPayment(slug, participantId, proofUrl);
    revalidatePath(`/b/${slug}`);
    return { ok: true as const };
  } catch (e) {
    console.error("claimPaymentAction", e);
    return { ok: false as const, error: "Couldn't update. Try again." };
  }
}

export async function confirmPaymentAction(
  manageToken: string,
  participantId: string,
  confirmed: boolean,
) {
  try {
    await setConfirmation(manageToken, participantId, confirmed);
    revalidatePath(`/manage/${manageToken}`);
    return { ok: true as const };
  } catch (e) {
    console.error("confirmPaymentAction", e);
    return { ok: false as const, error: "Couldn't update. Try again." };
  }
}

const ALLOWED_IMAGE: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

/** Upload a payment screenshot to the public `proofs` bucket via service role.
 *  Scoped to a real bill, image-only, with a randomized object key. */
export async function uploadProofAction(formData: FormData) {
  const file = formData.get("file");
  const slug = String(formData.get("slug") || "");
  if (!(file instanceof File) || file.size === 0)
    return { ok: false as const, error: "No file." };
  if (file.size > 5 * 1024 * 1024)
    return { ok: false as const, error: "Image too big (max 5MB)." };

  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const contentType = ALLOWED_IMAGE[ext];
  if (!contentType)
    return { ok: false as const, error: "Only PNG, JPG or WEBP images." };

  if (!slug || !(await billExists(slug)))
    return { ok: false as const, error: "Unknown bill." };

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const path = `${slug}/${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from("proofs")
      .upload(path, buffer, { contentType, upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from("proofs").getPublicUrl(path);
    return { ok: true as const, url: data.publicUrl };
  } catch (e) {
    console.error("uploadProofAction", e);
    return { ok: false as const, error: "Upload failed." };
  }
}

export async function refetchManaged(manageToken: string) {
  return getBillByManageToken(manageToken);
}

const SCAN_MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
type ScanMediaType = (typeof SCAN_MEDIA_TYPES)[number];
// Client downscales to ~300KB; base64 inflates ~4/3, so cap the encoded string.
const SCAN_MAX_BASE64 = 2_800_000; // ~2MB decoded

/** Read a receipt photo into structured line items via Claude vision.
 *  Stateless — the image is never persisted. */
export async function scanReceiptAction(input: {
  base64: string;
  mediaType: string;
}) {
  const base64 = typeof input?.base64 === "string" ? input.base64 : "";
  const mediaType = input?.mediaType as ScanMediaType;
  if (!base64) return { ok: false as const, error: "No image." };
  if (!SCAN_MEDIA_TYPES.includes(mediaType))
    return { ok: false as const, error: "Only JPG, PNG or WEBP." };
  if (base64.length > SCAN_MAX_BASE64)
    return { ok: false as const, error: "Image too big — try a closer, smaller photo." };
  if (!process.env.ANTHROPIC_API_KEY)
    return { ok: false as const, error: "Receipt scanning isn't configured." };

  try {
    const result = await scanReceipt(base64, mediaType);
    if (!result.items.length)
      return {
        ok: false as const,
        error: "Couldn't read any items — try a clearer photo or add them manually.",
      };
    return { ok: true as const, ...result };
  } catch (e) {
    console.error("scanReceiptAction", e);
    return { ok: false as const, error: "Scan failed — add the items manually." };
  }
}
