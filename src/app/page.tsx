import Link from "next/link";
import { cookies } from "next/headers";
import { MessageCircle, QrCode, ReceiptText, Link2, Soup, ScanLine, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { TehGlass } from "@/components/TehGlass";
import { StatusBadge } from "@/components/StatusBadge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangToggle } from "@/components/LangToggle";
import { InstallButton } from "@/components/InstallButton";
import { MyBills } from "@/components/MyBills";
import { LiveSplitDemo } from "@/components/LiveSplitDemo";
import { Reveal } from "@/components/Reveal";
import { btn, card } from "@/components/ui";
import { billStrings, normalizeLang } from "@/lib/i18n";

export default async function Home() {
  const lang = normalizeLang((await cookies()).get("kira-lang")?.value);
  const t = billStrings[lang];
  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-5">
      <header className="flex items-center justify-between py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <InstallButton className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface-sunken" />
          <LangToggle lang={lang} />
          <ThemeToggle />
          <Link href="/create" className={btn.accent + " !px-4 !py-2 text-sm"}>
            <ScanLine className="size-4" /> Scan a receipt
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="grid items-center gap-10 py-8 md:grid-cols-2 md:py-14">
        <Reveal mount>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground-muted">
            <Soup className="size-3.5 text-sambal-600" /> {t.madeForMakan}
          </span>
          <h1 className="mt-4 text-5xl leading-[1.02] font-bold sm:text-6xl">
            Snap. Split.{" "}
            <span className="text-sambal-600">Settle.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-foreground-body">
            {t.heroLead}{" "}
            <span className="font-semibold text-foreground">
              {t.heroCloser}
            </span>
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/create" className={btn.accent}>
              <ScanLine className="size-4" /> Scan a receipt
            </Link>
            <Link href="/create" className={btn.ghost}>
              Start a bill
            </Link>
          </div>
          <p className="mt-3 text-sm text-foreground-muted">
            No sign-up. Takes 30 seconds.
          </p>
        </Reveal>

        {/* Hero visual: mini receipt + glass */}
        <Reveal mount delay={0.15} className="flex flex-col items-center gap-4">
          <div className="receipt-paper kopi-grain w-full max-w-sm bg-surface-raised px-6 pt-7 pb-7">
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
                    <StatusBadge status={status} labels={t.status} />
                  </span>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-2.5 shadow-[var(--shadow-sm)]">
            <TehGlass percent={68} className="h-12 w-10 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-foreground">68% collected</p>
              <p className="font-mono-amount text-foreground-muted">RM 58.00 / 86.00</p>
            </div>
          </div>
        </Reveal>
      </section>

      <MyBills className="py-4" />

      {/* Interactive live splitter */}
      <Reveal>
        <LiveSplitDemo lang={lang} />
      </Reveal>

      {/* How it works */}
      <section id="how" className="py-12">
        <Reveal>
          <h2 className="text-2xl font-bold">Three taps to settled</h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              n: "1",
              t: "Start a bill",
              d: "Snap the receipt to autofill the items — or add the total yourself. Split equal, custom, or by item.",
            },
            {
              n: "2",
              t: "Share the link",
              d: "Drop it in the WhatsApp group. Everyone sees their share.",
            },
            {
              n: "3",
              t: "Track who's settled",
              d: t.step3Desc,
            },
          ].map((s, i) => (
            <Reveal
              key={s.n}
              delay={i * 0.08}
              lift
              className={card + " p-5 transition-shadow hover:shadow-[var(--shadow-md)]"}
            >
              <div className="grid size-9 place-items-center rounded-full bg-kopi-700 font-display font-bold text-krim-50">
                {s.n}
              </div>
              <h3 className="mt-3 text-lg font-bold">{s.t}</h3>
              <p className="mt-1 text-sm text-foreground-body">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Flagship: receipt scanner */}
      <Reveal
        lift
        className={
          card +
          " mt-2 overflow-hidden border-accent/30 bg-gradient-to-br from-accent/5 to-transparent p-6 transition-shadow hover:shadow-[var(--shadow-md)] sm:p-8"
        }
      >
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
          <span className="inline-grid size-14 shrink-0 place-items-center rounded-2xl bg-accent/10">
            <ScanLine className="size-7 text-accent" />
          </span>
          <div className="flex-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-accent">
              <Sparkles className="size-3" /> New
            </span>
            <h3 className="mt-2 text-xl font-bold">
              Snap the receipt — we read it for you
            </h3>
            <p className="mt-1 max-w-xl text-foreground-body">
              Photograph the bill and Kira-Kira pulls out every item, price,
              service charge and SST automatically — then you just tap who shares
              each dish.
            </p>
          </div>
          <Link href="/create" className={btn.accent + " shrink-0"}>
            Try it
          </Link>
        </div>
      </Reveal>

      {/* Features */}
      <section className="grid gap-4 py-6 sm:grid-cols-2">
        {[
          {
            t: "Stop the chasing",
            d: "One tap drafts a warm WhatsApp reminder for anyone unpaid. The app chases — you stay the good guy.",
            Icon: MessageCircle,
          },
          {
            t: "DuitNow QR built in",
            d: "Every share comes with a scan-to-pay QR. Simulated for the demo, swap-ready for real.",
            Icon: QrCode,
          },
          {
            t: "A receipt you'd screenshot",
            d: "Kopitiam thermal-receipt styling with a LUNAS chop when someone settles.",
            Icon: ReceiptText,
          },
          {
            t: "WhatsApp-ready links",
            d: "Mobile-first, with a custom preview card so the link looks premium in the group chat.",
            Icon: Link2,
          },
        ].map((f, i) => (
          <Reveal
            key={f.t}
            delay={i * 0.06}
            lift
            className={card + " p-5 transition-shadow hover:shadow-[var(--shadow-md)]"}
          >
            <span className="inline-grid size-10 place-items-center rounded-full bg-sambal-500/10">
              <f.Icon className="size-5 text-sambal-600" />
            </span>
            <h3 className="mt-3 text-lg font-bold">{f.t}</h3>
            <p className="mt-1 text-sm text-foreground-body">{f.d}</p>
          </Reveal>
        ))}
      </section>

      <footer className="mt-auto flex flex-col items-center gap-2 py-10 text-center text-sm text-foreground-muted">
        <Logo />
        <p>
          Built for the{" "}
          <a
            href="https://krackeddevs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sambal-600 hover:underline"
          >
            KrackedDevs
          </a>{" "}
          Split-Bill bounty. {t.tagline}
        </p>
      </footer>
    </div>
  );
}
