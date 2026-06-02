"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Soup } from "lucide-react";
import { createBillAction } from "@/app/actions";
import { btn, card, input, inputBare } from "@/components/ui";
import { formatMoney, round2 } from "@/lib/format";
import { rememberBill } from "@/lib/mybills";
import { MAKAN_PRESETS } from "@/lib/makan";
import { billStrings, type Lang } from "@/lib/i18n";
import type { SplitType } from "@/lib/types";

interface Person {
  name: string;
  phone: string;
  amount: string;
}

interface Item {
  name: string;
  price: string;
  sharedBy: number[]; // people indexes
}

const TITLE_PRESETS = [
  "Mamak Supper 🍢",
  "Trip Genting 🚠",
  "Office Lunch 🍱",
  "Birthday Gift 🎁",
];

const SPLIT_LABELS: Record<SplitType, string> = {
  equal: "Equally",
  custom: "Custom",
  by_item: "By item",
};

export function CreateBillForm({ lang }: { lang: Lang }) {
  const t = billStrings[lang];
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [paymentHandle, setPaymentHandle] = useState("");
  const [description, setDescription] = useState("");
  const [splitType, setSplitType] = useState<SplitType>("equal");
  const [totalAmount, setTotalAmount] = useState("");
  const [people, setPeople] = useState<Person[]>([
    { name: "", phone: "", amount: "" },
    { name: "", phone: "", amount: "" },
  ]);
  const [items, setItems] = useState<Item[]>([]);

  const customTotal = useMemo(
    () => round2(people.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0)),
    [people],
  );
  const namedCount = people.filter((p) => p.name.trim()).length || 1;
  const perHead = useMemo(() => {
    const t = parseFloat(totalAmount) || 0;
    return round2(t / namedCount);
  }, [totalAmount, namedCount]);

  const byItemPerPerson = useMemo(() => {
    const amounts = people.map(() => 0);
    for (const it of items) {
      const price = parseFloat(it.price) || 0;
      const sharers = it.sharedBy.filter((i) => i >= 0 && i < people.length);
      if (!sharers.length || price <= 0) continue;
      const per = price / sharers.length;
      sharers.forEach((idx) => {
        amounts[idx] = round2(amounts[idx] + per);
      });
    }
    return amounts;
  }, [items, people]);
  const byItemTotal = useMemo(
    () => round2(items.reduce((s, it) => s + (parseFloat(it.price) || 0), 0)),
    [items],
  );

  const displayTotal =
    splitType === "equal"
      ? parseFloat(totalAmount) || 0
      : splitType === "custom"
        ? customTotal
        : byItemTotal;

  function updatePerson(i: number, patch: Partial<Person>) {
    setPeople((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }
  function addPerson() {
    setPeople((prev) => [...prev, { name: "", phone: "", amount: "" }]);
  }
  function removePerson(i: number) {
    setPeople((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
    // drop this person from item assignments and reindex
    setItems((prev) =>
      prev.map((it) => ({
        ...it,
        sharedBy: it.sharedBy
          .filter((x) => x !== i)
          .map((x) => (x > i ? x - 1 : x)),
      })),
    );
  }

  function addItem() {
    setItems((p) => [...p, { name: "", price: "", sharedBy: [] }]);
  }
  function addPreset(name: string, price: number) {
    setItems((p) => [...p, { name, price: String(price), sharedBy: [] }]);
  }
  function updateItem(i: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
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

  function submit() {
    setError(null);
    if (!title.trim()) return setError("Give your bill a title first.");
    if (!organizerName.trim()) return setError("Tell us who's collecting.");

    const namedWithIndex = people
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.name.trim());
    if (namedWithIndex.length === 0) return setError("Add at least one person.");

    if (splitType === "equal" && !(parseFloat(totalAmount) > 0))
      return setError("Pop in the total amount first.");
    if (splitType === "custom" && !(customTotal > 0))
      return setError("Add an amount for at least one person.");
    if (splitType === "by_item") {
      const ok = items.some(
        (it) => (parseFloat(it.price) || 0) > 0 && it.sharedBy.length > 0,
      );
      if (!ok) return setError("Add an item and tap who shares it.");
    }

    // Map original people indexes -> submitted participant indexes (named only).
    const indexMap = new Map<number, number>();
    namedWithIndex.forEach(({ i }, newIdx) => indexMap.set(i, newIdx));

    const participants = namedWithIndex.map(({ p }) => ({
      name: p.name.trim(),
      phone: p.phone.trim() || undefined,
      amount: splitType === "custom" ? parseFloat(p.amount) || 0 : undefined,
    }));

    const submittedItems =
      splitType === "by_item"
        ? items
            .filter((it) => (parseFloat(it.price) || 0) > 0)
            .map((it) => ({
              name: it.name.trim() || "Item",
              price: parseFloat(it.price) || 0,
              sharedBy: it.sharedBy
                .map((oi) => indexMap.get(oi))
                .filter((x): x is number => x !== undefined),
            }))
            .filter((it) => it.sharedBy.length > 0)
        : undefined;

    startTransition(async () => {
      const res = await createBillAction({
        title: title.trim(),
        description: description.trim() || undefined,
        organizerName: organizerName.trim(),
        paymentHandle: paymentHandle.trim() || undefined,
        dueDate: null,
        splitType,
        totalAmount: displayTotal,
        participants,
        items: submittedItems,
      });
      if (res.ok) {
        rememberBill({ token: res.manageToken, title: title.trim() });
        router.push(`/manage/${res.manageToken}?new=1`);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <div className="mt-6 space-y-5">
      {/* Basics */}
      <section className={card + " p-5"}>
        <h2 className="font-display text-lg font-bold">What&rsquo;s the damage?</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground-body">
              Bill title
            </label>
            <input
              className={input}
              placeholder="e.g. Mamak Supper"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {TITLE_PRESETS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTitle(t)}
                  className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-foreground-body hover:bg-surface-sunken"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground-body">
                Your name (collecting)
              </label>
              <input
                className={input}
                placeholder="e.g. Aiman"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground-body">
                DuitNow / phone <span className="text-foreground-muted">(optional)</span>
              </label>
              <input
                className={input}
                placeholder="e.g. 012-345 6789"
                value={paymentHandle}
                onChange={(e) => setPaymentHandle(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground-body">
              Note <span className="text-foreground-muted">(optional)</span>
            </label>
            <input
              className={input}
              placeholder="e.g. incl. teh tarik x5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Split type */}
      <section className={card + " p-5"}>
        <h2 className="font-display text-lg font-bold">How to split?</h2>
        <div className="mt-3 grid grid-cols-3 gap-2 rounded-[var(--radius-md)] bg-surface-sunken p-1">
          {(["equal", "custom", "by_item"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSplitType(t)}
              className={`rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold transition ${
                splitType === t
                  ? "bg-surface-raised text-foreground shadow-[var(--shadow-xs)]"
                  : "text-foreground-muted"
              }`}
            >
              {SPLIT_LABELS[t]}
            </button>
          ))}
        </div>

        {splitType === "equal" && (
          <div className="mt-4">
            <label className="mb-1 block text-sm font-semibold text-foreground-body">
              Total amount (RM)
            </label>
            <input
              inputMode="decimal"
              className={input}
              placeholder="0.00"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
            />
            {parseFloat(totalAmount) > 0 && (
              <p className="mt-2 text-sm text-foreground-muted">
                Each pays{" "}
                <span className="font-mono-amount font-semibold text-foreground">
                  {formatMoney(perHead)}
                </span>{" "}
                · {namedCount} {namedCount === 1 ? "person" : "people"}
              </p>
            )}
          </div>
        )}
        {splitType === "by_item" && (
          <p className="mt-3 text-sm text-foreground-muted">
            Add who&rsquo;s in below, then list what everyone ordered — we&rsquo;ll
            split each item among whoever shared it.
          </p>
        )}
      </section>

      {/* People */}
      <section className={card + " p-5"}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Who&rsquo;s in?</h2>
          <span className="text-sm text-foreground-muted">
            Total {formatMoney(displayTotal)}
          </span>
        </div>
        <div className="mt-4 space-y-2.5">
          {people.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  className={input}
                  placeholder={`Person ${i + 1}`}
                  value={p.name}
                  onChange={(e) => updatePerson(i, { name: e.target.value })}
                />
                <input
                  className={input}
                  placeholder="WhatsApp no. (optional)"
                  inputMode="tel"
                  value={p.phone}
                  onChange={(e) => updatePerson(i, { phone: e.target.value })}
                />
                {splitType === "custom" ? (
                  <input
                    className={input + " sm:w-28"}
                    placeholder="RM"
                    inputMode="decimal"
                    value={p.amount}
                    onChange={(e) => updatePerson(i, { amount: e.target.value })}
                  />
                ) : (
                  <div
                    className="flex items-center justify-end rounded-[var(--radius-sm)] border border-dashed border-border px-3 py-2.5 font-mono-amount text-sm text-foreground-muted sm:w-28"
                    aria-label="Auto-calculated share"
                  >
                    {!p.name.trim()
                      ? "—"
                      : splitType === "equal"
                        ? parseFloat(totalAmount) > 0
                          ? formatMoney(perHead)
                          : "—"
                        : formatMoney(byItemPerPerson[i])}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removePerson(i)}
                className="mt-1 grid size-9 shrink-0 place-items-center rounded-full text-foreground-muted hover:bg-surface-sunken"
                aria-label="Remove person"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addPerson}
          className="mt-3 text-sm font-semibold text-secondary hover:underline"
        >
          + Add another person
        </button>
      </section>

      {/* Items (by-item split) */}
      {splitType === "by_item" && (
        <section className={card + " p-5"}>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold">
              <Soup className="size-4 text-sambal-600" aria-hidden />
              {t.whatMakan}
            </h2>
            <span className="text-sm text-foreground-muted">
              Total {formatMoney(byItemTotal)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {MAKAN_PRESETS.map((m) => (
              <button
                key={m.name}
                type="button"
                onClick={() => addPreset(m.name, m.price)}
                className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-foreground-body hover:bg-surface-sunken"
              >
                {m.name}{" "}
                <span className="text-foreground-muted">RM{m.price.toFixed(2)}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {items.length === 0 && (
              <p className="text-sm text-foreground-muted">
                Tap a makan chip above, or add an item.
              </p>
            )}
            {items.map((it, i) => {
              const price = parseFloat(it.price) || 0;
              const sharers = it.sharedBy.length;
              return (
                <div
                  key={i}
                  className="rounded-[var(--radius-md)] border border-border bg-surface-raised p-3"
                >
                  <div className="flex items-center gap-2">
                    <input
                      className={inputBare + " min-w-0 flex-1"}
                      placeholder="Item (e.g. Roti Canai)"
                      value={it.name}
                      onChange={(e) => updateItem(i, { name: e.target.value })}
                    />
                    <input
                      className={inputBare + " w-24 shrink-0"}
                      placeholder="RM"
                      inputMode="decimal"
                      value={it.price}
                      onChange={(e) => updateItem(i, { price: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      aria-label="Remove item"
                      className="grid size-9 shrink-0 place-items-center rounded-full text-foreground-muted hover:bg-surface-sunken"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mt-2.5">
                    <p className="mb-1.5 text-xs font-semibold text-foreground-muted">
                      Shared by
                      {sharers > 0 && price > 0
                        ? ` · ${formatMoney(round2(price / sharers))} each`
                        : ""}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {people.map((p, pi) => {
                        const on = it.sharedBy.includes(pi);
                        return (
                          <button
                            key={pi}
                            type="button"
                            onClick={() => toggleItemPerson(i, pi)}
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
                              on
                                ? "border-accent bg-accent text-accent-foreground"
                                : "border-border bg-surface text-foreground-body hover:bg-surface-sunken"
                            }`}
                          >
                            {p.name.trim() || `Person ${pi + 1}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-3 text-sm font-semibold text-secondary hover:underline"
          >
            + Add item
          </button>
        </section>
      )}

      {error && (
        <p className="rounded-[var(--radius-sm)] bg-unpaid-bg px-4 py-3 text-sm font-medium text-unpaid-foreground">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={pending}
        className={btn.accent + " w-full !py-3.5 text-base"}
      >
        {pending ? "Cooking up your link…" : t.jomSplit}
      </button>
    </div>
  );
}
