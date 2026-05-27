import { getTranslations, setRequestLocale } from "next-intl/server";
import { RulesBasic, BetTable, ZodiacWaveRef } from "@/components/mark6/RulesContent";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";
  return {
    title: isZh ? "香港开奖规则 · 10种标准玩法" : "Hong Kong Draw Rules · 10 Standard Bet Types",
    description: isZh ? "香港六合彩完整规则说明：特码、特肖、正码、二全中、三全中、二中特、特串、波色、单双、大小——10种玩法详解。" : "Complete Hong Kong Mark Six rules: special number, special zodiac, main numbers, all-match, wave color, odd/even, big/small — all 10 bet types explained.",
  };
}

export default async function RulesHkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
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