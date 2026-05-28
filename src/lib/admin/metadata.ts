import type { Metadata } from "next";
import { getSeoForPath } from "@/lib/admin/seo";

const BASE_URL = "https://intlsix.com";

const SITE_NAME = "Hong Kong International Mark Six";
const SITE_NAME_ZH = "香港国际六合彩";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * Generate page metadata with full OG/Twitter tags.
 * Use this in every page's generateMetadata instead of calling getSeoForPath directly.
 */
export async function generatePageMetadata(
  path: string,
  locale: string,
): Promise<Metadata> {
  const seo = await getSeoForPath(path, locale);
  const isZh = locale === "zh";
  const siteName = isZh ? SITE_NAME_ZH : SITE_NAME;

  return {
    title: seo.title,
    description: seo.description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${locale}${path === "/" ? "" : path}`,
      languages: {
        en: `${BASE_URL}/en${path === "/" ? "" : path}`,
        zh: `${BASE_URL}/zh${path === "/" ? "" : path}`,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${BASE_URL}/${locale}${path === "/" ? "" : path}`,
      siteName,
      locale: isZh ? "zh_HK" : "en_US",
      type: "website",
      images: [{ url: DEFAULT_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [DEFAULT_IMAGE],
    },
  };
}

/**
 * For dynamic pages (articles, draw details) where the path is constructed at runtime.
 */
export async function generateDynamicMetadata(
  urlPath: string,
  title: string,
  description: string,
  locale: string,
): Promise<Metadata> {
  const isZh = locale === "zh";
  const siteName = isZh ? SITE_NAME_ZH : SITE_NAME;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}${urlPath}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${urlPath}`,
      siteName,
      locale: isZh ? "zh_HK" : "en_US",
      type: "article",
      images: [{ url: DEFAULT_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_IMAGE],
    },
  };
}
