import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import DrawBalls from "@/components/mark6/DrawBalls";
import { getHongKongDraw } from "@/lib/draw/hongkong";
import { getSeoForPath } from "@/lib/admin/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const draw = getHongKongDraw(id);
  if (!draw) return getSeoForPath("/results/hongkong", locale);
  return {
    title: `${draw.id} | ${locale === "zh" ? "香港开奖" : "HK Draw"}`,
    description: `${draw.numbers.join(" ")} + ${draw.special} — ${locale === "zh" ? "香港六合彩开奖详情" : "Hong Kong Mark Six draw details"}`,
  };
}

export default async function HongKongDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("results");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");
  const draw = getHongKongDraw(id);
  if (!draw) notFound();

  return (
    <div>
      <Breadcrumb items={[
        { label: tCommon("breadcrumbHome"), href: "/" },
        { label: tNav("hongkong"), href: "/results/hongkong" },
        { label: draw.id },
      ]} />
      <h1 className="text-2xl font-bold text-gold mb-2">{draw.id}</h1>
      <p className="text-text-muted mb-6">{new Date(draw.drawAt).toLocaleString(locale)}</p>
      <h2 className="text-lg mb-2">{t("drawNumbers")}</h2>
      <DrawBalls numbers={draw.numbers} special={draw.special} zodiacMode="age" year={new Date(draw.drawAt).getFullYear()} />
      <Link href="/results/hongkong" className="inline-block mt-6 text-sm">{t("backHk")}</Link>
    </div>
  );
}