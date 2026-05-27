import { MetadataRoute } from "next";

const BASE = "https://hkim6.com";

const staticRoutes = [
  "",
  "/rules",
  "/rules/hongkong",
  "/rules/international",
  "/glossary",
  "/zodiac",
  "/zodiac/lookup",
  "/trends",
  "/analysis",
  "/analysis/idiom",
  "/analysis/idiom/learn",
  "/analysis/codes",
  "/analysis/codes/learn",
  "/knowledge",
  "/faq",
  "/about",
  "/results/hongkong",
  "/results/international",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];

  for (const locale of ["zh", "en"]) {
    for (const route of staticRoutes) {
      urls.push({
        url: `${BASE}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route.startsWith("/results") ? "daily" : "weekly",
        priority: route === "" ? 1.0 : route.startsWith("/knowledge") ? 0.8 : route.includes("learn") ? 0.7 : 0.6,
      });
    }
  }

  return urls;
}
