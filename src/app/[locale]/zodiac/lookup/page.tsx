import LookupClient from "./LookupClient";
import { setRequestLocale } from "next-intl/server";
import { getSeoForPath } from "@/lib/admin/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return await getSeoForPath("/zodiac/lookup", locale);
}

export default async function LookupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div>
      <LookupClient />
    </div>
  );
}