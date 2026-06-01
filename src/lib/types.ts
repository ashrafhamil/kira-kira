export type SplitType = "equal" | "custom" | "by_item";
export type ParticipantStatus = "unpaid" | "claimed" | "confirmed";

export interface Bill {
  id: string;
  slug: string;
  manage_token: string;
  title: string;
  description: string | null;
  currency: string;
  total_amount: number;
  split_type: SplitType;
  due_date: string | null;
  organizer_name: string;
  payment_handle: string | null;
  payment_qr_payload: string | null;
  theme: string;
  created_at: string;
}

export interface Participant {
  id: string;
  bill_id: string;
  name: string;
  phone: string | null;
  amount_owed: number;
  status: ParticipantStatus;
  proof_url: string | null;
  claimed_at: string | null;
  confirmed_at: string | null;
  sort_order: number;
  created_at: string;
}

export interface BillItem {
  id: string;
  bill_id: string;
  name: string;
  price: number;
  shared_by: string[]; // participant ids
  sort_order: number;
  created_at: string;
}

export interface BillWithParticipants extends Bill {
  participants: Participant[];
  items: BillItem[];
}

export interface BillProgress {
  total: number;
  collected: number; // confirmed only
  pending: number; // claimed, awaiting confirmation
  remaining: number; // total - collected
  count: number;
  paidCount: number; // confirmed
  pendingCount: number; // claimed
  unpaidCount: number;
  percent: number; // collected / total * 100, 0..100
}

export interface CreateBillInput {
  title: string;
  description?: string;
  organizerName: string;
  currency?: string;
  dueDate?: string | null;
  paymentHandle?: string;
  splitType: SplitType;
  totalAmount: number;
  participants: { name: string; phone?: string; amount?: number }[];
  // For by_item: line items, each shared by participant indexes.
  items?: { name: string; price: number; sharedBy: number[] }[];
}
