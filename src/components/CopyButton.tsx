"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label = "Copy link",
  copiedLabel = "Copied ✅",
  className = "",
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          /* clipboard blocked — no-op */
        }
      }}
      className={className}
      aria-live="polite"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
