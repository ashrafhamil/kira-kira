import { card } from "@/components/ui";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-lg px-5 py-10">
      <div className={card + " animate-pulse overflow-hidden p-0"}>
        <div className="receipt-edge bg-surface-raised px-6 pt-7 pb-6">
          <div className="mx-auto h-3 w-24 rounded bg-surface-sunken" />
          <div className="mx-auto mt-3 h-7 w-48 rounded bg-surface-sunken" />
          <div className="mx-auto mt-2 h-3 w-32 rounded bg-surface-sunken" />
          <div className="my-4 border-t border-dashed border-border" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="h-4 w-24 rounded bg-surface-sunken" />
              <div className="h-4 w-16 rounded bg-surface-sunken" />
            </div>
          ))}
          <div className="my-4 border-t border-dashed border-border" />
          <div className="flex items-center justify-between">
            <div className="h-4 w-16 rounded bg-surface-sunken" />
            <div className="h-5 w-20 rounded bg-surface-sunken" />
          </div>
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-foreground-muted">Warming up the kopi…</p>
    </div>
  );
}
