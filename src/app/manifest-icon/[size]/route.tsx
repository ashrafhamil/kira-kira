import { ImageResponse } from "next/og";

export function generateStaticParams() {
  return [{ size: "192" }, { size: "512" }];
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ size: string }> },
) {
  const { size } = await params;
  const dim = size === "512" ? 512 : 192;
  // Maskable-safe: full-bleed kopi background, monogram within the safe zone.
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#4A2E1E",
          color: "#FFF9EE",
          fontSize: dim * 0.5,
          fontWeight: 800,
          fontFamily: "serif",
        }}
      >
        K
      </div>
    ),
    { width: dim, height: dim },
  );
}
