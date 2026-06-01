"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBillAction } from "@/app/actions";
import { btn, card, input } from "@/components/ui";
import { formatMoney, round2 } from "@/lib/format";
import { rememberBill } from "@/lib/mybills";
import type { SplitType } from "@/lib/types";

interface Person {
  name: string;
  phone: string;
  amount: string;
}

const TITLE_PRESETS = [
  "Mamak Supper 🍢",
  "Trip Genting 🚠",
  "Office Lunch 🍱",
  "Birthday Gift 🎁",
  "House Bills 🏠",
];

export function CreateBillForm() {
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

  const customTotal = useMemo(
    () => round2(people.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0)),
    [people],
  );
  const namedCount = people.filter((p) => p.name.trim()).length || 1;
  const perHead = useMemo(() => {
    const t = parseFloat(totalAmount) || 0;
    return round2(t / namedCount);
  }, [totalAmount, namedCount]);

  function updatePerson(i: number, patch: Partial<Person>) {
    setPeople((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }
  function addPerson() {
    setPeople((prev) => [...prev, { name: "", phone: "", amount: "" }]);
  }
  function removePerson(i: number) {
    setPeople((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  }

  function submit() {
    setError(null);
    const named = people.filter((p) => p.name.trim());
    if (!title.trim()) return setError("Give your bill a title first.");
    if (!organizerName.trim()) return setError("Tell us who's collecting.");
    if (named.length === 0) return setError("Add at least one person.");
    if (splitType === "equal" && !(parseFloat(totalAmount) > 0))
      return setError("Pop in the total amount first.");
    if (splitType === "custom" && !(customTotal > 0))
      return setError("Add an amount for at least one person.");

    startTransition(async () => {
      const res = await createBillAction({
        title: title.trim(),
        description: description.trim() || undefined,
        organizerName: organizerName.trim(),
        paymentHandle: paymentHandle.trim() || undefined,
        dueDate: null,
        splitType,
        totalAmount: splitType === "equal" ? parseFloat(totalAmount) : customTotal,
        participants: named.map((p) => ({
          name: p.name.trim(),
          phone: p.phone.trim() || undefined,
          amount: splitType === "custom" ? parseFloat(p.amount) || 0 : undefined,
        })),
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
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-[var(--radius-md)] bg-surface-sunken p-1">
          {(["equal", "custom"] as const).map((t) => (
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
              {t === "equal" ? "Split equally" : "Custom amounts"}
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
      </section>

      {/* People */}
      <section className={card + " p-5"}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Who&rsquo;s in?</h2>
          <span className="text-sm text-foreground-muted">
            Total {formatMoney(splitType === "equal" ? parseFloat(totalAmount) || 0 : customTotal)}
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
                    className="flex items-center justify-end rounded-[var(--radius-sm)] bg-surface-sunken px-3 py-2.5 font-mono-amount text-sm text-foreground-muted sm:w-28"
                    aria-label="Auto-calculated share"
                  >
                    {p.name.trim() && parseFloat(totalAmount) > 0
                      ? formatMoney(perHead)
                      : "—"}
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
        {pending ? "Cooking up your link…" : "Jom split — make the link"}
      </button>
    </div>
  );
}
