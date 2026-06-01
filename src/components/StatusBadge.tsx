import { Check, Clock } from "lucide-react";
import type { ParticipantStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/copy";

const styles: Record<ParticipantStatus, string> = {
  confirmed: "bg-paid-bg text-paid-foreground",
  claimed: "bg-pending-bg text-pending-foreground",
  unpaid: "bg-unpaid-bg text-unpaid-foreground",
};

export function StatusBadge({ status }: { status: ParticipantStatus }) {
  const Icon = status === "confirmed" ? Check : status === "claimed" ? Clock : null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {Icon && <Icon className="size-3.5" aria-hidden />}
      {STATUS_LABEL[status]}
    </span>
  );
}
