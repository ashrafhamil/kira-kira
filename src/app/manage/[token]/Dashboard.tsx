"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { confirmPaymentAction } from "@/app/actions";
import { rememberBill } from "@/lib/mybills";
import { TehGlass } from "@/components/TehGlass";
import { StatusBadge } from "@/components/StatusBadge";
import { CopyButton } from "@/components/CopyButton";
import { Confetti } from "@/components/Confetti";
import { btn, card } from "@/components/ui";
import { formatMoney, round2, waLink } from "@/lib/format";
import { reminderText } from "@/lib/copy";
import type { ParticipantStatus } from "@/lib/types";

interface Row {
  id: string;
  name: string;
  phone: string | null;
  amount: number;
  status: ParticipantStatus;
  proof_url: string | null;
}

export function Dashboard({
  manageToken,
  shareUrl,
  manageUrl,
  isNew,
  title,
  totalAmount,
  participants,
}: {
  manageToken: string;
  shareUrl: string;
  manageUrl: string;
  isNew?: boolean;
  title: string;
  organizerName: string;
  totalAmount: number;
  participants: Row[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(isNew);

  // Remember this bill on the device so the organizer can always find it again.
  useEffect(() => {
    rememberBill({ token: manageToken, title });
  }, [manageToken, title]);

  const collected = round2(
    participants.filter((p) => p.status === "confirmed").reduce((s, p) => s + p.amount, 0),
  );
  const remaining = round2(Math.max(0, totalAmount - collected));
  const percent = totalAmount > 0 ? Math.min(100, Math.round((collected / totalAmount) * 100)) : 0;
  const paidCount = participants.filter((p) => p.status === "confirmed").length;
  const checkingCount = participants.filter((p) => p.status === "claimed").length;

  const outstanding = participants.filter((p) => p.status !== "confirmed");
  const settled = participants.filter((p) => p.status === "confirmed");

  function toggle(id: string, confirmed: boolean) {
    setBusyId(id);
    startTransition(async () => {
      await confirmPaymentAction(manageToken, id, confirmed);
      setBusyId(null);
      router.refresh();
    });
  }

  function remindHref(p: Row) {
    return waLink(
      p.phone ?? "",
      reminderText("first", {
        name: p.name,
        amount: p.amount,
        bill: title,
        link: shareUrl,
      }),
    );
  }

  const blastHref = waLink(
    "",
    reminderText("blast", { name: "", amount: 0, bill: title, link: shareUrl }),
  );

  return (
    <div className="space-y-6">
      <Confetti fire={percent === 100 && participants.length > 0} />

      <div>
        <h1 className="text-2xl font-bold">Who&rsquo;s settled, who&rsquo;s not</h1>
        <p className="text-foreground-body">{title}</p>
      </div>

      {showNew && (
        <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border border-l-4 border-l-secondary bg-surface px-4 py-3 shadow-[var(--shadow-xs)]">
          <span className="text-lg">🎉</span>
          <div className="flex-1 text-sm">
            <p className="font-semibold text-foreground">Bill&rsquo;s live! Save your private link.</p>
            <p className="text-foreground-body">
              This dashboard is the only place you confirm payments — and there&rsquo;s
              no login to get back in. Copy or bookmark the private link below before
              you share.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNew(false)}
            aria-label="Dismiss"
            className="text-foreground-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>
      )}

      {/* Share */}
      <section className={card + " p-5"}>
        <h2 className="font-display text-lg font-bold">Send it to the group</h2>
        <div className="mt-3 flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface-sunken px-3 py-2.5">
          <span className="truncate font-mono-amount text-sm text-foreground-body">
            {shareUrl}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <CopyButton value={shareUrl} className={btn.primary + " flex-1 !py-2.5 text-sm"} />
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Jom settle *${title}* — ${shareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={btn.whatsapp + " flex-1 text-sm"}
          >
            Share on WhatsApp
          </a>
        </div>
        <p className="mt-2 text-xs text-foreground-muted">
          This is the public pay link — safe to share in the group.
        </p>
      </section>

      {/* Private dashboard link */}
      <section className={card + " border-l-4 border-l-teh-400 p-5"}>
        <h2 className="font-display text-lg font-bold">Your private dashboard link 🔑</h2>
        <p className="mt-1 text-sm text-foreground-body">
          Only you should have this — it&rsquo;s how you confirm payments, and the only
          way back in. Bills you open are also saved on this device.
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface-sunken px-3 py-2.5">
          <span className="truncate font-mono-amount text-sm text-foreground-body">
            {manageUrl}
          </span>
        </div>
        <CopyButton
          value={manageUrl}
          label="Copy private link"
          className={btn.ghost + " mt-3 w-full !py-2.5 text-sm"}
        />
      </section>

      {/* Progress hero */}
      <section className={card + " flex items-center gap-5 p-5"}>
        <TehGlass percent={percent} className="h-28 w-24 shrink-0" />
        <div className="min-w-0">
          <p className="font-display text-xl font-bold">
            {percent === 100 ? "Semua dah settle! 🎉" : formatMoney(collected)}
          </p>
          {percent !== 100 && (
            <p className="text-sm text-foreground-body">
              of {formatMoney(totalAmount)} · {formatMoney(remaining)} to go
            </p>
          )}
          <p className="mt-1 text-sm text-foreground-muted">
            {paidCount}/{participants.length} settled
            {checkingCount > 0 ? ` · ${checkingCount} checking` : ""}
          </p>
        </div>
      </section>

      {/* Outstanding */}
      {outstanding.length > 0 && (
        <section className={card + " p-5"}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Belum bayar</h2>
            <a
              href={blastHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-whatsapp hover:underline"
            >
              Nudge the rest
            </a>
          </div>
          <ul className="mt-3 space-y-3">
            {outstanding.map((p) => (
              <li
                key={p.id}
                className="rounded-[var(--radius-md)] border border-border bg-surface-raised p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">{p.name}</p>
                    <p className="font-mono-amount text-sm text-foreground-body">
                      {formatMoney(p.amount)}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                {p.proof_url && (
                  <a
                    href={p.proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-semibold text-secondary hover:underline"
                  >
                    View payment screenshot →
                  </a>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={remindHref(p)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btn.whatsapp + " flex-1 !py-2 text-sm"}
                  >
                    Remind on WhatsApp
                  </a>
                  <button
                    type="button"
                    disabled={pending && busyId === p.id}
                    onClick={() => toggle(p.id, true)}
                    className={btn.primary + " flex-1 !py-2 text-sm"}
                  >
                    {p.status === "claimed" ? "Confirm — Dah bayar ✅" : "Mark as paid"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Settled */}
      {settled.length > 0 && (
        <section className={card + " p-5"}>
          <h2 className="font-display text-lg font-bold">Dah settle</h2>
          <ul className="mt-3 space-y-2">
            {settled.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2 py-1">
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{p.name}</span>
                  <span className="font-mono-amount text-sm text-foreground-muted">
                    {formatMoney(p.amount)}
                  </span>
                </span>
                <button
                  type="button"
                  disabled={pending && busyId === p.id}
                  onClick={() => toggle(p.id, false)}
                  className="text-xs font-semibold text-foreground-muted hover:text-unpaid-foreground hover:underline"
                >
                  Undo
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
