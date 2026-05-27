import fs from "fs";
import path from "path";

const ROOT = path.join("C:\\Users\\Win-Hermes\\mark6-site\\src");

function w(rel, content) {
  const fp = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content.replace(/\r?\n/g, "\n"), "utf8");
}

// ========== STYLES ==========
w("app/globals.css", `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-sans: system-ui, -apple-system, sans-serif;
}

body {
  @apply bg-surface text-text antialiased;
}

a {
  @apply text-gold hover:text-gold-light transition-colors;
}
`);

w("app/layout.tsx", `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hong Kong International Mark Six",
  description: "Hong Kong Draw · International Draw",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
`);

w("middleware.ts", `import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|.*\\\\..*).*)"],
};
`);

// ========== COMPONENTS ==========
w("components/mark6/NumberBall.tsx", `import { numToWave, waveColorClass } from "@/lib/mark6/waves";

interface Props {
  n: number;
  size?: "sm" | "md" | "lg";
  showNum?: boolean;
}

const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-12 w-12 text-base" };

export default function NumberBall({ n, size = "md", showNum = true }: Props) {
  const wave = numToWave(n);
  return (
    <span
      className={\`inline-flex items-center justify-center rounded-full font-bold text-white shadow-md \${waveColorClass(wave)} \${sizes[size]}\`}
      title={wave}
    >
      {showNum ? String(n).padStart(2, "0") : null}
    </span>
  );
}
`);

w("components/mark6/AnimalSvg.tsx", `import Image from "next/image";
import { animalImagePath } from "@/lib/mark6/animal-assets";
import type { Animal } from "@/lib/mark6/types";

interface Props {
  animal: Animal;
  size?: number;
  className?: string;
}

export default function AnimalSvg({ animal, size = 48, className = "" }: Props) {
  return (
    <Image
      src={animalImagePath(animal)}
      alt={animal}
      width={size}
      height={size}
      className={\`rounded-full object-cover \${className}\`}
    />
  );
}
`);

w("components/mark6/AnimalLabel.tsx", `"use client";

import { useTranslations } from "next-intl";
import type { Animal } from "@/lib/mark6/types";

export default function AnimalLabel({ animal }: { animal: Animal }) {
  const t = useTranslations("animals");
  return <span>{t(animal)}</span>;
}
`);

w("components/mark6/DrawBalls.tsx", `import NumberBall from "./NumberBall";
import AnimalLabel from "./AnimalLabel";
import { decodeBySuiShuFa } from "@/lib/mark6/suishufa";
import { numToAnimalStd } from "@/lib/mark6/zodiac";
import { numToWave } from "@/lib/mark6/waves";
import type { Animal } from "@/lib/mark6/types";

interface Props {
  numbers: number[];
  special: number;
  zodiacMode: "fixed" | "age";
  year?: number;
  showWave?: boolean;
}

function getAnimal(n: number, mode: "fixed" | "age", year: number): Animal {
  return mode === "fixed" ? numToAnimalStd(n) : decodeBySuiShuFa(n, year);
}

export default function DrawBalls({ numbers, special, zodiacMode, year = new Date().getFullYear(), showWave = true }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {numbers.map((n) => (
          <div key={n} className="flex flex-col items-center gap-1">
            <NumberBall n={n} />
            <span className="text-xs text-text-muted">
              <AnimalLabel animal={getAnimal(n, zodiacMode, year)} />
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <NumberBall n={special} size="lg" />
        <div className="text-sm">
          <AnimalLabel animal={getAnimal(special, zodiacMode, year)} />
          {showWave && (
            <span className="ml-2 text-text-muted">{numToWave(special)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
`);

w("components/mark6/ZodiacGrid.tsx", `import NumberBall from "./NumberBall";
import AnimalSvg from "./AnimalSvg";
import AnimalLabel from "./AnimalLabel";
import { ANIMAL_TO_NUMS } from "@/lib/mark6/constants";
import { ALL_ANIMALS } from "@/lib/mark6/types";

export default function ZodiacGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {ALL_ANIMALS.map((animal) => (
        <div key={animal} className="rounded-lg border border-surface-border bg-surface-card p-4 text-center">
          <AnimalSvg animal={animal} size={64} className="mx-auto mb-2" />
          <div className="font-medium text-gold mb-2"><AnimalLabel animal={animal} /></div>
          <div className="flex flex-wrap justify-center gap-1">
            {ANIMAL_TO_NUMS[animal].map((n) => (
              <NumberBall key={n} n={n} size="sm" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
`);

