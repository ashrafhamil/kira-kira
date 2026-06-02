/** Kopitiam chop-stamp: "LUNAS" (settled) inked over a paid row/receipt. */
export function Stamp({
  label = "LUNAS",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`animate-stamp pointer-events-none select-none ${className}`}
    >
      <div className="chop relative rounded-md border-[3px] border-paid px-2.5 py-0.5 font-display text-sm font-extrabold uppercase tracking-[0.2em] text-paid opacity-90 shadow-[inset_0_0_0_2px_var(--paid)]">
        {label}
      </div>
    </div>
  );
}
