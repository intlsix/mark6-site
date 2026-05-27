import { getTranslations, setRequestLocale } from "next-intl/server";
import IntlCardLive from "@/components/home/IntlCardLive";
import HkCardLive from "@/components/home/HkCardLive";
import { getHongKongDraws } from "@/lib/draw/hongkong";
import { getInternationalDraws } from "@/lib/draw/international";
import { getPublishedArticles } from "@/lib/admin/articles";
import { getSeoForPath } from "@/lib/admin/seo";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  try {
    return getSeoForPath("/", locale);
  } catch {
    return { title: "Hong Kong International Mark Six", description: "Hong Kong Draw · International Draw" };
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const hk = getHongKongDraws()[0];
  const intl = getInternationalDraws()[0];
  const intlYear = intl ? new Date(intl.drawAt).getFullYear() : 2026;
  const articles = getPublishedArticles().slice(0, 4);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gold mb-2">{t("title")}</h1>
      <p className="text-text-muted mb-8">{t("subtitle")}</p>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <HkCardLive initial={hk} year={hk ? new Date(hk.drawAt).getFullYear() : 2026} />
        <IntlCardLive fallback={intl} year={intlYear} />
      </div>

      {/* Knowledge section */}
      {articles.length > 0 && (
        <section className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-gold">{t("featured")}</h2>
            <Link href="/knowledge" className="text-sm text-text-muted hover:text-gold no-underline">
              {t("viewAll")} →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/knowledge/${a.id}`}
                className="block rounded-lg border border-surface-border bg-surface-card p-5 no-underline hover:border-gold/50 transition group"
              >
                <h3 className="text-gold font-semibold mb-1.5 group-hover:text-gold-light">
                  {locale === "zh" ? a.titleZh : a.titleEn}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                  {locale === "zh" ? a.excerptZh : a.excerptEn}
                </p>
                <span className="text-xs text-text-muted/40 mt-2 inline-block">
                  {new Date(a.updatedAt).toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US")}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
