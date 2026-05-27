import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSeoForPath } from "@/lib/admin/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return await getSeoForPath("/rules", locale);
}

export default async function RulesHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rules");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-2">{t("hubTitle")}</h1>
      <p className="text-text-muted mb-8">{t("hubIntro")}</p>
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/rules/hongkong" className="block rounded-lg border border-surface-border bg-surface-card p-6 no-underline hover:border-gold/50">
          <h2 className="text-xl text-gold mb-2">{t("hkCard")}</h2>
          <p className="text-sm text-text-muted">{t("hkCardDesc")}</p>
        </Link>
        <Link href="/rules/international" className="block rounded-lg border border-surface-border bg-surface-card p-6 no-underline hover:border-gold/50">
          <h2 className="text-xl text-gold mb-2">{t("intlCard")}</h2>
          <p className="text-sm text-text-muted">{t("intlCardDesc")}</p>
        </Link>
      </div>
    </div>
  );
}