w("components/mark6/SanheTriangle.tsx", `"use client";

import { useTranslations } from "next-intl";
import { SANHE_GROUPS } from "@/lib/mark6/constants";
import AnimalSvg from "./AnimalSvg";
import AnimalLabel from "./AnimalLabel";

const LABEL_KEYS: Record<string, string> = {
  water: "water",
  wood: "wood",
  fire: "fire",
  metal: "metal",
};

export default function SanheTriangle() {
  const t = useTranslations("zodiac");
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {SANHE_GROUPS.map((group) => (
        <div key={group.label} className="rounded-lg border border-surface-border bg-surface-card p-4">
          <h3 className="text-gold mb-4 text-center">{t(LABEL_KEYS[group.label] as "water")}</h3>
          <div className="relative flex justify-center items-end h-32">
            <div className="absolute top-0 flex flex-col items-center">
              <AnimalSvg animal={group.animals[0]} size={48} />
              <AnimalLabel animal={group.animals[0]} />
            </div>
            <div className="absolute bottom-0 left-1/4 flex flex-col items-center">
              <AnimalSvg animal={group.animals[1]} size={48} />
              <AnimalLabel animal={group.animals[1]} />
            </div>
            <div className="absolute bottom-0 right-1/4 flex flex-col items-center">
              <AnimalSvg animal={group.animals[2]} size={48} />
              <AnimalLabel animal={group.animals[2]} />
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 120">
              <polygon points="100,10 40,110 160,110" fill="none" stroke="#d4af37" strokeWidth="2" opacity="0.5" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
`);

w("components/mark6/LiuhePairs.tsx", `import { LIUHE_PAIRS } from "@/lib/mark6/constants";
import AnimalSvg from "./AnimalSvg";
import AnimalLabel from "./AnimalLabel";

export default function LiuhePairs() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {LIUHE_PAIRS.map(([a, b]) => (
        <div key={\`\${a}-\${b}\`} className="flex items-center justify-center gap-3 rounded-lg border border-surface-border bg-surface-card p-3">
          <div className="flex flex-col items-center">
            <AnimalSvg animal={a} size={40} />
            <AnimalLabel animal={a} />
          </div>
          <span className="text-gold">↔</span>
          <div className="flex flex-col items-center">
            <AnimalSvg animal={b} size={40} />
            <AnimalLabel animal={b} />
          </div>
        </div>
      ))}
    </div>
  );
}
`);

w("components/mark6/LiuchongPairs.tsx", `import { LIUCHONG_PAIRS } from "@/lib/mark6/constants";
import AnimalSvg from "./AnimalSvg";
import AnimalLabel from "./AnimalLabel";

export default function LiuchongPairs() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {LIUCHONG_PAIRS.map(([a, b]) => (
        <div key={\`\${a}-\${b}\`} className="flex items-center justify-center gap-3 rounded-lg border border-red-900/40 bg-surface-card p-3">
          <div className="flex flex-col items-center">
            <AnimalSvg animal={a} size={40} />
            <AnimalLabel animal={a} />
          </div>
          <span className="text-red-400">←→</span>
          <div className="flex flex-col items-center">
            <AnimalSvg animal={b} size={40} />
            <AnimalLabel animal={b} />
          </div>
        </div>
      ))}
    </div>
  );
}
`);

w("components/mark6/AgeMethodGrid.tsx", `import { buildYearMap } from "@/lib/mark6/suishufa";
import NumberBall from "./NumberBall";
import AnimalLabel from "./AnimalLabel";
import { getSuiShuFaNumbers } from "@/lib/mark6/suishufa";

export default function AgeMethodGrid({ year }: { year: number }) {
  const map = buildYearMap(year);
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Object.entries(map).map(([rem, animal]) => (
        <div key={rem} className="rounded-lg border border-surface-border bg-surface-card p-3">
          <div className="text-sm text-gold mb-2">余{rem} · <AnimalLabel animal={animal} /></div>
          <div className="flex flex-wrap gap-1">
            {getSuiShuFaNumbers(animal, year).slice(0, 5).map((n) => (
              <NumberBall key={n} n={n} size="sm" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
`);

w("components/layout/Header.tsx", `"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LangSwitcher from "./LangSwitcher";

const NAV = [
  { key: "home", href: "/" },
  { key: "hongkong", href: "/results/hongkong" },
  { key: "international", href: "/results/international" },
  { key: "trends", href: "/trends" },
  { key: "zodiac", href: "/zodiac" },
  { key: "rules", href: "/rules" },
  { key: "knowledge", href: "/knowledge" },
  { key: "analysis", href: "/analysis" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const pathname = usePathname();

  return (
    <header className="border-b border-surface-border bg-surface-raised/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-4 mb-3">
          <Link href="/" className="text-gold font-bold text-lg no-underline hover:text-gold-light">
            {tBrand("logoFull")}
          </Link>
          <LangSwitcher />
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {NAV.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className={\`no-underline \${pathname === href ? "text-gold" : "text-text-muted hover:text-gold"}\`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
`);

