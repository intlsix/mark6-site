import { getTranslations, setRequestLocale } from "next-intl/server";
import ResultsList from "@/components/results/ResultsList";
import { getInternationalDraws } from "@/lib/draw/international";
import { getSeoForPath } from "@/lib/admin/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return await getSeoForPath("/results/international", locale);
}

export const dynamic = "force-dynamic";

export default async function InternationalListPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("results");
  const draws = await getInternationalDraws();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-2">{t("intlTitle")}</h1>
      <p className="text-sm text-gold-dim mb-2">{t("intlAutoLabel")}</p>
      <ResultsList draws={draws} mode="intl" locale={locale} />
    </div>
  );
}