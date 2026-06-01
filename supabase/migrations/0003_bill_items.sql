-- Item-level split: each bill can have line items, each shared by a subset of
-- participants. Per-person amounts are computed at create time and stored on
-- participants; items are kept for the bill breakdown ("assign the satay to Ali").
create table if not exists bill_items (
  id          uuid primary key default gen_random_uuid(),
  bill_id     uuid not null references bills(id) on delete cascade,
  name        text not null,
  price       numeric(12,2) not null default 0,
  shared_by   uuid[] not null default '{}',   -- participant ids sharing this item
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists idx_bill_items_bill on bill_items(bill_id);

alter table bill_items enable row level security;
-- No policies => locked to anon; server actions use the service role.
