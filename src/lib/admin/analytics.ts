import { readJson, writeJson } from "@/lib/storage/json-store";

const KEY = "analytics.json";

export interface PageView {
  path: string;
  locale: string;
  country: string;
  referrer: string;
  timestamp: string;
}

/** Classify raw referrer into a human-readable source label */
export function classifySource(referrer: string): string {
  if (!referrer || referrer === "direct") return "直接访问";
  const u = referrer.toLowerCase();
  if (u.includes("google.")) return "Google";
  if (u.includes("bing.")) return "Bing";
  if (u.includes("baidu.")) return "百度";
  if (u.includes("yahoo.")) return "Yahoo";
  if (u.includes("duckduckgo.")) return "DuckDuckGo";
  if (u.includes("yandex.")) return "Yandex";
  if (u.includes("facebook.") || u.includes("fb.com")) return "Facebook";
  if (u.includes("twitter.") || u.includes("x.com")) return "Twitter/X";
  if (u.includes("reddit.")) return "Reddit";
  if (u.includes("telegram.") || u.includes("t.me")) return "Telegram";
  if (u.includes("discord.")) return "Discord";
  if (u.includes("youtube.")) return "YouTube";
  // Any other external site → show domain
  try {
    const host = new URL(referrer).hostname.replace("www.", "");
    return host;
  } catch {
    return "外部链接";
  }
}

export interface AnalyticsData {
  pageViews: PageView[];
}

export async function getAnalytics(): Promise<AnalyticsData> {
  return readJson<AnalyticsData>(KEY, { pageViews: [] });
}

export async function saveAnalytics(data: AnalyticsData): Promise<boolean> {
  return writeJson(KEY, data);
}

export async function trackPageView(pv: PageView): Promise<void> {
  const data = await getAnalytics();
  data.pageViews.push(pv);
  if (data.pageViews.length > 100000) {
    data.pageViews = data.pageViews.slice(-50000);
  }
  await saveAnalytics(data);
}

export interface AnalyticsSummary {
  totalViews: number;
  dailyViews: { date: string; count: number }[];
  monthlyViews: { month: string; count: number }[];
  yearlyViews: { year: string; count: number }[];
  topCountries: { country: string; count: number; percentage: number }[];
  topPages: { path: string; count: number; percentage: number }[];
  topSources: { source: string; count: number; percentage: number }[];
  recentViews: PageView[];
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const data = await getAnalytics();
  const views = data.pageViews;
  const totalViews = views.length;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dailyMap = new Map<string, number>();
  for (const v of views) {
    const date = v.timestamp.split("T")[0];
    if (new Date(date) >= thirtyDaysAgo) {
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
    }
  }
  const dailyViews = Array.from(dailyMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const monthlyMap = new Map<string, number>();
  for (const v of views) {
    const month = v.timestamp.slice(0, 7);
    monthlyMap.set(month, (monthlyMap.get(month) || 0) + 1);
  }
  const monthlyViews = Array.from(monthlyMap.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12);

  const yearlyMap = new Map<string, number>();
  for (const v of views) {
    const year = v.timestamp.slice(0, 4);
    yearlyMap.set(year, (yearlyMap.get(year) || 0) + 1);
  }
  const yearlyViews = Array.from(yearlyMap.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year.localeCompare(b.year));

  const countryMap = new Map<string, number>();
  for (const v of views) {
    const c = v.country || "Unknown";
    countryMap.set(c, (countryMap.get(c) || 0) + 1);
  }
  const topCountries = Array.from(countryMap.entries())
    .map(([country, count]) => ({
      country,
      count,
      percentage: totalViews ? Math.round((count / totalViews) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const pageMap = new Map<string, number>();
  for (const v of views) {
    const p = v.path || "/";
    pageMap.set(p, (pageMap.get(p) || 0) + 1);
  }
  const topPages = Array.from(pageMap.entries())
    .map(([path, count]) => ({
      path,
      count,
      percentage: totalViews ? Math.round((count / totalViews) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const sourceMap = new Map<string, number>();
  for (const v of views) {
    const src = classifySource(v.referrer || "");
    sourceMap.set(src, (sourceMap.get(src) || 0) + 1);
  }
  const topSources = Array.from(sourceMap.entries())
    .map(([source, count]) => ({
      source,
      count,
      percentage: totalViews ? Math.round((count / totalViews) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const recentViews = views.slice(-20).reverse();

  return {
    totalViews,
    dailyViews,
    monthlyViews,
    yearlyViews,
    topCountries,
    topPages,
    topSources,
    recentViews,
  };
}
