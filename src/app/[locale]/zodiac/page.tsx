import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSeoForPath } from "@/lib/admin/seo";
import type { Metadata } from "next";
import SanheTriangle from "@/components/mark6/SanheTriangle";
import LiuhePairs from "@/components/mark6/LiuhePairs";
import LiuchongPairs from "@/components/mark6/LiuchongPairs";
import AgeMethodGrid from "@/components/mark6/AgeMethodGrid";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getSeoForPath("/zodiac", locale);
}

export default async function ZodiacPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("zodiac");
  const year = new Date().getFullYear();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gold">{t("title")}</h1>
        <Link href="/zodiac/lookup" className="text-sm">{t("openLookup")}</Link>
      </div>
      <h2 className="text-xl text-gold mt-10 mb-2">{t("ageSection", { year })}</h2>
      <p className="text-sm text-text-muted mb-4">{t("ageNote")}</p>
      <AgeMethodGrid year={year} />
      <h2 className="text-xl text-gold mt-10 mb-4">{t("sanheTitle")}</h2>
      <SanheTriangle />
      <h2 className="text-xl text-gold mt-10 mb-4">{t("liuheTitle")}</h2>
      <LiuhePairs />
      <h2 className="text-xl text-gold mt-10 mb-4">{t("liuchongTitle")}</h2>
      <LiuchongPairs />
    </div>
  );
}
