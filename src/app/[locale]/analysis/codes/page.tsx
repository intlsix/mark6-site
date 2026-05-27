import { setRequestLocale } from "next-intl/server";
import CodesClient from "./CodesClient";

export default async function CodesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div>
      <CodesClient />
    </div>
  );
}