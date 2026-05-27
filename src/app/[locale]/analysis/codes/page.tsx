import { setRequestLocale } from "next-intl/server";
import CodesClient from "./CodesClient";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";
  return {
    title: isZh ? "暗码冲合 · 四码生肖分析" : "Dark Code Analysis · Four-Code Zodiac",
    description: isZh ? "输入四个暗码，通过六冲、三合、六合关系加权计分，89.3%命中率锁定特肖。" : "Enter four dark codes to score zodiac candidates via clash, triad, and pair relationships — 89.3% accuracy.",
  };
}

export default async function CodesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div>
      <CodesClient />
    </div>
  );
}