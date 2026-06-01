import Link from "next/link";
import { Coffee } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-display text-xl font-bold text-foreground ${className}`}
    >
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-full bg-kopi-700 shadow-sm"
      >
        <Coffee className="size-4 text-krim-50" />
      </span>
      <span>
        Kira-<span className="text-sambal-600">Kira</span>
      </span>
    </Link>
  );
}
