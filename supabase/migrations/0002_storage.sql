-- Public bucket for payment-proof screenshots. Uploads happen server-side via
-- the service role (which bypasses storage RLS); reads are public so the
-- organizer can view proofs from the dashboard.
insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', true)
on conflict (id) do nothing;
