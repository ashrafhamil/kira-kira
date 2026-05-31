"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { claimPaymentAction, uploadProofAction } from "@/app/actions";
import { QrCard } from "@/components/QrCard";
import { Stamp } from "@/components/Stamp";
import { Confetti } from "@/components/Confetti";
import { btn, card } from "@/components/ui";
import { formatMoney } from "@/lib/format";
import type { ParticipantStatus } from "@/lib/types";

interface Row {
  id: string;
  name: string;
  amount: number;
  status: ParticipantStatus;
}

export function PayPanel({
  slug,
  paymentHandle,
  qrPayload,
  participants,
}: {
  slug: string;
  paymentHandle: string | null;
  qrPayload: string;
  participants: Row[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [justPaid, setJustPaid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selected = participants.find((p) => p.id === selectedId) ?? null;

  function pay() {
    if (!selected) return;
    setError(null);
    startTransition(async () => {
      let proofUrl: string | null = null;
      const file = fileRef.current?.files?.[0];
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("slug", slug);
        const up = await uploadProofAction(fd);
        if (up.ok) proofUrl = up.url;
        else {
          setError(up.error);
          return;
        }
      }
      const res = await claimPaymentAction(slug, selected.id, proofUrl);
      if (res.ok) {
        setJustPaid(selected.name);
        setSelectedId(null);
      } else {
        setError(res.error);
      }
    });
  }

  function closeCelebration() {
    setJustPaid(null);
    router.refresh();
  }

  if (justPaid) {
    return (
      <section className={card + " flex flex-col items-center py-8 text-center"}>
        <Confetti fire />
        <Stamp label="DAH BAYAR" className="mb-4" />
        <h2 className="font-display text-2xl font-bold">Settled lah! 🎉</h2>
        <p className="mt-1 max-w-xs text-foreground-body">
          Terima kasih, {justPaid}. The organizer will confirm shortly — no more
          chasing.
        </p>
        <button
          type="button"
          onClick={closeCelebration}
          className={btn.primary + " mt-6"}
        >
          Done
        </button>
      </section>
    );
  }

  return (
    <section className={card + " p-5"}>
      <h2 className="font-display text-lg font-bold">Your share</h2>
      <p className="mt-1 text-sm text-foreground-body">
        Find your name, scan the DuitNow QR, then tap{" "}
        <span className="font-semibold">Dah bayar</span>.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {participants.map((p) => {
          const isSel = p.id === selectedId;
          const settled = p.status === "confirmed";
          const checking = p.status === "claimed";
          return (
            <button
              key={p.id}
              type="button"
              disabled={settled}
              onClick={() => setSelectedId(isSel ? null : p.id)}
              className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                settled
                  ? "border-paid/30 bg-paid-bg text-paid-foreground"
                  : checking
                    ? "border-pending/40 bg-pending-bg text-pending-foreground"
                    : isSel
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-surface text-foreground hover:bg-surface-sunken"
              }`}
            >
              {p.name}
              {settled ? " ✅" : checking ? " ⏳" : ""}
            </button>
          );
        })}
      </div>

      {selected && selected.status === "confirmed" && (
        <p className="mt-5 rounded-[var(--radius-sm)] bg-paid-bg px-4 py-3 text-sm font-medium text-paid-foreground">
          You&rsquo;re all settled. Nothing to pay 🎉
        </p>
      )}

      {selected && selected.status === "claimed" && (
        <p className="mt-5 rounded-[var(--radius-sm)] bg-pending-bg px-4 py-3 text-sm font-medium text-pending-foreground">
          Marked as paid — the organizer will confirm shortly. Terima kasih!
        </p>
      )}

      {selected && selected.status === "unpaid" && (
        <div className="mt-5 space-y-4">
          <div className="text-center">
            <p className="text-sm text-foreground-muted">
              {selected.name}, your share is
            </p>
            <p className="font-mono-amount text-3xl font-bold text-foreground">
              {formatMoney(selected.amount)}
            </p>
          </div>

          <QrCard payload={qrPayload} amount={selected.amount} handle={paymentHandle} />

          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground-body">
              Attach payment screenshot{" "}
              <span className="text-foreground-muted">(optional)</span>
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="block w-full text-sm text-foreground-body file:mr-3 file:rounded-full file:border-0 file:bg-surface-sunken file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-foreground"
            />
          </div>

          {error && (
            <p className="rounded-[var(--radius-sm)] bg-unpaid-bg px-4 py-3 text-sm font-medium text-unpaid-foreground">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={pay}
            disabled={pending}
            className={btn.accent + " w-full !py-3.5 text-base"}
          >
            {pending ? "Sending…" : "Dah bayar ✅"}
          </button>
        </div>
      )}
    </section>
  );
}
