import Link from "next/link";
import { ReceiptText } from "lucide-react";
import { Logo } from "@/components/Logo";
import { btn } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col items-center justify-center px-5 py-24 text-center">
      <Logo />
      <ReceiptText className="mt-10 size-12 text-kopi-400" aria-hidden />
      <h1 className="mt-4 text-2xl font-bold">This bill&rsquo;s closed</h1>
      <p className="mt-2 text-foreground-body">
        This link isn&rsquo;t working anymore. Ask the organizer to start a fresh one.
      </p>
      <Link href="/create" className={btn.accent + " mt-6"}>
        Start your own bill
      </Link>
    </div>
  );
}
