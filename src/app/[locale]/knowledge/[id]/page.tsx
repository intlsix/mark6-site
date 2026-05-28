import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getArticles } from "@/lib/admin/articles";
import { generateDynamicMetadata } from "@/lib/admin/metadata";
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

const BASE_URL = "https://intlsix.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.id === id);
  if (!article) return { title: "Not found" };
  const title = locale === "zh" ? article.titleZh : article.titleEn;
  const desc = locale === "zh" ? article.excerptZh : article.excerptEn;
  return generateDynamicMetadata(
    `/${locale}/knowledge/${article.id}`,
    title,
    desc,
    locale,
  );
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("knowledge");
  const common = await getTranslations("common");
  const articles = await getArticles();
  const article = articles.find((a) => a.id === id);
  if (!article || !article.published) notFound();

  const title = locale === "zh" ? article.titleZh : article.titleEn;
  const desc = locale === "zh" ? article.excerptZh : article.excerptEn;

  return (
    <div>
      <ArticleSchema
        title={title}
        description={desc}
        url={`${BASE_URL}/${locale}/knowledge/${article.id}`}
        datePublished={article.updatedAt}
        dateModified={article.updatedAt}
      />
      <BreadcrumbSchema
        items={[
          { name: locale === "zh" ? "首页" : "Home", url: `${BASE_URL}/${locale}` },
          { name: locale === "zh" ? "知识库" : "Knowledge", url: `${BASE_URL}/${locale}/knowledge` },
          { name: title, url: `${BASE_URL}/${locale}/knowledge/${article.id}` },
        ]}
      />
      <Link href="/knowledge" className="text-sm text-gold-dim hover:text-gold no-underline mb-4 inline-block">
        {common("back")}
      </Link>
      <article className="rounded-lg border border-surface-border bg-surface-card p-6">
        <h1 className="text-2xl font-bold text-gold mb-2">
          {title}
        </h1>
        <p className="text-xs text-text-muted/50 mb-6">
          {new Date(article.updatedAt).toLocaleString(locale)}
        </p>
        <div className="text-sm text-text leading-relaxed whitespace-pre-wrap">
          {locale === "zh" ? article.contentZh : article.contentEn}
        </div>
      </article>
    </div>
  );
}
