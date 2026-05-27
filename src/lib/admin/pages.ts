import fs from "fs";
import path from "path";

export interface StaticPage {
  slug: string;
  titleZh: string;
  titleEn: string;
  contentZh: string;
  contentEn: string;
  published: boolean;
  updatedAt: string;
}

const DATA_PATH = path.join(process.cwd(), "src/data/admin/pages.json");

const DEFAULT_PAGES: StaticPage[] = [
  { slug: "about", titleZh: "关于我们", titleEn: "About Us", contentZh: "香港国际六合彩致力于提供透明的开奖资讯。", contentEn: "Hong Kong International Mark Six provides transparent draw information.", published: true, updatedAt: new Date().toISOString() },
  { slug: "terms", titleZh: "服务条款", titleEn: "Terms of Service", contentZh: "使用本网站即表示您同意以下条款。", contentEn: "By using this site you agree to the following terms.", published: true, updatedAt: new Date().toISOString() },
  { slug: "privacy", titleZh: "隐私政策", titleEn: "Privacy Policy", contentZh: "我们重视您的隐私。", contentEn: "We value your privacy.", published: true, updatedAt: new Date().toISOString() },
  { slug: "responsible", titleZh: "负责任游戏", titleEn: "Responsible Gaming", contentZh: "请理性参与，18岁以上。", contentEn: "Play responsibly. 18+ only.", published: true, updatedAt: new Date().toISOString() },
  { slug: "contact", titleZh: "联系我们", titleEn: "Contact", contentZh: "如有疑问请联系客服。", contentEn: "Contact support for inquiries.", published: true, updatedAt: new Date().toISOString() },
];

function ensure(): StaticPage[] {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_PATH)) {
    try { fs.writeFileSync(DATA_PATH, JSON.stringify(DEFAULT_PAGES, null, 2) + "\n", "utf8"); } catch { /* read-only FS */ }
    return DEFAULT_PAGES;
  }
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8")) as StaticPage[];
}

export function getPages(): StaticPage[] {
  return ensure();
}

export function getPage(slug: string): StaticPage | undefined {
  return getPages().find((p) => p.slug === slug);
}

export function upsertPage(page: StaticPage): void {
  const all = getPages();
  const idx = all.findIndex((p) => p.slug === page.slug);
  const next = { ...page, updatedAt: new Date().toISOString() };
  if (idx >= 0) all[idx] = next;
  else all.push(next);
  try { fs.writeFileSync(DATA_PATH, JSON.stringify(all, null, 2) + "\n", "utf8"); } catch { /* read-only FS */ }
}
