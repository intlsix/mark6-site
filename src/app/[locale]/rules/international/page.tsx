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

      {/* 国际特色玩法 / International Featured Plays */}
      <section className="mb-8 rounded-lg border border-surface-border bg-surface-card p-6">
        <h2 className="text-xl text-gold mb-4">
          {isZh ? "国际特色玩法" : "International Featured Plays"}
        </h2>

        {/* 赔率表 / Odds Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border text-text-muted">
                <th className="text-left py-2 pr-4">{isZh ? "玩法" : "Play Type"}</th>
                <th className="text-right py-2 pr-4">{isZh ? "赔率" : "Odds"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50">
              <tr><td className="py-2 pr-4">{isZh ? "特码" : "Special Number"}</td><td className="text-right text-gold">1:47</td></tr>
              <tr><td className="py-2 pr-4">{isZh ? "平码精准定位" : "Regular Number Exact Match"}</td><td className="text-right text-gold">1:47</td></tr>
              <tr><td className="py-2 pr-4">{isZh ? "平码三全中" : "Regular 3-Number Straight"}</td><td className="text-right text-gold">1:670</td></tr>
              <tr><td className="py-2 pr-4">{isZh ? "平码二全中" : "Regular 2-Number Straight"}</td><td className="text-right text-gold">1:60</td></tr>
              <tr><td className="py-2 pr-4">{isZh ? "平肖三连肖" : "3 Zodiac Chain"}</td><td className="text-right text-gold">1:10</td></tr>
              <tr><td className="py-2 pr-4">{isZh ? "平肖四连肖" : "4 Zodiac Chain"}</td><td className="text-right text-gold">1:30</td></tr>
              <tr><td className="py-2 pr-4">{isZh ? "平肖五连肖" : "5 Zodiac Chain"}</td><td className="text-right text-gold">1:90</td></tr>
            </tbody>
          </table>
        </div>

        {/* 定位说明 / Positioning */}
        <div className="space-y-3 text-sm text-text-muted leading-relaxed">
          <p>
            {isZh
              ? "因受限于法律，香港本土不允许这样的玩法，但是国际上不受香港法律所约束。"
              : "Due to legal restrictions, these play types are not permitted under Hong Kong jurisdiction — but are fully available internationally, outside the scope of Hong Kong law."}
          </p>
          <p>
            {isZh
              ? "底层人员翻身做主最快的途径就是自己做国际六合彩的庄家。"
              : "The fastest path to turning the tables is becoming the banker of your own international Mark Six operation."}
          </p>
          <p>
            {isZh
              ? "开奖结果一律随机，多国统一国际开奖结果，无任何人为干涉。"
              : "All draw results are purely random, synchronized across multiple countries under a unified international result — zero human intervention."}
          </p>
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
