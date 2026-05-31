import { card } from "@/components/ui";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-lg animate-pulse px-5 py-10">
      <div className="h-7 w-56 rounded bg-surface-sunken" />
      <div className="mt-6 space-y-5">
        <div className={card + " p-5"}>
          <div className="h-4 w-40 rounded bg-surface-sunken" />
          <div className="mt-3 h-10 w-full rounded bg-surface-sunken" />
        </div>
        <div className={card + " flex items-center gap-5 p-5"}>
          <div className="h-24 w-20 shrink-0 rounded bg-surface-sunken" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-32 rounded bg-surface-sunken" />
            <div className="h-4 w-40 rounded bg-surface-sunken" />
          </div>
        </div>
        <div className={card + " space-y-3 p-5"}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 w-full rounded bg-surface-sunken" />
          ))}
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-foreground-muted">Counting who&rsquo;s settled…</p>
    </div>
  );
}