w("components/layout/LangSwitcher.tsx", `"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: "en" | "zh") => {
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="flex gap-1 text-sm">
      <button
        type="button"
        onClick={() => switchTo("en")}
        className={\`px-2 py-1 rounded \${locale === "en" ? "bg-gold text-surface" : "text-text-muted hover:text-gold"}\`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchTo("zh")}
        className={\`px-2 py-1 rounded \${locale === "zh" ? "bg-gold text-surface" : "text-text-muted hover:text-gold"}\`}
      >
        中文
      </button>
    </div>
  );
}
`);

w("components/layout/LegalNotice.tsx", `"use client";

import { useTranslations } from "next-intl";

export default function LegalNotice() {
  const t = useTranslations("legal");
  return (
    <section className="rounded-lg border border-gold/30 bg-surface-card p-6 shadow-gold">
      <h2 className="text-xl font-bold text-gold mb-4">{t("noticeTitle")}</h2>
      <p className="mb-2">{t("operatorLine", { company: t("companyName") })}</p>
      <p className="mb-4 text-text-muted text-sm">
        {t("registeredLine", { jurisdiction: t("jurisdiction"), regNumber: t("regNumber") })}
      </p>
      <h3 className="font-semibold mb-2">{t("complianceTitle")}</h3>
      <ul className="list-disc pl-5 text-sm text-text-muted space-y-1 mb-4">
        <li>{t("law1")}</li>
        <li>{t("law2")}</li>
        <li>{t("law3")}</li>
      </ul>
      <h3 className="font-semibold mb-2">{t("fairTitle")}</h3>
      <ul className="list-disc pl-5 text-sm text-text-muted space-y-1 mb-4">
        <li>{t("fair1")}</li>
        <li>{t("fair2")}</li>
        <li>{t("fair3")}</li>
      </ul>
      <p className="text-sm">{t("ageLimit")}</p>
      <p className="text-sm text-text-muted">{t("responsible")}</p>
    </section>
  );
}
`);

w("components/layout/SiteFooter.tsx", `"use client";

import { useTranslations } from "next-intl";

export default function SiteFooter() {
  const t = useTranslations("legal");
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-surface-border bg-surface-raised mt-12 py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-text-muted space-y-2">
        <p>{t("footerFair")}</p>
        <p>{t("footerCopyright", { year, company: t("companyName") })}</p>
        <p>{t("footerReg", { jurisdiction: t("jurisdiction"), regNumber: t("regNumber") })}</p>
      </div>
    </footer>
  );
}
`);

w("components/layout/UsageGuide.tsx", `"use client";

import { useTranslations } from "next-intl";

interface Props {
  titleKey: string;
  whatKey: string;
  howKey: string;
}

export default function UsageGuide({ titleKey, whatKey, howKey }: Props) {
  const t = useTranslations("usage");
  return (
    <aside className="rounded-lg border border-surface-border bg-surface-card/50 p-4 mb-8 text-sm">
      <p className="text-gold font-medium mb-1">{t("label")}</p>
      <h2 className="font-semibold mb-2">{t(titleKey as "homeTitle")}</h2>
      <p className="text-text-muted mb-1">{t(whatKey as "homeWhat")}</p>
      <p className="text-text-muted">{t(howKey as "homeHow")}</p>
    </aside>
  );
}
`);

w("components/layout/Breadcrumb.tsx", `import { Link } from "@/i18n/navigation";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="text-sm text-text-muted mb-4">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && " › "}
          {item.href ? (
            <Link href={item.href} className="hover:text-gold">{item.label}</Link>
          ) : (
            <span className="text-text">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
`);

// Admin components
w("components/admin/AdminLayout.tsx", `"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin/dashboard", label: "控制台" },
  { href: "/admin/draws/hongkong", label: "香港开奖" },
  { href: "/admin/draws/international", label: "国际开奖" },
  { href: "/admin/articles", label: "文章管理" },
  { href: "/admin/settings", label: "系统设置" },
  { href: "/admin/logs", label: "操作日志" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface text-text">
      <header className="border-b border-surface-border bg-surface-raised px-4 py-3 flex items-center justify-between">
        <span className="text-gold font-bold">Mark6 后台管理</span>
        <button type="button" onClick={logout} className="text-sm text-text-muted hover:text-gold">退出登录</button>
      </header>
      <div className="flex">
        <aside className="w-48 border-r border-surface-border min-h-[calc(100vh-52px)] p-3 space-y-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={\`block px-3 py-2 rounded text-sm no-underline \${pathname === href ? "bg-gold/20 text-gold" : "text-text-muted hover:text-gold"}\`}
            >
              {label}
            </Link>
          ))}
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
`);

