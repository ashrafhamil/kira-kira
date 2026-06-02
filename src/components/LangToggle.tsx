"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";

export function LangToggle({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  // Optimistic: the pill follows the click immediately; the translated page
  // (a server round-trip) catches up a beat later.
  const [active, setActive] = useState<Lang>(lang);
  useEffect(() => setActive(lang), [lang]);

  function set(next: Lang) {
    if (next === active) return;
    setActive(next);
    document.cookie = `kira-lang=${next};path=/;max-age=31536000;samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center gap-0.5 rounded-full border border-border bg-surface p-0.5 text-xs font-semibold"
    >
      {(["manglish", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => set(l)}
          aria-pressed={active === l}
          className={`rounded-full px-2 py-1 transition ${
            active === l
              ? "bg-kopi-700 text-krim-50"
              : "text-foreground-muted hover:text-foreground"
          }`}
        >
          {l === "manglish" ? "MS" : "EN"}
        </button>
      ))}
    </div>
  );
}
