"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRememberedBills, type RememberedBill } from "@/lib/mybills";
import { card } from "@/components/ui";

export function MyBills({ className = "" }: { className?: string }) {
  const [bills, setBills] = useState<RememberedBill[]>([]);

  useEffect(() => {
    setBills(getRememberedBills());
  }, []);

  if (bills.length === 0) return null;

  return (
    <section className={className}>
      <h2 className="text-sm font-semibold text-foreground-muted">
        Your bills on this device
      </h2>
      <div className="mt-2 flex flex-col gap-2">
        {bills.map((b) => (
          <Link
            key={b.token}
            href={`/manage/${b.token}`}
            className={card + " flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-sunken"}
          >
            <span className="truncate font-semibold text-foreground">{b.title}</span>
            <span className="shrink-0 text-sm text-foreground-muted">
              Open dashboard →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
