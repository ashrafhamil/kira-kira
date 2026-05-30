import { ImageResponse } from "next/og";
import { getBillBySlug } from "@/lib/db";
import { computeProgress } from "@/lib/format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Kira-Kira bill";

const money = (n: number) => `RM ${n.toFixed(2)}`;
// Satori has no emoji font; strip emoji/symbols so text renders cleanly.
const clean = (s: string) =>
  s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu, "").trim();

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bill = await getBillBySlug(slug);

  const title = clean(bill?.title ?? "Split the bill, no drama") || "Split the bill";
  const organizer = clean(bill?.organizer_name ?? "Kira-Kira") || "Kira-Kira";
  const progress = bill
    ? computeProgress(bill, bill.participants)
    : { total: 0, collected: 0, percent: 0, count: 0, paidCount: 0, pending: 0, remaining: 0, pendingCount: 0, unpaidCount: 0 };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FBF4E6",
          backgroundImage:
            "radial-gradient(circle at 12% 0%, rgba(232,169,61,0.30), transparent 45%), radial-gradient(circle at 100% 10%, rgba(15,92,82,0.14), transparent 40%)",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "#4A2E1E",
              color: "#FFF9EE",
              fontSize: 30,
              fontWeight: 800,
              marginRight: 16,
            }}
          >
            K
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: "#A8341E" }}>
            Kira-Kira
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#8A6A52" }}>
            {organizer} is collecting for
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 800,
              color: "#2A1A12",
              lineHeight: 1.05,
              marginTop: 10,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 26, color: "#8A6A52" }}>Total</div>
            <div style={{ display: "flex", fontSize: 58, fontWeight: 800, color: "#2A1A12" }}>
              {money(progress.total)}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              background: "#C8442B",
              color: "#fff",
              fontSize: 30,
              fontWeight: 700,
              padding: "16px 28px",
              borderRadius: 999,
            }}
          >
            Tap to pay your share
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            height: 18,
            borderRadius: 999,
            background: "#EBD9B8",
          }}
        >
          <div
            style={{
              display: "flex",
              width: `${Math.max(3, progress.percent)}%`,
              height: "100%",
              borderRadius: 999,
              background: progress.percent >= 100 ? "#1E6B3A" : "#C77F1A",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
