import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/analytics.json");

export interface PageView {
  path: string;
  locale: string;
  country: string;
  timestamp: string;
}

export interface AnalyticsData {
  pageViews: PageView[];
}

export function getAnalytics(): AnalyticsData {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  } catch {
    return { pageViews: [] };
  }
}

export function saveAnalytics(data: AnalyticsData): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export function trackPageView(pv: PageView): void {
  const data = getAnalytics();
  data.pageViews.push(pv);
  // Keep max 100K records to prevent file bloat
  if (data.pageViews.length > 100000) {
    data.pageViews = data.pageViews.slice(-50000);
  }
  saveAnalytics(data);
}

export interface AnalyticsSummary {
  totalViews: number;
  dailyViews: { date: string; count: number }[];
  monthlyViews: { month: string; count: number }[];
  yearlyViews: { year: string; count: number }[];
  topCountries: { country: string; count: number; percentage: number }[];
  topPages: { path: string; count: number; percentage: number }[];
  recentViews: PageView[];
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const data = getAnalytics();
  const views = data.pageViews;
  const totalViews = views.length;

  // Daily views (last 30 days)
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

  // Monthly views (last 12 months)
  const monthlyMap = new Map<string, number>();
  for (const v of views) {
    const month = v.timestamp.slice(0, 7);
    monthlyMap.set(month, (monthlyMap.get(month) || 0) + 1);
  }
  const monthlyViews = Array.from(monthlyMap.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12);

  // Yearly views
  const yearlyMap = new Map<string, number>();
  for (const v of views) {
    const year = v.timestamp.slice(0, 4);
    yearlyMap.set(year, (yearlyMap.get(year) || 0) + 1);
  }
  const yearlyViews = Array.from(yearlyMap.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year.localeCompare(b.year));

  // Top countries
  const countryMap = new Map<string, number>();
  for (const v of views) {
    const c = v.country || "Unknown";
    countryMap.set(c, (countryMap.get(c) || 0) + 1);
  }
  const topCountries = Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, count, percentage: Math.round((count / totalViews) * 1000) / 10 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Top pages
  const pageMap = new Map<string, number>();
  for (const v of views) {
    const p = v.path || "/";
    pageMap.set(p, (pageMap.get(p) || 0) + 1);
  }
  const topPages = Array.from(pageMap.entries())
    .map(([path, count]) => ({ path, count, percentage: Math.round((count / totalViews) * 1000) / 10 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Recent views
  const recentViews = views.slice(-20).reverse();

  return {
    totalViews,
    dailyViews,
    monthlyViews,
    yearlyViews,
    topCountries,
    topPages,
    recentViews,
  };
}
