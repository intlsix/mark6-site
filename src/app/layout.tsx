import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
