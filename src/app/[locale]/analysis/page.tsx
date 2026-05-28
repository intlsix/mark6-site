import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSeoForPath } from "@/lib/admin/seo";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return await getSeoForPath("/analysis", locale);
}

export default async function AnalysisHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("analysis");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-6">{t("hubTitle")}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/analysis/idiom" className="block rounded-lg border border-surface-border bg-surface-card p-6 no-underline hover:border-gold/50">
          <h2 className="text-xl text-gold mb-2">{t("idiomCard")}</h2>
          <p className="text-sm text-text-muted">{t("idiomCardDesc")}</p>
        </Link>
        <Link href="/analysis/codes" className="block rounded-lg border border-surface-border bg-surface-card p-6 no-underline hover:border-gold/50">
          <h2 className="text-xl text-gold mb-2">{t("codesCard")}</h2>
          <p className="text-sm text-text-muted">{t("codesCardDesc")}</p>
        </Link>
      </div>
    </div>
  );
}
