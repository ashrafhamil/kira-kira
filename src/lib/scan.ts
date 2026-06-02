import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export interface ScannedReceipt {
  items: { name: string; price: number }[];
  serviceCharge: number | null;
  sst: number | null;
  rounding: number | null;
  total: number | null;
}

// Haiku 4.5 — fast, cheap, accurate enough for clear printed receipts.
const MODEL = "claude-haiku-4-5-20251001";

const TOOL: Anthropic.Tool = {
  name: "report_receipt",
  description:
    "Report the ordered line items and charges extracted from a receipt photo.",
  input_schema: {
    type: "object",
    properties: {
      items: {
        type: "array",
        description: "Each ordered line item with its printed line-total price.",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Item name as printed (keep a quantity prefix like '2x' if shown).",
            },
            price: {
              type: "number",
              description: "Line total for this item in the receipt currency, as a plain number.",
            },
          },
          required: ["name", "price"],
        },
      },
      service_charge: {
        type: ["number", "null"],
        description: "Service charge amount if present, else null.",
      },
      sst: {
        type: ["number", "null"],
        description: "SST / GST / tax amount if present, else null.",
      },
      rounding: {
        type: ["number", "null"],
        description: "Rounding adjustment if present, else null.",
      },
      total: {
        type: ["number", "null"],
        description: "Grand total if present, else null.",
      },
    },
    required: ["items"],
  },
};

const PROMPT =
  "Extract every ordered line item and its price from this receipt. Put service " +
  "charge, SST/tax, rounding adjustment, and the grand total in their own fields — " +
  "do NOT list them as items. Use plain numbers with no currency symbols. If the " +
  "image is not a receipt or you can read nothing, return an empty items array.";

function cleanNumber(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
}

export async function scanReceipt(
  base64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp",
): Promise<ScannedReceipt> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    tools: [TOOL],
    tool_choice: { type: "tool", name: "report_receipt" },
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: PROMPT },
        ],
      },
    ],
  });

  const block = msg.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") throw new Error("No structured result");
  const input = block.input as Record<string, unknown>;

  const items = Array.isArray(input.items)
    ? (input.items as unknown[])
        .map((raw) => {
          const it = (raw ?? {}) as Record<string, unknown>;
          return {
            name: String(it.name ?? "").trim().slice(0, 60),
            price: cleanNumber(it.price),
          };
        })
        .filter((it): it is { name: string; price: number } =>
          Boolean(it.name) && it.price !== null,
        )
    : [];

  return {
    items,
    serviceCharge: cleanNumber(input.service_charge),
    sst: cleanNumber(input.sst),
    rounding: cleanNumber(input.rounding),
    total: cleanNumber(input.total),
  };
}
