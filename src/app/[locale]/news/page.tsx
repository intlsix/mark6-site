import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPublishedArticles } from "@/lib/admin/articles";
import { getSeoForPath } from "@/lib/admin/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return await getSeoForPath("/news", locale);
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const articles = (await getPublishedArticles()).filter((a) => a.category === "news");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-6">{t("title")}</h1>
      {articles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-surface-border bg-surface-card/30 p-8 text-center">
          <p className="text-text-muted/50">{t("noPosts")}</p>
        </div>
      ) : (
        <div className="space-y-1">
          {articles.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4 py-3 px-2 border-b border-surface-border/50 hover:bg-surface-card/50 transition rounded">
              <Link
                href={`/news/${a.id}`}
                className="text-gold no-underline hover:underline text-sm flex-1 min-w-0 truncate"
              >
                {locale === "zh" ? a.titleZh : a.titleEn}
              </Link>
              <span className="text-xs text-text-muted/50 shrink-0">
                {new Date(a.updatedAt).toLocaleDateString(locale, { year: "numeric", month: "2-digit", day: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
