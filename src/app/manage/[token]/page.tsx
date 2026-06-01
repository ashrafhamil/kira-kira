import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getBillByManageToken } from "@/lib/db";
import { Dashboard } from "./Dashboard";

export const dynamic = "force-dynamic";

export default async function ManagePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  const { token } = await params;
  const { new: isNew } = await searchParams;
  const bill = await getBillByManageToken(token);
  if (!bill) notFound();

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;
  const shareUrl = `${origin}/b/${bill.slug}`;
  const manageUrl = `${origin}/manage/${token}`;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col px-5">
      <header className="flex items-center justify-between py-5">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/create" className="text-sm font-semibold text-foreground-muted">
            New bill
          </Link>
        </div>
      </header>
      <main className="pb-16">
        <Dashboard
          manageToken={token}
          shareUrl={shareUrl}
          manageUrl={manageUrl}
          isNew={isNew === "1"}
          title={bill.title}
          organizerName={bill.organizer_name}
          totalAmount={bill.total_amount}
          participants={bill.participants.map((p) => ({
            id: p.id,
            name: p.name,
            phone: p.phone,
            amount: p.amount_owed,
            status: p.status,
            proof_url: p.proof_url,
          }))}
        />
      </main>
    </div>
  );
}
