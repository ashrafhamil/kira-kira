import Link from "next/link";
import { Logo } from "@/components/Logo";
import { TehGlass } from "@/components/TehGlass";
import { StatusBadge } from "@/components/StatusBadge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { btn, card } from "@/components/ui";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-5">
      <header className="flex items-center justify-between py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/create" className={btn.accent + " !px-4 !py-2 text-sm"}>
            Start a bill
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="grid items-center gap-10 py-8 md:grid-cols-2 md:py-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground-muted">
            🍜 Made for the makan group
          </span>
          <h1 className="mt-4 text-4xl leading-[1.05] font-bold sm:text-5xl">
            Split the bill.
            <br />
            Share the link.
            <br />
            <span className="text-sambal-600">Get paid.</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-foreground-body">
            Kira-Kira collects shared payments without the awkward chasing. One
            link, a DuitNow QR, and a dashboard that shows exactly who&rsquo;s
            settled.{" "}
            <span className="font-semibold text-foreground">
              Jom settle, no drama.
            </span>
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/create" className={btn.accent}>
              Start a bill — free
            </Link>
            <a href="#how" className={btn.ghost}>
              How it works
            </a>
          </div>
          <p className="mt-3 text-sm text-foreground-muted">
            No sign-up. Takes 30 seconds.
          </p>
        </div>

        {/* Hero visual: mini receipt + glass */}
        <div className="relative">
          <div className={card + " relative z-10 mx-auto max-w-sm overflow-hidden"}>
            <div className="receipt-edge bg-surface-raised px-6 pt-6 pb-7">
              <p className="text-center font-display text-lg font-bold">
                Mamak Supper 🍢
              </p>
              <p className="text-center text-xs text-foreground-muted">
                5 orang · RM 86.00
              </p>
              <div className="my-4 border-t border-dashed border-border" />
              {(
                [
                  ["Aiman", "confirmed"],
                  ["Siti", "confirmed"],
                  ["Hafiz", "claimed"],
                  ["Mei Ling", "unpaid"],
                ] as const
              ).map(([name, status]) => (
                <div
                  key={name}
                  className="flex items-center justify-between py-1.5 text-sm"
                >
                  <span className="font-medium text-foreground">{name}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono-amount text-foreground-body">
                      RM 17.20
                    </span>
                    <StatusBadge status={status} />
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-7 -left-7 -z-10 hidden w-24 rounded-2xl border border-border bg-surface p-2 shadow-[var(--shadow-md)] sm:block">
            <TehGlass percent={68} className="w-full" />
            <p className="mt-1 text-center text-[11px] font-semibold text-foreground-muted">
              RM 58 / 86
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-12">
        <h2 className="text-2xl font-bold">Three taps to settled</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              n: "1",
              t: "Start a bill",
              d: "Add the total, who's in, and how to split. Equal or custom.",
            },
            {
              n: "2",
              t: "Share the link",
              d: "Drop it in the WhatsApp group. Everyone sees their share.",
            },
            {
              n: "3",
              t: "Track who's settled",
              d: "Watch the glass fill. Nudge whoever's belum bayar — politely.",
            },
          ].map((s) => (
            <div key={s.n} className={card + " p-5"}>
              <div className="grid size-9 place-items-center rounded-full bg-kopi-700 font-display font-bold text-primary-foreground">
                {s.n}
              </div>
              <h3 className="mt-3 text-lg font-bold">{s.t}</h3>
              <p className="mt-1 text-sm text-foreground-body">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-4 py-6 sm:grid-cols-2">
        {[
          {
            t: "Stop the chasing",
            d: "One tap drafts a warm WhatsApp reminder for anyone unpaid. The app chases — you stay the good guy.",
            e: "💬",
          },
          {
            t: "DuitNow QR built in",
            d: "Every share comes with a scan-to-pay QR. Simulated for the demo, swap-ready for real.",
            e: "📲",
          },
          {
            t: "A receipt you'd screenshot",
            d: "Kopitiam thermal-receipt styling with a LUNAS chop when someone settles.",
            e: "🧾",
          },
          {
            t: "WhatsApp-ready links",
            d: "Mobile-first, with a custom preview card so the link looks premium in the group chat.",
            e: "🔗",
          },
        ].map((f) => (
          <div key={f.t} className={card + " p-5"}>
            <div className="text-2xl">{f.e}</div>
            <h3 className="mt-2 text-lg font-bold">{f.t}</h3>
            <p className="mt-1 text-sm text-foreground-body">{f.d}</p>
          </div>
        ))}
      </section>

      <footer className="mt-auto flex flex-col items-center gap-2 py-10 text-center text-sm text-foreground-muted">
        <Logo />
        <p>Built for the KrackedDevs Split-Bill bounty. Jom settle, no drama.</p>
      </footer>
    </div>
  );
}
