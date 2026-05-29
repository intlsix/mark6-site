import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPublishedArticles } from "@/lib/admin/articles";
import { getSeoForPath } from "@/lib/admin/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const PER_PAGE = 12;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return await getSeoForPath("/knowledge", locale);
}

export default async function KnowledgePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("knowledge");
  const allArticles = await getPublishedArticles();

  const totalPages = Math.ceil(allArticles.length / PER_PAGE);
  const showAll = sp.page === "all";
  const currentPage = sp.page && !isNaN(Number(sp.page)) ? Math.max(1, Math.min(Number(sp.page), totalPages)) : 1;
  const paginated = showAll ? allArticles : allArticles.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const baseHref = "/knowledge";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-6">{t("title")}</h1>

      {allArticles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-surface-border bg-surface-card/30 p-8 text-center">
          <p className="text-text-muted/50">{t("noPosts")}</p>
        </div>
      ) : (
        <>
          <div className="space-y-1 mb-6">
            {paginated.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-4 py-3 px-2 border-b border-surface-border/50 hover:bg-surface-card/50 transition rounded"
              >
                <Link
                  href={`/knowledge/${a.id}`}
                  className="text-gold no-underline hover:underline text-sm flex-1 min-w-0 truncate"
                >
                  {locale === "zh" ? a.titleZh : a.titleEn}
                </Link>
                <span className="text-xs text-text-muted/50 shrink-0">
                  {new Date(a.updatedAt).toLocaleDateString(locale)}
                </span>
              </div>
            ))}
          </div>

          {!showAll && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              {currentPage > 1 ? (
                <Link
                  href={`${baseHref}?page=${currentPage - 1}`}
                  className="px-3 py-1.5 text-sm border border-surface-border rounded hover:border-gold/40 text-text-muted hover:text-gold no-underline transition"
                >
                  {locale === "zh" ? "上一页" : "Previous"}
                </Link>
              ) : (
                <span className="px-3 py-1.5 text-sm border border-surface-border rounded text-text-muted/30 cursor-not-allowed">
                  {locale === "zh" ? "上一页" : "Previous"}
                </span>
              )}

              <span className="text-sm text-text-muted">
                {currentPage} / {totalPages}
              </span>

              {currentPage < totalPages ? (
                <Link
                  href={`${baseHref}?page=${currentPage + 1}`}
                  className="px-3 py-1.5 text-sm border border-surface-border rounded hover:border-gold/40 text-text-muted hover:text-gold no-underline transition"
                >
                  {locale === "zh" ? "下一页" : "Next"}
                </Link>
              ) : (
                <span className="px-3 py-1.5 text-sm border border-surface-border rounded text-text-muted/30 cursor-not-allowed">
                  {locale === "zh" ? "下一页" : "Next"}
                </span>
              )}

              <Link
                href={`${baseHref}?page=all`}
                className="px-3 py-1.5 text-sm border border-surface-border rounded hover:border-gold/40 text-text-muted hover:text-gold no-underline transition"
              >
                {locale === "zh" ? "全部" : "All"}
              </Link>
            </div>
          )}

          {showAll && (
            <div className="flex items-center justify-center">
              <Link
                href={baseHref}
                className="px-3 py-1.5 text-sm border border-surface-border rounded hover:border-gold/40 text-text-muted hover:text-gold no-underline transition"
              >
                {locale === "zh" ? "分页显示" : "Paginated"}
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
