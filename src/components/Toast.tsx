"use client";

import { useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";

export function Toast({
  message,
  show,
  duration = 5000,
}: {
  message: string;
  show: boolean;
  duration?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [show, duration]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="animate-toast flex max-w-md items-center gap-3 rounded-[var(--radius-md)] border border-border border-l-4 border-l-secondary bg-surface px-4 py-3 shadow-[var(--shadow-lg)]">
        <PartyPopper className="size-5 shrink-0 text-teh-400" aria-hidden />
        <p className="flex-1 text-sm font-medium text-foreground">{message}</p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
          className="shrink-0 text-foreground-muted hover:text-foreground"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
