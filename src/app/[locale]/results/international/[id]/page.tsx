import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import DrawBalls from "@/components/mark6/DrawBalls";
import { getInternationalDraw } from "@/lib/draw/international";
import { verifySeed } from "@/lib/mark6/fairness";
import { getSeoForPath } from "@/lib/admin/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const draw = await getInternationalDraw(id);
  if (!draw) return await getSeoForPath("/results/international", locale);
  return {
    title: `${draw.id} | ${locale === "zh" ? "国际开奖" : "Intl Draw"}`,
    description: `${draw.numbers.join(" ")} + ${draw.special} — ${locale === "zh" ? "国际六合彩开奖详情" : "International Mark Six draw details"}`,
  };
}

export default async function InternationalDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("results");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");
  const draw = await getInternationalDraw(id);
  if (!draw) notFound();
  const year = new Date(draw.drawAt).getFullYear();
  const verified = draw.seed && draw.seedHash ? verifySeed(draw.seed, draw.seedHash) : null;

  return (
    <div>
      <Breadcrumb items={[
        { label: tCommon("breadcrumbHome"), href: "/" },
        { label: tNav("international"), href: "/results/international" },
        { label: draw.id },
      ]} />
      <h1 className="text-2xl font-bold text-gold mb-2">{draw.id}</h1>
      <p className="text-text-muted mb-2">{t("drawnAt")}: {new Date(draw.drawAt).toLocaleString(locale)}</p>
      <p className="text-sm text-gold-dim mb-6">{t("zodiacAgeMethod")}</p>
      <DrawBalls numbers={draw.numbers} special={draw.special} zodiacMode="age" year={year} animate />
      <section className="mt-8 rounded-lg border border-surface-border bg-surface-card p-4">
        <h2 className="text-lg text-gold mb-3">{t("fairness")}</h2>
        {draw.seedHash && (
          <p className="text-xs break-all mb-2"><span className="text-text-muted">{t("seedHash")}: </span>{draw.seedHash}</p>
        )}
        {draw.seed && (
          <p className="text-xs break-all mb-2"><span className="text-text-muted">{t("seed")}: </span>{draw.seed}</p>
        )}
        {verified === true && <p className="text-green-400 text-sm">{t("verified")}</p>}
        {verified === false && <p className="text-red-400 text-sm">{t("failed")}</p>}
        {verified === null && <p className="text-text-muted text-sm">{t("pending")}</p>}
      </section>
      <Link href="/results/international" className="inline-block mt-6 text-sm">{t("backIntl")}</Link>
    </div>
  );
}