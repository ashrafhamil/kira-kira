import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangToggle } from "@/components/LangToggle";
import { MyBills } from "@/components/MyBills";
import { normalizeLang } from "@/lib/i18n";
import { CreateBillForm } from "./CreateBillForm";

export const metadata: Metadata = {
  title: "Start a new bill",
  description: "Create a split bill and share the payment link.",
};

export default async function CreatePage() {
  const lang = normalizeLang((await cookies()).get("kira-lang")?.value);
  return (
    <div className="mx-auto flex min-h-full w-full max-w-xl flex-col px-5">
      <header className="flex items-center justify-between py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <LangToggle lang={lang} />
          <ThemeToggle />
          <Link href="/" className="text-sm font-semibold text-foreground-muted">
            Back
          </Link>
        </div>
      </header>
      <main className="pb-16">
        <h1 className="text-3xl font-bold">Start a new bill</h1>
        <p className="mt-1 text-foreground-body">
          Add what everyone owes — we&rsquo;ll make a link you can drop in the
          group.
        </p>
        <CreateBillForm lang={lang} />
        <MyBills className="mt-10" />
      </main>
    </div>
  );
}
