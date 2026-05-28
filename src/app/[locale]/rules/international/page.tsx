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
  const tLegal = await getTranslations("legal");

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
