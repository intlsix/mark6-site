import { setRequestLocale } from "next-intl/server";
import IdiomClient from "./IdiomClient";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";
  return {
    title: isZh ? "红字解码 · 成语生肖分析" : "Red Character Decoder · Idiom to Zodiac",
    description: isZh ? "输入四字红字成语，智能解码指向生肖。支持典故、意象、关键词等多种解码路径。" : "Enter four-character red titles to decode zodiac animals via allusion, imagery, and keyword paths.",
  };
}

export default async function IdiomPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div>
      <IdiomClient />
    </div>
  );
}