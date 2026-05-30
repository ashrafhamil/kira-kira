-- Kira-Kira schema
-- Access model: NO end-user auth. All DB access goes through Next.js server
-- actions using the service_role key (server-only). RLS is enabled with no
-- public policies, so the anon key cannot read or write anything directly.

create extension if not exists pgcrypto;

create table if not exists bills (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  manage_token      text unique not null,
  title             text not null,
  description       text,
  currency          text not null default 'MYR',
  total_amount      numeric(12,2) not null default 0,
  split_type        text not null default 'equal',   -- equal | custom
  due_date          date,
  organizer_name    text not null,
  payment_handle    text,                              -- DuitNow id / phone shown to payers
  payment_qr_payload text,                             -- string encoded into the QR
  theme             text not null default 'kopitiam',
  created_at        timestamptz not null default now()
);

create table if not exists participants (
  id            uuid primary key default gen_random_uuid(),
  bill_id       uuid not null references bills(id) on delete cascade,
  name          text not null,
  phone         text,                                  -- for WhatsApp nudge (wa.me)
  amount_owed   numeric(12,2) not null default 0,
  status        text not null default 'unpaid',        -- unpaid | claimed | confirmed
  proof_url     text,
  claimed_at    timestamptz,
  confirmed_at  timestamptz,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists idx_participants_bill on participants(bill_id);

alter table bills enable row level security;
alter table participants enable row level security;
-- No policies => locked down for anon. Server actions use service_role (bypasses RLS).
