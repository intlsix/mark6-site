import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSeoForPath } from "@/lib/admin/seo";
import type { Metadata } from "next";
import { RulesBasic, BetTable, ZodiacWaveRef } from "@/components/mark6/RulesContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return await getSeoForPath("/rules/hongkong", locale);
}

export default async function RulesHkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("rules");

  const rows = [
    { type: t("tema"), desc: t("temaDesc") },
    { type: t("temaZodiac"), desc: t("temaZodiacDesc") },
    { type: t("main"), desc: t("mainDesc") },
    { type: t("twoAll"), desc: t("twoAllDesc") },
    { type: t("threeAll"), desc: t("threeAllDesc") },
    { type: t("twoSp"), desc: t("twoSpDesc") },
    { type: t("combo"), desc: t("comboDesc") },
    { type: t("wave"), desc: t("waveDesc") },
    { type: t("oddEven"), desc: t("oddEvenDesc") },
    { type: t("bigSmall"), desc: t("bigSmallDesc") },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-6">{t("hkSection")}</h1>
      <RulesBasic scheduleKey="hkSchedule" sourceKey="hkSource" />
      <BetTable rows={rows} />
      <p className="text-sm text-text-muted">{t("disclaimer")}</p>
    </div>
  );
}