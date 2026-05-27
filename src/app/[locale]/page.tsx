import { getTranslations, setRequestLocale } from "next-intl/server";
import IntlCardLive from "@/components/home/IntlCardLive";
import HkCardLive from "@/components/home/HkCardLive";
import { getHongKongDraws } from "@/lib/draw/hongkong";
import { getInternationalDraws } from "@/lib/draw/international";
import { getSeoForPath } from "@/lib/admin/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  try {
    return await getSeoForPath("/", locale);
  } catch {
    return { title: "Hong Kong International Mark Six", description: "Hong Kong Draw · International Draw" };
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const [hkDraws, intlDraws] = await Promise.all([getHongKongDraws(), getInternationalDraws()]);
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
    </div>
  );
}
