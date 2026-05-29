import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSettings } from "@/lib/admin/backup";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const gv = settings.googleVerification || "";
  return {
    metadataBase: new URL("https://intlsix.com"),
    description: "Hong Kong Draw · International Draw",
    openGraph: {
      siteName: "Hong Kong International Mark Six",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
    },
    verification: gv ? { google: gv } : undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const heads = await headers();
  if (heads.get("x-is-j8x2k5m") === "1") {
    return (
      <html lang="zh">
        <body className="bg-black">{children}</body>
      </html>
    );
  }
  return children;
}
