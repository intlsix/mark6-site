import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSeoForPath } from "@/lib/admin/seo";
import type { Metadata } from "next";
import LegalNotice from "@/components/layout/LegalNotice";
import { RulesBasic, BetTable, ZodiacWaveRef } from "@/components/mark6/RulesContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return await getSeoForPath("/rules/international", locale);
}

export default async function RulesIntlPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rules");
  const isZh = locale === "zh";

  const standard = [
    { type: t("tema"), desc: t("temaDesc") },
    { type: t("temaZodiac"), desc: t("temaZodiacDesc") },
    { type: t("main"), desc: t("mainDesc") },
    { type: t("twoAll"), desc: t("twoAllDesc") },
    { type: t("threeAll"), desc: t("threeAllDesc") },
    { type: t("wave"), desc: t("waveDesc") },
  ];
  const folk = [
    { type: t("oddEven"), desc: t("oddEvenDesc") },
    { type: t("bigSmall"), desc: t("bigSmallDesc") },
    { type: t("sumOddEven"), desc: t("sumOddEvenDesc") },
    { type: t("head"), desc: t("headDesc") },
    { type: t("tail"), desc: t("tailDesc") },
    { type: t("threeWave"), desc: t("threeWaveDesc") },
    { type: t("fiveElements"), desc: t("fiveElementsDesc") },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-6">{t("intlSection")}</h1>
      <RulesBasic scheduleKey="intlSchedule" sourceKey="intlSource" />

      {/* 中奖概率对比 / Odds Comparison */}
      <section className="mb-8 rounded-lg border border-surface-border bg-surface-card p-6">
        <h2 className="text-xl text-gold mb-4">
          {isZh ? "中奖概率" : "Winning Odds"}
        </h2>
        <div className="grid gap-4 text-sm">
          <div className="flex items-start gap-3 p-3 rounded bg-surface/50">
            <span className="text-gold font-medium shrink-0 mt-0.5">
              {isZh ? "香港六合彩" : "HK Mark Six"}
            </span>
            <span className="text-text-muted">
              {isZh
                ? "头奖（选中 6 个搅出号码）概率：C(49,6) = 49×48×47×46×45×44 / 720 ≈ 一千四百万分之一（1/13,983,816）"
                : "Jackpot (match all 6 drawn numbers): C(49,6) = 49×48×47×46×45×44 / 720 ≈ 1 in 13,983,816"}
            </span>
          </div>
          <div className="flex items-start gap-3 p-3 rounded bg-surface/50">
            <span className="text-gold font-medium shrink-0 mt-0.5">
              {isZh ? "国际玩法" : "International"}
            </span>
            <span className="text-text-muted">
              {isZh
                ? "特码（选中 1 个号码）：49 个号码中选 1 个，中奖概率为 49 分之 1（1/49）"
                : "Special number (match 1 number): choose 1 from 49 numbers, odds of 1 in 49 (1/49)"}
            </span>
          </div>
        </div>
      </section>

      <BetTable rows={standard} />
      <h2 className="text-xl text-gold mb-4">{t("folkTitle")}</h2>
      <BetTable rows={folk} />
      <section className="mb-8">
        <h2 className="text-xl text-gold mb-4">{t("legalBlockTitle")}</h2>
        <LegalNotice />
      </section>
      <p className="text-sm text-text-muted">{t("disclaimer")}</p>
    </div>
  );
}
