"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Sparkles } from "lucide-react";
import { scanReceiptAction } from "@/app/actions";

export interface ScanResult {
  items: { name: string; price: number }[];
  serviceCharge: number | null;
  sst: number | null;
  rounding: number | null;
  total: number | null;
}

/** Downscale + re-encode a phone photo so it fits the server-action body limit. */
async function compress(
  file: File,
): Promise<{ base64: string; mediaType: "image/jpeg" }> {
  const bitmap = await createImageBitmap(file);
  const maxEdge = 1500;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
  return { base64: dataUrl.split(",")[1] ?? "", mediaType: "image/jpeg" };
}

export function ScanReceipt({
  onScanned,
  className = "",
}: {
  onScanned: (r: ScanResult) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(file: File) {
    setError(null);
    setBusy(true);
    try {
      const { base64, mediaType } = await compress(file);
      const res = await scanReceiptAction({ base64, mediaType });
      if (res.ok) {
        onScanned({
          items: res.items,
          serviceCharge: res.serviceCharge,
          sst: res.sst,
          rounding: res.rounding,
          total: res.total,
        });
      } else {
        setError(res.error);
      }
    } catch {
      setError("Couldn't read that image — try another photo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-md)] border border-accent/40 bg-accent/10 px-4 py-3 font-semibold text-accent transition hover:border-accent/70 hover:bg-accent/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Reading your receipt…
          </>
        ) : (
          <>
            <Camera className="size-4" /> Scan or upload receipt
            <Sparkles className="size-3.5 text-sambal-600" />
          </>
        )}
      </button>
      {error ? (
        <p className="mt-2 text-sm font-medium text-unpaid-foreground">{error}</p>
      ) : (
        <p className="mt-2 text-center text-xs text-foreground-muted">
          Snap it or upload a photo — we&rsquo;ll fill in the items. You just tap
          who shares each.
        </p>
      )}
    </div>
  );
}
