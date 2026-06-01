import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kira-Kira — Split the bill, no drama",
    short_name: "Kira-Kira",
    description:
      "Split the bill, share the link, get paid. A kopitiam-warm way to collect shared payments without the awkward chasing.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FBF4E6",
    theme_color: "#FBF4E6",
    categories: ["finance", "utilities", "productivity"],
    icons: [
      { src: "/manifest-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/manifest-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/manifest-icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
