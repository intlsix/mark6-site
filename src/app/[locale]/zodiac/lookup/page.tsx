import LookupClient from "./LookupClient";
import { setRequestLocale } from "next-intl/server";

export default async function LookupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div>
      <LookupClient />
    </div>
  );
}