import type { ParticipantStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/copy";

const styles: Record<ParticipantStatus, string> = {
  confirmed: "bg-paid-bg text-paid-foreground",
  claimed: "bg-pending-bg text-pending-foreground",
  unpaid: "bg-unpaid-bg text-unpaid-foreground",
};

export function StatusBadge({ status }: { status: ParticipantStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
