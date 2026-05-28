import type { MetadataRoute } from "next";
import { getSeoEntries } from "@/lib/admin/seo";
import { getPublishedArticles } from "@/lib/admin/articles";
import { getHongKongDraws } from "@/lib/draw/hongkong";
import { getInternationalDraws } from "@/lib/draw/international";

const BASE_URL = "https://intlsix.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages from SEO config (en + zh)
  const seoEntries = await getSeoEntries();
  for (const se of seoEntries) {
    for (const locale of ["en", "zh"]) {
      const urlPath = se.path === "/" ? "" : se.path;
      entries.push({
        url: `${BASE_URL}/${locale}${urlPath}`,
        lastModified: new Date(),
        changeFrequency: se.path === "/" ? "daily" : "weekly",
        priority: se.path === "/" ? 1.0 : 0.8,
      });
    }
  }

  // Knowledge base articles
  const articles = await getPublishedArticles();
  for (const a of articles) {
    const cat = a.category === "news" ? "news" : "knowledge";
    for (const locale of ["en", "zh"]) {
      entries.push({
        url: `${BASE_URL}/${locale}/${cat}/${a.id}`,
        lastModified: new Date(a.updatedAt),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  // HK draw detail pages (latest 30)
  const hkDraws = await getHongKongDraws();
  for (const d of hkDraws.slice(0, 30)) {
    for (const locale of ["en", "zh"]) {
      entries.push({
        url: `${BASE_URL}/${locale}/results/hongkong/${d.id}`,
        lastModified: new Date(d.drawAt),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  // International draw detail pages (latest 30)
  const intlDraws = await getInternationalDraws();
  for (const d of intlDraws.slice(0, 30)) {
    for (const locale of ["en", "zh"]) {
      entries.push({
        url: `${BASE_URL}/${locale}/results/international/${d.id}`,
        lastModified: new Date(d.drawAt),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
