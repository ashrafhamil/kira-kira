import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CreateBillForm } from "./CreateBillForm";

export const metadata: Metadata = {
  title: "Start a new bill",
  description: "Create a split bill and share the payment link.",
};

export default function CreatePage() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-xl flex-col px-5">
      <header className="flex items-center justify-between py-5">
        <Logo />
        <div className="flex items-center gap-3">
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
        <CreateBillForm />
      </main>
    </div>
  );
}
