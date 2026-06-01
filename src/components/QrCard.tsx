"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { formatMoney } from "@/lib/format";

/** DuitNow-styled (simulated) QR card. Honest: labelled as a demo. */
export function QrCard({
  payload,
  amount,
  handle,
}: {
  payload: string;
  amount: number;
  handle?: string | null;
}) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    QRCode.toDataURL(payload, {
      margin: 1,
      width: 360,
      color: { dark: "#2A1A12", light: "#FFFFFF" },
      errorCorrectionLevel: "M",
    })
      .then(setSrc)
      .catch(() => setSrc(""));
  }, [payload]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-[var(--shadow-md)]">
      {/* DuitNow ribbon — brand-tinted (sambal → teh) to stay on-palette */}
      <div className="flex items-center justify-between bg-gradient-to-r from-sambal-500 via-sambal-400 to-teh-400 px-4 py-2 text-white">
        <span className="font-display text-sm font-bold tracking-wide">DuitNow</span>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
          Demo QR
        </span>
      </div>

      <div className="flex flex-col items-center gap-3 p-5">
        <div className="relative grid place-items-center rounded-xl bg-white p-3">
          {/* scanner corner ticks */}
          <span className="absolute left-1 top-1 size-4 rounded-tl-md border-l-2 border-t-2 border-sambal-500" />
          <span className="absolute right-1 top-1 size-4 rounded-tr-md border-r-2 border-t-2 border-sambal-500" />
          <span className="absolute bottom-1 left-1 size-4 rounded-bl-md border-b-2 border-l-2 border-sambal-500" />
          <span className="absolute bottom-1 right-1 size-4 rounded-br-md border-b-2 border-r-2 border-sambal-500" />
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="DuitNow QR (simulated)" width={180} height={180} className="size-44" />
          ) : (
            <div className="size-44 animate-pulse rounded bg-surface-sunken" />
          )}
        </div>

        <div className="text-center">
          <p className="font-mono-amount text-2xl font-bold text-foreground">
            {formatMoney(amount)}
          </p>
          {handle && (
            <p className="text-sm text-foreground-muted">to {handle}</p>
          )}
        </div>
        <p className="text-center text-[11px] leading-snug text-foreground-muted">
          Simulated DuitNow QR for this demo — no real charge is made. Scan or tap
          &ldquo;Dah bayar&rdquo; once you&rsquo;ve transferred.
        </p>
      </div>
    </div>
  );
}
