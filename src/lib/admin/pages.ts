import { readJson, writeJson } from "@/lib/storage/json-store";

export interface StaticPage {
  slug: string;
  titleZh: string;
  titleEn: string;
  contentZh: string;
  contentEn: string;
  published: boolean;
  updatedAt: string;
}

const KEY = "admin/pages.json";

const DEFAULT_PAGES: StaticPage[] = [
  { slug: "about", titleZh: "关于我们", titleEn: "About Us", contentZh: "香港国际六合彩致力于提供透明的开奖资讯。", contentEn: "Hong Kong International Mark Six provides transparent draw information.", published: true, updatedAt: new Date().toISOString() },
  { slug: "terms", titleZh: "服务条款", titleEn: "Terms of Service", contentZh: "使用本网站即表示您同意以下条款。", contentEn: "By using this site you agree to the following terms.", published: true, updatedAt: new Date().toISOString() },
  { slug: "privacy", titleZh: "隐私政策", titleEn: "Privacy Policy", contentZh: "我们重视您的隐私。", contentEn: "We value your privacy.", published: true, updatedAt: new Date().toISOString() },
  { slug: "responsible", titleZh: "负责任游戏", titleEn: "Responsible Gaming", contentZh: "请理性参与，18岁以上。", contentEn: "Play responsibly. 18+ only.", published: true, updatedAt: new Date().toISOString() },
  { slug: "contact", titleZh: "联系我们", titleEn: "Contact", contentZh: "如有疑问请联系客服。", contentEn: "Contact support for inquiries.", published: true, updatedAt: new Date().toISOString() },
];

export async function getPages(): Promise<StaticPage[]> {
  const pages = await readJson<StaticPage[]>(KEY, []);
  if (pages.length === 0) {
    await writeJson(KEY, DEFAULT_PAGES);
    return DEFAULT_PAGES;
  }
  return pages;
}

export async function getPage(slug: string): Promise<StaticPage | undefined> {
  const pages = await getPages();
  return pages.find((p) => p.slug === slug);
}

export async function upsertPage(page: StaticPage): Promise<boolean> {
  const all = await getPages();
  const idx = all.findIndex((p) => p.slug === page.slug);
  const next = { ...page, updatedAt: new Date().toISOString() };
  if (idx >= 0) all[idx] = next;
  else all.push(next);
  return writeJson(KEY, all);
}
