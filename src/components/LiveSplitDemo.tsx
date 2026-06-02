"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { AnimatedMoney } from "@/components/AnimatedMoney";
import { ScanReceipt, type ScanResult } from "@/components/ScanReceipt";
import { btn, card, inputBare } from "@/components/ui";
import { formatMoney, round2 } from "@/lib/format";
import { billStrings, type Lang } from "@/lib/i18n";

interface DemoItem {
  name: string;
  price: string;
  sharedBy: number[];
}

const SEED_NAMES = ["Aiman", "Siti", "Hafiz", "Mei Ling"];
const SEED_ITEMS: DemoItem[] = [
  { name: "Nasi Lemak Ayam", price: "12.00", sharedBy: [0] },
  { name: "Roti Canai x4", price: "8.00", sharedBy: [0, 1, 2, 3] },
  { name: "Teh Tarik x4", price: "10.00", sharedBy: [0, 1, 2, 3] },
  { name: "Maggi Goreng", price: "9.00", sharedBy: [1, 3] },
];

export function LiveSplitDemo({ lang }: { lang: Lang }) {
  const t = billStrings[lang];
  const reduce = useReducedMotion();

  const [mode, setMode] = useState<"equal" | "by_item">("equal");
  const [title, setTitle] = useState("Mamak Supper");
  const [total, setTotal] = useState("86.00");
  const [names, setNames] = useState<string[]>(SEED_NAMES);
  const [items, setItems] = useState<DemoItem[]>(SEED_ITEMS);

  const namedCount = names.filter((n) => n.trim()).length || 1;

  const equalShares = useMemo(() => {
    const amt = parseFloat(total) || 0;
    const per = round2(amt / namedCount);
    return names.map((n) => (n.trim() ? per : 0));
  }, [total, namedCount, names]);

  const byItemShares = useMemo(() => {
    const amounts = names.map(() => 0);
    for (const it of items) {
      const price = parseFloat(it.price) || 0;
      const sharers = it.sharedBy.filter((i) => i >= 0 && i < names.length);
      if (!sharers.length || price <= 0) continue;
      const per = price / sharers.length;
      sharers.forEach((idx) => (amounts[idx] = round2(amounts[idx] + per)));
    }
    return amounts;
  }, [items, names]);

  const shares = mode === "equal" ? equalShares : byItemShares;
  const computedTotal =
    mode === "equal"
      ? parseFloat(total) || 0
      : round2(items.reduce((s, it) => s + (parseFloat(it.price) || 0), 0));

  function setName(i: number, v: string) {
    setNames((prev) => prev.map((n, idx) => (idx === i ? v : n)));
  }
  function addPerson() {
    if (names.length >= 8) return;
    setNames((prev) => [...prev, ""]);
  }
  function removePerson() {
    if (names.length <= 2) return;
    const i = names.length - 1;
    setNames((prev) => prev.slice(0, -1));
    setItems((prev) =>
      prev.map((it) => ({ ...it, sharedBy: it.sharedBy.filter((x) => x !== i) })),
    );
  }
  function toggleItemPerson(itemIdx: number, personIdx: number) {
    setItems((prev) =>
      prev.map((it, idx) => {
        if (idx !== itemIdx) return it;
        const has = it.sharedBy.includes(personIdx);
        return {
          ...it,
          sharedBy: has
            ? it.sharedBy.filter((x) => x !== personIdx)
            : [...it.sharedBy, personIdx],
        };
      }),
    );
  }
  function setItemPrice(i: number, v: string) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, price: v } : it)));
  }

  // Real receipt scan, in-place: fills the demo's by-item view from a photo.
  function applyScan(r: ScanResult) {
    setMode("by_item");
    const everyone = names.map((_, i) => i);
    const scanned: DemoItem[] = r.items.map((it) => ({
      name: it.name,
      price: String(it.price),
      sharedBy: [...everyone], // demo: assign to all so shares populate instantly
    }));
    const charges: DemoItem[] = [];
    if (r.serviceCharge)
      charges.push({ name: "Service charge", price: String(r.serviceCharge), sharedBy: [...everyone] });
    if (r.sst) charges.push({ name: "SST", price: String(r.sst), sharedBy: [...everyone] });
    setItems([...scanned, ...charges]);
  }

  // Carry the demo into the real create form (server page reads `?demo=`).
  const prefillHref = useMemo(() => {
    // Map original people indexes -> named-only indexes so item shares stay correct.
    const indexMap = new Map<number, number>();
    let next = 0;
    names.forEach((n, i) => {
      if (n.trim()) indexMap.set(i, next++);
    });
    const payload = {
      title: title.trim() || "Mamak Supper",
      splitType: mode,
      totalAmount: mode === "equal" ? total : undefined,
      people: names.filter((n) => n.trim()).map((n) => ({ name: n.trim() })),
      items:
        mode === "by_item"
          ? items
              .filter((it) => (parseFloat(it.price) || 0) > 0)
              .map((it) => ({
                name: it.name.trim() || "Item",
                price: it.price,
                sharedBy: it.sharedBy
                  .map((oi) => indexMap.get(oi))
                  .filter((x): x is number => x !== undefined),
              }))
          : undefined,
    };
    return `/create?demo=${encodeURIComponent(JSON.stringify(payload))}`;
  }, [title, mode, total, names, items]);

  return (
    <section className="py-12">
      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-sambal-600">
          Live demo · no sign-up
        </span>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
          Try it — split a bill right here
        </h2>
        <p className="mt-2 text-foreground-body">
          <b>Snap a real receipt</b> and watch it fill in — or type the total and
          add names. Every share updates instantly.
        </p>
        <ScanReceipt className="mx-auto mt-5 max-w-xl" onScanned={applyScan} />
      </div>

      <div className={card + " mx-auto max-w-xl overflow-hidden p-0"}>
        {/* Mode toggle */}
        <div className="grid grid-cols-2 gap-2 bg-surface-sunken p-1.5">
          {(["equal", "by_item"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold transition ${
                mode === m
                  ? "bg-surface-raised text-foreground shadow-[var(--shadow-xs)]"
                  : "text-foreground-muted"
              }`}
            >
              {m === "equal" ? "Split equally" : "Split by item"}
            </button>
          ))}
        </div>

        <div className="receipt-edge bg-surface-raised px-5 pt-6 pb-6 sm:px-7">
          <p className="text-center font-mono-amount text-xs uppercase tracking-[0.3em] text-foreground-muted">
            Kira-Kira
          </p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Bill title"
            className="mt-1 w-full bg-transparent text-center font-display text-2xl font-bold text-foreground focus:outline-none"
          />

          {/* Equal: total field */}
          {mode === "equal" && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-sm text-foreground-muted">Total</span>
              <span className="font-mono-amount text-foreground-muted">RM</span>
              <input
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                inputMode="decimal"
                aria-label="Total amount"
                className={inputBare + " w-28 text-center font-mono-amount"}
              />
            </div>
          )}

          <div className="my-4 border-t border-dashed border-border" />

          {/* People */}
          <ul className="space-y-2.5">
            <AnimatePresence initial={false}>
              {names.map((name, i) => (
                <motion.li
                  key={i}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={reduce ? undefined : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between gap-3"
                >
                  <input
                    value={name}
                    onChange={(e) => setName(i, e.target.value)}
                    placeholder={`Person ${i + 1}`}
                    aria-label={`Person ${i + 1} name`}
                    className={inputBare + " min-w-0 flex-1 !bg-transparent !border-transparent !px-0 font-medium"}
                  />
                  <AnimatedMoney
                    value={shares[i] ?? 0}
                    className="font-mono-amount shrink-0 font-semibold text-foreground"
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {/* Person +/- */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={removePerson}
              disabled={names.length <= 2}
              aria-label="Remove person"
              className="grid size-8 place-items-center rounded-full border border-border bg-surface text-foreground-muted hover:bg-surface-sunken disabled:opacity-40"
            >
              <Minus className="size-4" />
            </button>
            <span className="min-w-20 text-center text-sm text-foreground-muted">
              {namedCount} {namedCount === 1 ? "person" : "people"}
            </span>
            <button
              type="button"
              onClick={addPerson}
              disabled={names.length >= 8}
              aria-label="Add person"
              className="grid size-8 place-items-center rounded-full border border-border bg-surface text-foreground-muted hover:bg-surface-sunken disabled:opacity-40"
            >
              <Plus className="size-4" />
            </button>
          </div>

          {/* By item: editable item list */}
          {mode === "by_item" && (
            <div className="mt-4 space-y-2.5">
              <div className="my-1 border-t border-dashed border-border" />
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                {t.theDamage}
              </p>
              {items.map((it, i) => (
                <div
                  key={i}
                  className="rounded-[var(--radius-md)] border border-border bg-surface p-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate text-sm font-medium text-foreground">
                      {it.name}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-sm text-foreground-muted">
                      RM
                      <input
                        value={it.price}
                        onChange={(e) => setItemPrice(i, e.target.value)}
                        inputMode="decimal"
                        aria-label={`${it.name} price`}
                        className={inputBare + " w-16 text-right font-mono-amount"}
                      />
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {names.map((n, pi) => {
                      const on = it.sharedBy.includes(pi);
                      return (
                        <button
                          key={pi}
                          type="button"
                          onClick={() => toggleItemPerson(i, pi)}
                          aria-pressed={on}
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold transition ${
                            on
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-border bg-surface text-foreground-body hover:bg-surface-sunken"
                          }`}
                        >
                          {n.trim() || `P${pi + 1}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="my-4 border-t border-dashed border-border" />

          <div className="flex items-center justify-between">
            <span className="font-display text-base font-bold">{t.total}</span>
            <span className="font-mono-amount text-2xl font-bold text-foreground">
              {formatMoney(computedTotal)}
            </span>
          </div>

          <Link href={prefillHref} className={btn.accent + " mt-5 w-full"}>
            Start this bill <ArrowRight className="size-4" />
          </Link>
          <p className="mt-2 text-center text-xs text-foreground-muted">
            Carries straight into a real, shareable link.
          </p>
        </div>
      </div>
    </section>
  );
}