w("components/admin/DrawForm.tsx", `"use client";

import { useState } from "react";

interface Props {
  initial?: { id: string; drawAt: string; numbers: number[]; special: number };
  onSubmit: (data: { id: string; drawAt: string; numbers: number[]; special: number }) => Promise<void>;
  onCancel?: () => void;
}

export default function DrawForm({ initial, onSubmit, onCancel }: Props) {
  const [id, setId] = useState(initial?.id ?? "");
  const [drawAt, setDrawAt] = useState(initial?.drawAt?.slice(0, 10) ?? "");
  const [nums, setNums] = useState((initial?.numbers ?? []).join(" "));
  const [special, setSpecial] = useState(String(initial?.special ?? ""));
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const numbers = nums.split(/\\s+/).map((s) => parseInt(s, 10)).filter((n) => n >= 1 && n <= 49);
    await onSubmit({ id, drawAt: new Date(drawAt).toISOString(), numbers, special: parseInt(special, 10) });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <div>
        <label className="block text-sm mb-1">期号</label>
        <input value={id} onChange={(e) => setId(e.target.value)} className="w-full rounded border border-surface-border bg-surface-card px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm mb-1">日期</label>
        <input type="date" value={drawAt} onChange={(e) => setDrawAt(e.target.value)} className="w-full rounded border border-surface-border bg-surface-card px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm mb-1">平码 (空格分隔)</label>
        <input value={nums} onChange={(e) => setNums(e.target.value)} placeholder="11 22 33 44 05 18" className="w-full rounded border border-surface-border bg-surface-card px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm mb-1">特码</label>
        <input value={special} onChange={(e) => setSpecial(e.target.value)} className="w-full rounded border border-surface-border bg-surface-card px-3 py-2" required />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-gold text-surface rounded font-medium">{loading ? "保存中…" : "保存"}</button>
        {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 border border-surface-border rounded">取消</button>}
      </div>
    </form>
  );
}
`);

w("components/admin/ArticleEditor.tsx", `"use client";

import { useState } from "react";
import type { KnowledgeArticle } from "@/lib/mark6/types";

interface Props {
  initial?: KnowledgeArticle;
  onSave: (article: KnowledgeArticle) => Promise<void>;
}

export default function ArticleEditor({ initial, onSave }: Props) {
  const [article, setArticle] = useState<KnowledgeArticle>(
    initial ?? {
      id: \`article-\${Date.now()}\`,
      category: "guide",
      titleZh: "",
      titleEn: "",
      excerptZh: "",
      excerptEn: "",
      contentZh: "",
      contentEn: "",
      published: false,
      updatedAt: new Date().toISOString(),
    },
  );
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await onSave({ ...article, updatedAt: new Date().toISOString() });
    setLoading(false);
  }

  const field = (key: keyof KnowledgeArticle, label: string, multiline = false) => (
    <div key={String(key)}>
      <label className="block text-sm mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={String(article[key])}
          onChange={(e) => setArticle({ ...article, [key]: e.target.value })}
          rows={4}
          className="w-full rounded border border-surface-border bg-surface-card px-3 py-2"
        />
      ) : (
        <input
          value={String(article[key])}
          onChange={(e) => setArticle({ ...article, [key]: key === "published" ? e.target.checked : e.target.value } as KnowledgeArticle)}
          type={key === "published" ? "checkbox" : "text"}
          className={key === "published" ? "" : "w-full rounded border border-surface-border bg-surface-card px-3 py-2"}
        />
      )}
    </div>
  );

  return (
    <form onSubmit={handleSave} className="space-y-3 max-w-2xl">
      {field("id", "ID")}
      {field("category", "分类")}
      {field("titleZh", "中文标题")}
      {field("titleEn", "英文标题")}
      {field("excerptZh", "中文摘要")}
      {field("excerptEn", "英文摘要")}
      {field("contentZh", "中文内容", true)}
      {field("contentEn", "英文内容", true)}
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={article.published} onChange={(e) => setArticle({ ...article, published: e.target.checked })} />
        <span className="text-sm">已发布</span>
      </div>
      <button type="submit" disabled={loading} className="px-4 py-2 bg-gold text-surface rounded">{loading ? "保存中…" : "保存"}</button>
    </form>
  );
}
`);

console.log("Wrote components and base app files");
