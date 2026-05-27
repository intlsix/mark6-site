import { getTranslations, setRequestLocale } from "next-intl/server";
import ResultsList from "@/components/results/ResultsList";
import { getHongKongDraws } from "@/lib/draw/hongkong";
import { getSeoForPath } from "@/lib/admin/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  try {
    return getSeoForPath("/results/hongkong", locale);
  } catch {
    return { title: "香港开奖结果 | Hong Kong Mark Six Results", description: "香港六合彩开奖号码查询" };
  }
}

export default async function HongKongListPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("results");
  const draws = getHongKongDraws();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-2">{t("hkTitle")}</h1>
      <p className="text-sm text-gold-dim mb-2">{t("hkSchedule")}</p>
      <ResultsList draws={draws} mode="hk" locale={locale} />
    </div>
  );
}