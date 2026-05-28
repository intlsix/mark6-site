import { getTranslations, setRequestLocale } from "next-intl/server";
import IntlCardLive from "@/components/home/IntlCardLive";
import HkCardLive from "@/components/home/HkCardLive";
import { Link } from "@/i18n/navigation";
import { getHongKongDraws } from "@/lib/draw/hongkong";
import { getInternationalDraws } from "@/lib/draw/international";
import { getPublishedByCategory } from "@/lib/admin/articles";
import { generatePageMetadata } from "@/lib/admin/metadata";
import type { KnowledgeArticle } from "@/lib/mark6/types";
import type { Metadata } from "next";

function HomeArticleSection({
  title,
  articles,
  locale,
}: {
  title: string;
  articles: KnowledgeArticle[];
  locale: string;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gold mb-4">{title}</h2>
      {articles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-surface-border bg-surface-card/30 p-6 text-center text-sm text-text-muted/50">
          —
        </div>
      ) : (
        <ul className="space-y-3">
          {articles.map((a) => (
            <li key={a.id}>
              <Link
                href={`/knowledge/${a.id}`}
                className="block rounded-lg border border-surface-border bg-surface-card p-4 no-underline hover:border-gold/40 transition"
              >
                <h3 className="text-gold font-medium mb-1">
                  {locale === "zh" ? a.titleZh : a.titleEn}
                </h3>
                <p className="text-sm text-text-muted line-clamp-2">
                  {locale === "zh" ? a.excerptZh : a.excerptEn}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata("/", locale);
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const [hkDraws, intlDraws, analysisArticles, guideArticles] = await Promise.all([
    getHongKongDraws(),
    getInternationalDraws(),
    getPublishedByCategory("analysis", 3),
    getPublishedByCategory("guide", 3),
  ]);
  const hk = hkDraws[0];
  const intl = intlDraws[0];
  const intlYear = intl ? new Date(intl.drawAt).getFullYear() : 2026;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gold mb-2">{t("title")}</h1>
      <p className="text-text-muted mb-8">{t("subtitle")}</p>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* HK card — auto-polls for new draws every 5s */}
        <HkCardLive initial={hk} year={hk ? new Date(hk.drawAt).getFullYear() : 2026} />

        {/* Intl card — live when broadcasting, static otherwise */}
        <IntlCardLive fallback={intl} year={intlYear} />
      </div>

      <HomeArticleSection title={t("latestAnalysis")} articles={analysisArticles} locale={locale} />
      <HomeArticleSection title={t("popularArticles")} articles={guideArticles} locale={locale} />
    </div>
  );
}
