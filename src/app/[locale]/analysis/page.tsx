import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";
  return {
    title: isZh ? "分析中心 · 红字解码与暗码冲合" : "Analysis · Red Character & Dark Code",
    description: isZh
      ? "六合皇信箱完整分析体系：红字解码8+5法、暗码冲合四步法、实战精读案例。"
      : "Complete Liu He Huang Mailbox analysis: red character decoding, dark code clash analysis, case studies.",
  };
}

export default async function AnalysisHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("analysis");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-2">{t("hubTitle")}</h1>
      <p className="text-text-muted mb-8 text-sm">
        {locale === "zh"
          ? "红字解码与暗码冲合——六合皇信箱完整分析体系"
          : "Red character decoding and dark code analysis — the complete Liu He Huang Mailbox analysis system"}
      </p>

      {/* Tools */}
      <h2 className="text-lg text-gold mt-2 mb-4">
        {locale === "zh" ? "分析工具" : "Analysis Tools"}
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <Link href="/analysis/idiom" className="block rounded-lg border border-surface-border bg-surface-card p-5 no-underline hover:border-gold/50 transition group">
          <h3 className="text-gold font-semibold mb-1.5 group-hover:text-gold-light">{t("idiomCard")}</h3>
          <p className="text-sm text-text-muted">{t("idiomCardDesc")}</p>
          <span className="text-xs text-gold-dim mt-2 inline-block">
            {locale === "zh" ? "输入红字 → 解码生肖" : "Enter red characters → decode zodiac"}
          </span>
        </Link>
        <Link href="/analysis/codes" className="block rounded-lg border border-surface-border bg-surface-card p-5 no-underline hover:border-gold/50 transition group">
          <h3 className="text-gold font-semibold mb-1.5 group-hover:text-gold-light">{t("codesCard")}</h3>
          <p className="text-sm text-text-muted">{t("codesCardDesc")}</p>
          <span className="text-xs text-gold-dim mt-2 inline-block">
            {locale === "zh" ? "输入四码 → 冲合评分" : "Enter four codes → clash/triad scoring"}
          </span>
        </Link>
      </div>

      {/* Learning */}
      <h2 className="text-lg text-gold mt-2 mb-4">
        {locale === "zh" ? "解码教学" : "Decoding Tutorials"}
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <Link href="/analysis/idiom/learn" className="block rounded-lg border border-gold/20 bg-surface-card p-5 no-underline hover:border-gold/50 transition group">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded bg-gold/10 text-gold">
              {locale === "zh" ? "8+5法" : "8+5 Methods"}
            </span>
          </div>
          <h3 className="text-gold font-semibold mb-1.5 group-hover:text-gold-light">
            {locale === "zh" ? "红字解码教学" : "Red Character Decoding"}
          </h3>
          <p className="text-sm text-text-muted">
            {locale === "zh"
              ? "从拆字到意境——8种基本手法+5种进阶手法，含实战案例。"
              : "From decomposition to imagery — 8 core + 5 advanced methods with real examples."}
          </p>
        </Link>
        <Link href="/analysis/codes/learn" className="block rounded-lg border border-gold/20 bg-surface-card p-5 no-underline hover:border-gold/50 transition group">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded bg-gold/10 text-gold">
              {locale === "zh" ? "89.3%验证" : "89.3% verified"}
            </span>
          </div>
          <h3 className="text-gold font-semibold mb-1.5 group-hover:text-gold-light">
            {locale === "zh" ? "暗码冲合教学" : "Dark Code Analysis"}
          </h3>
          <p className="text-sm text-text-muted">
            {locale === "zh"
              ? "四码冲合关系→特肖指向，含两大陷阱（强者陷阱/连续期陷阱）案例。"
              : "Four-code relationship → special zodiac, with two major trap case studies."}
          </p>
        </Link>
      </div>

      {/* Sample analyses */}
      <h2 className="text-lg text-gold mt-2 mb-4">
        {locale === "zh" ? "实战精读案例" : "Case Studies"}
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/knowledge/issue-057-analysis" className="block rounded-lg border border-surface-border bg-surface-card p-5 no-underline hover:border-gold/50 transition group">
          <h3 className="text-gold font-semibold mb-1.5 group-hover:text-gold-light">
            {locale === "zh" ? "057期：淚洒當場 → 鸡" : "Issue 057: Tearful Scene → Rooster"}
          </h3>
          <p className="text-sm text-text-muted">
            {locale === "zh"
              ? "洒=酉=鸡，暗码四路全指狗竟是陷阱——连续期重复陷阱教科书案例。"
              : "All four dark codes pointed to Dog — a textbook consecutive repeat trap."}
          </p>
        </Link>
        <Link href="/knowledge/red-char-basics" className="block rounded-lg border border-surface-border bg-surface-card p-5 no-underline hover:border-gold/50 transition group">
          <h3 className="text-gold font-semibold mb-1.5 group-hover:text-gold-light">
            {locale === "zh" ? "红字解码入门" : "Red Character Basics"}
          </h3>
          <p className="text-sm text-text-muted">
            {locale === "zh"
              ? "8种基本手法逐一拆解，看完就能自己解码红字。"
              : "All 8 core methods explained — decode red characters yourself."}
          </p>
        </Link>
      </div>
    </div>
  );
}
