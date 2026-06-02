<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Integrations & env

- **Supabase** (Postgres + Storage) — all DB access via Server Actions with the **service-role key (server-only)**; RLS on, no public policies. Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- **Receipt scanning** — `/create` "Scan a receipt" → `ScanReceipt.tsx` (client compresses the photo) → `scanReceiptAction` → `src/lib/scan.ts` calls **Claude Haiku 4.5** vision with a forced `report_receipt` tool-call (structured JSON, no text parsing). The image is never persisted. Requires `ANTHROPIC_API_KEY`; the rest of the app runs without it.
