import { readJson, writeJson } from "@/lib/storage/json-store";

export interface SeoEntry {
  path: string;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
}

const KEY = "admin/seo.json";

const DEFAULTS: SeoEntry[] = [
  { path: "/", titleZh: "香港国际六合彩", titleEn: "Hong Kong Intl Mark Six", descZh: "香港开奖与国际开奖双轨平台，每日北京21:30自动开奖，种子可验证", descEn: "Hong Kong and International Mark Six draws, daily at 21:30, verifiable fairness" },
  { path: "/results/hongkong", titleZh: "香港开奖结果", titleEn: "Hong Kong Mark Six Results", descZh: "香港六合彩开奖号码查询，岁数法生肖", descEn: "Hong Kong Mark Six draw results with age-method zodiac" },
  { path: "/results/international", titleZh: "国际开奖结果", titleEn: "International Mark Six Results", descZh: "每日国际自营开奖，种子哈希可验证公平性", descEn: "Daily international draws with verifiable seed hash" },
  { path: "/zodiac", titleZh: "生肖工具 - 岁数法查询", titleEn: "Zodiac Tools - Age Method", descZh: "号码查生肖，岁数法每年轮转，三合六冲可视化", descEn: "Look up zodiac by number using annual age method" },
  { path: "/trends", titleZh: "开奖走势分析", titleEn: "Mark Six Trends", descZh: "香港与国际开奖号码频率统计与冷热号分析", descEn: "Draw number frequency and hot/cold analysis" },
  { path: "/rules", titleZh: "玩法规则", titleEn: "Rules & How to Play", descZh: "香港标准六合彩与国际民间玩法完整规则", descEn: "Complete rules for Hong Kong and International Mark Six" },
  { path: "/knowledge", titleZh: "六合彩知识库", titleEn: "Mark Six Knowledge Base", descZh: "六合彩历史、生肖、波色知识大全", descEn: "Mark Six history, zodiac, wave colors, and guides" },
];

export async function getSeoEntries(): Promise<SeoEntry[]> {
  const entries = await readJson<SeoEntry[]>(KEY, []);
  if (entries.length === 0) {
    await writeJson(KEY, DEFAULTS);
    return DEFAULTS;
  }
  return entries;
}

export async function saveSeoEntries(entries: SeoEntry[]): Promise<boolean> {
  return writeJson(KEY, entries);
}

export async function generateSitemapXml(baseUrl: string): Promise<string> {
  const entries = await getSeoEntries();
  const urls = entries.flatMap((e) => [
    `  <url><loc>${baseUrl}/en${e.path === "/" ? "" : e.path}</loc></url>`,
    `  <url><loc>${baseUrl}/zh${e.path === "/" ? "" : e.path}</loc></url>`,
  ]);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

export function robotsTxt(): string {
  return `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/admin/\n`;
}

export async function getSeoForPath(path: string, locale: string): Promise<{ title: string; description: string }> {
  const entries = await getSeoEntries();
  const entry = entries.find((e) => e.path === path);
  if (!entry) return { title: "Hong Kong International Mark Six", description: "Hong Kong Draw · International Draw" };
  return {
    title: locale === "zh" ? entry.titleZh : entry.titleEn,
    description: locale === "zh" ? entry.descZh : entry.descEn,
  };
}
