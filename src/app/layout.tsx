import type { Metadata, Viewport } from "next";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Kira-Kira — Jom settle, no drama",
    template: "%s · Kira-Kira",
  },
  description:
    "Split the bill, share the link, get paid. A kopitiam-warm way to collect shared payments without the awkward chasing.",
  applicationName: "Kira-Kira",
  openGraph: {
    title: "Kira-Kira — Jom settle, no drama",
    description: "Split the bill, share the link, get paid. Senang.",
    siteName: "Kira-Kira",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kira-Kira — Jom settle, no drama",
    description: "Split the bill, share the link, get paid. Senang.",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF4E6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(localStorage.getItem('kira-theme')==='dark')document.documentElement.classList.add('dark');}catch(e){}})();",
          }}
        />
      </head>
      <body className="kopi-grain min-h-full">{children}</body>
    </html>
  );
}
