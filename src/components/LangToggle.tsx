"use client";

import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import type { Lang } from "@/lib/i18n";

export function LangToggle({ lang, className = "" }: { lang: Lang; className?: string }) {
  const router = useRouter();
  function toggle() {
    const next = lang === "en" ? "manglish" : "en";
    document.cookie = `kira-lang=${next};path=/;max-age=31536000;samesite=lax`;
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${lang === "en" ? "Manglish" : "English"}`}
      className={className}
    >
      <Languages className="size-4" aria-hidden /> {lang === "en" ? "EN" : "MS"}
    </button>
  );
}
