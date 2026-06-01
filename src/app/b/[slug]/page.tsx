import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ReceiptText } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangToggle } from "@/components/LangToggle";
import { Stamp } from "@/components/Stamp";
import { TehGlass } from "@/components/TehGlass";
import { StatusBadge } from "@/components/StatusBadge";
import { card } from "@/components/ui";
import { getBillBySlug } from "@/lib/db";
import { computeProgress, formatMoney } from "@/lib/format";
import { billStrings, normalizeLang } from "@/lib/i18n";
import { PayPanel } from "./PayPanel";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bill = await getBillBySlug(slug);
  if (!bill) return { title: "Bill not found" };
  return {
    title: bill.title,
    description: `${bill.organizer_name} is collecting ${formatMoney(bill.total_amount)} for ${bill.title}. Tap to pay your share.`,
  };
}

export default async function BillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bill = await getBillBySlug(slug);
  if (!bill) notFound();

  const lang = normalizeLang((await cookies()).get("kira-lang")?.value);
  const t = billStrings[lang];
  const progress = computeProgress(bill, bill.participants);
  const due = bill.due_date
    ? new Date(bill.due_date).toLocaleDateString("en-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col px-5">
      <header className="flex items-center justify-between py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <LangToggle
            lang={lang}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-surface-sunken"
          />
          <ThemeToggle />
          <Link href="/create" className="text-sm font-semibold text-foreground-muted">
            {t.startOwn}
          </Link>
        </div>
      </header>

      <main className="space-y-6 pb-16">
        {/* Receipt */}
        <section className={card + " overflow-hidden p-0"}>
          <div className="receipt-edge bg-surface-raised px-6 pt-7 pb-6">
            <p className="text-center font-mono-amount text-xs uppercase tracking-[0.3em] text-foreground-muted">
              Kira-Kira
            </p>
            <h1 className="mt-1 text-center font-display text-2xl font-bold">
              {bill.title}
            </h1>
            <p className="mt-1 text-center text-sm text-foreground-muted">
              {t.collectedBy(bill.organizer_name)}
              {due ? ` · due ${due}` : ""}
            </p>
            {bill.description && (
              <p className="mt-1 text-center text-sm text-foreground-body">
                {bill.description}
              </p>
            )}

            <div className="my-4 border-t border-dashed border-border" />

            <ul className="space-y-2.5">
              {bill.participants.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{p.name}</span>
                    {p.status === "confirmed" && (
                      <Stamp label={t.receiptStamp} className="scale-75" />
                    )}
                  </span>
                  <span className="flex items-center gap-2.5">
                    <span className="font-mono-amount text-foreground-body">
                      {formatMoney(p.amount_owed)}
                    </span>
                    {p.status !== "confirmed" && (
                      <StatusBadge status={p.status} labels={t.status} />
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="my-4 border-t border-dashed border-border" />

            <div className="flex items-center justify-between">
              <span className="font-display text-base font-bold">{t.total}</span>
              <span className="font-mono-amount text-3xl font-bold text-foreground">
                {formatMoney(progress.total)}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm text-foreground-muted">
              <span>{t.collectedSoFar}</span>
              <span className="font-mono-amount">{formatMoney(progress.collected)}</span>
            </div>
          </div>
        </section>

        {/* Item breakdown (by-item split) */}
        {bill.items.length > 0 && (
          <section className={card + " p-5"}>
            <h2 className="flex items-center gap-2 font-display text-lg font-bold">
              <ReceiptText className="size-4 text-kopi-500" aria-hidden />
              {t.theDamage}
            </h2>
            <ul className="mt-3 space-y-2.5">
              {bill.items.map((it) => {
                const names = it.shared_by
                  .map((id) => bill.participants.find((p) => p.id === id)?.name)
                  .filter(Boolean);
                return (
                  <li
                    key={it.id}
                    className="flex items-start justify-between gap-3 border-b border-dashed border-border pb-2.5 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{it.name}</p>
                      <p className="text-xs text-foreground-muted">
                        {names.length ? names.join(", ") : t.unassigned}
                      </p>
                    </div>
                    <span className="font-mono-amount shrink-0 text-foreground-body">
                      {formatMoney(it.price)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Progress glance */}
        <section className={card + " flex items-center gap-4 p-5"}>
          <TehGlass percent={progress.percent} className="h-24 w-20 shrink-0" />
          <div>
            <p className="font-display text-lg font-bold">
              {progress.percent === 100
                ? t.allSettled
                : t.toGo(formatMoney(progress.remaining))}
            </p>
            <p className="text-sm text-foreground-body">
              {t.settledCount(progress.paidCount, progress.count)}
              {progress.pendingCount > 0 ? t.checkingSuffix(progress.pendingCount) : ""}
            </p>
          </div>
        </section>

        {/* Pay */}
        <PayPanel
          slug={bill.slug}
          lang={lang}
          paymentHandle={bill.payment_handle}
          qrPayload={bill.payment_qr_payload ?? `kira:${bill.slug}`}
          participants={bill.participants.map((p) => ({
            id: p.id,
            name: p.name,
            amount: p.amount_owed,
            status: p.status,
          }))}
        />
      </main>
    </div>
  );
}
