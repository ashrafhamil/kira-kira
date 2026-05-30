"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import {
  claimPayment,
  createBill,
  getBillByManageToken,
  setConfirmation,
} from "@/lib/db";
import type { CreateBillInput } from "@/lib/types";

export async function createBillAction(input: CreateBillInput) {
  if (!input.title?.trim()) return { ok: false as const, error: "Bill needs a title." };
  if (!input.organizerName?.trim())
    return { ok: false as const, error: "Tell us who's collecting." };
  if (!input.participants?.length)
    return { ok: false as const, error: "Add at least one person." };
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
    await claimPayment(participantId, proofUrl);
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

/** Upload a payment screenshot to the public `proofs` bucket via service role. */
export async function uploadProofAction(formData: FormData) {
  const file = formData.get("file");
  const slug = String(formData.get("slug") || "");
  if (!(file instanceof File) || file.size === 0)
    return { ok: false as const, error: "No file." };
  if (file.size > 5 * 1024 * 1024)
    return { ok: false as const, error: "Image too big (max 5MB)." };
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    const path = `${slug || "misc"}/${Date.now()}-${Math.round(file.size)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from("proofs")
      .upload(path, buffer, { contentType: file.type || "image/png", upsert: false });
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
