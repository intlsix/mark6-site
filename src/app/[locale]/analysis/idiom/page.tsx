import { setRequestLocale } from "next-intl/server";
import IdiomClient from "./IdiomClient";

export default async function IdiomPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div>
      <IdiomClient />
    </div>
  );
}