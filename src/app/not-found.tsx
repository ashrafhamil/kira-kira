import Link from "next/link";
import { Logo } from "@/components/Logo";
import { btn } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col items-center justify-center px-5 py-24 text-center">
      <Logo />
      <div className="mt-10 text-5xl">🍜</div>
      <h1 className="mt-4 text-2xl font-bold">Nothing here</h1>
      <p className="mt-2 text-foreground-body">
        This page doesn&rsquo;t exist. Jom start a bill instead.
      </p>
      <Link href="/" className={btn.accent + " mt-6"}>
        Back to Kira-Kira
      </Link>
    </div>
  );
}
