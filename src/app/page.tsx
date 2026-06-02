import Link from "next/link";
import { cookies } from "next/headers";
import { MessageCircle, QrCode, ReceiptText, Link2, Soup } from "lucide-react";
import { Logo } from "@/components/Logo";
import { TehGlass } from "@/components/TehGlass";
import { StatusBadge } from "@/components/StatusBadge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangToggle } from "@/components/LangToggle";
import { InstallButton } from "@/components/InstallButton";
import { MyBills } from "@/components/MyBills";
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
            Start a bill
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="grid items-center gap-10 py-8 md:grid-cols-2 md:py-14">
        <Reveal mount>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground-muted">
            <Soup className="size-3.5 text-sambal-600" /> {t.madeForMakan}
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
            <span className="font-semibold text-foreground">{t.tagline}</span>
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
        </Reveal>

        {/* Hero visual: mini receipt + glass */}
        <Reveal mount delay={0.15} className="flex flex-col items-center gap-4">
          <div className={card + " w-full max-w-sm overflow-hidden"}>
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
                    <StatusBadge status={status} labels={t.status} />
                  </span>
                </div>
              ))}
            </div>
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
              d: "Add the total, who's in, and how to split — equal, custom, or by item.",
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
