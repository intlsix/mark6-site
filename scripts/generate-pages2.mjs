import fs from "fs";
import path from "path";

const ROOT = path.join("C:\\Users\\Win-Hermes\\mark6-site\\src");

function w(rel, content) {
  const fp = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content.replace(/\r?\n/g, "\n"), "utf8");
}

// Trends
w("app/[locale]/trends/page.tsx", `import { setRequestLocale } from "next-intl/server";
import UsageGuide from "@/components/layout/UsageGuide";
import TrendsClient from "./TrendsClient";

export default async function TrendsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div>
      <UsageGuide titleKey="trendsTitle" whatKey="trendsWhat" howKey="trendsHow" />
      <TrendsClient />
    </div>
  );
}
`);

w("app/[locale]/trends/TrendsClient.tsx", `"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import NumberBall from "@/components/mark6/NumberBall";
import type { DrawRecord } from "@/lib/mark6/types";

interface Props {
  hkDraws?: DrawRecord[];
  intlDraws?: DrawRecord[];
}

function computeFreq(draws: DrawRecord[]) {
  const freq: Record<number, number> = {};
  for (let n = 1; n <= 49; n++) freq[n] = 0;
  for (const d of draws) {
    for (const n of d.numbers) freq[n]++;
    freq[d.special]++;
  }
  return freq;
}

export default function TrendsClient({ hkDraws = [], intlDraws = [] }: Props) {
  const t = useTranslations("trends");
  const [track, setTrack] = useState<"hk" | "intl">("hk");

  // Client will fetch if empty - use embedded data from server via separate API or pass as props
  // For simplicity, fetch on mount
  const [hk, setHk] = useState(hkDraws);
  const [intl, setIntl] = useState(intlDraws);
  const [loaded, setLoaded] = useState(false);

  useMemo(() => {
    if (loaded) return;
    fetch("/api/public/draws")
      .then((r) => r.json())
      .then((data: { hk: DrawRecord[]; intl: DrawRecord[] }) => {
        setHk(data.hk);
        setIntl(data.intl);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [loaded]);

  const draws = track === "hk" ? hk : intl;
  const freq = computeFreq(draws);
  const chartData = Object.entries(freq)
    .map(([num, count]) => ({ num: parseInt(num, 10), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  const max = Math.max(...Object.values(freq), 1);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-4">{t("title")}</h1>
      <div className="flex gap-2 mb-6">
        <button type="button" onClick={() => setTrack("hk")} className={\`px-4 py-2 rounded \${track === "hk" ? "bg-gold text-surface" : "border border-surface-border"}\`}>{t("trackHk")}</button>
        <button type="button" onClick={() => setTrack("intl")} className={\`px-4 py-2 rounded \${track === "intl" ? "bg-gold text-surface" : "border border-surface-border"}\`}>{t("trackIntl")}</button>
      </div>
      <p className="text-text-muted mb-4">{t("draws", { count: draws.length })}</p>
      <h2 className="text-lg text-gold mb-2">{t("freqChart")}</h2>
      <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="num" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#d4af37" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <h2 className="text-lg text-gold mb-2">{t("hotCold")}</h2>
      <p className="text-sm text-text-muted mb-4">{t("hotColdHint")}</p>
      <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
        {Array.from({ length: 49 }, (_, i) => i + 1).map((n) => (
          <div key={n} className="flex flex-col items-center" style={{ opacity: 0.3 + (freq[n] / max) * 0.7 }}>
            <NumberBall n={n} size="sm" />
            <span className="text-xs text-text-muted">{freq[n]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
`);

// Knowledge
w("app/[locale]/knowledge/page.tsx", `import { getTranslations, setRequestLocale } from "next-intl/server";
import UsageGuide from "@/components/layout/UsageGuide";
import { getPublishedArticles } from "@/lib/admin/articles";

export default async function KnowledgePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("knowledge");
  const articles = getPublishedArticles();

  return (
    <div>
      <UsageGuide titleKey="knowledgeTitle" whatKey="knowledgeWhat" howKey="knowledgeHow" />
      <h1 className="text-2xl font-bold text-gold mb-6">{t("title")}</h1>
      <ul className="space-y-6">
        {articles.map((a) => (
          <li key={a.id} className="rounded-lg border border-surface-border bg-surface-card p-6">
            <h2 className="text-xl text-gold mb-2">{locale === "zh" ? a.titleZh : a.titleEn}</h2>
            <p className="text-text-muted text-sm mb-4">{locale === "zh" ? a.excerptZh : a.excerptEn}</p>
            <div className="prose prose-invert text-sm whitespace-pre-wrap">
              {locale === "zh" ? a.contentZh : a.contentEn}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
`);

// Analysis hub
w("app/[locale]/analysis/page.tsx", `import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import UsageGuide from "@/components/layout/UsageGuide";

export default async function AnalysisHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("analysis");

  return (
    <div>
      <UsageGuide titleKey="analysisHubTitle" whatKey="analysisHubWhat" howKey="analysisHubHow" />
      <h1 className="text-2xl font-bold text-gold mb-6">{t("hubTitle")}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/analysis/idiom" className="block rounded-lg border border-surface-border bg-surface-card p-6 no-underline hover:border-gold/50">
          <h2 className="text-xl text-gold mb-2">{t("idiomCard")}</h2>
          <p className="text-sm text-text-muted">{t("idiomCardDesc")}</p>
        </Link>
        <Link href="/analysis/codes" className="block rounded-lg border border-surface-border bg-surface-card p-6 no-underline hover:border-gold/50">
          <h2 className="text-xl text-gold mb-2">{t("codesCard")}</h2>
          <p className="text-sm text-text-muted">{t("codesCardDesc")}</p>
        </Link>
      </div>
    </div>
  );
}
`);

w("app/[locale]/analysis/idiom/page.tsx", `import { setRequestLocale } from "next-intl/server";
import UsageGuide from "@/components/layout/UsageGuide";
import IdiomClient from "./IdiomClient";

export default async function IdiomPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div>
      <UsageGuide titleKey="idiomTitle" whatKey="idiomWhat" howKey="idiomHow" />
      <IdiomClient />
    </div>
  );
}
`);

w("app/[locale]/analysis/idiom/IdiomClient.tsx", `"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { decodeIdiom } from "@/lib/mark6/idiom";
import AnimalLabel from "@/components/mark6/AnimalLabel";
import AnimalSvg from "@/components/mark6/AnimalSvg";

export default function IdiomClient() {
  const t = useTranslations("idiom");
  const tPaths = useTranslations("idiomPaths");
  const [input, setInput] = useState("");
  const result = decodeIdiom(input);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-6">{t("pageTitle")}</h1>
      <div className="flex gap-2 mb-6 max-w-md">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("input")} className="flex-1 rounded border border-surface-border bg-surface-card px-3 py-2" />
      </div>
      {result ? (
        <div className="rounded-lg border border-surface-border bg-surface-card p-4">
          <p className="text-sm text-text-muted mb-2">{t("path")}: {tPaths(result.path as "story")}</p>
          <p className="mb-3">{t("pointing")}:</p>
          <div className="flex gap-4">
            {result.animals.map((a) => (
              <div key={a} className="flex flex-col items-center">
                <AnimalSvg animal={a} size={48} />
                <AnimalLabel animal={a} />
              </div>
            ))}
          </div>
        </div>
      ) : input.trim() ? (
        <p className="text-text-muted">{t("noResult")}</p>
      ) : null}
    </div>
  );
}
`);

w("app/[locale]/analysis/codes/page.tsx", `import { setRequestLocale } from "next-intl/server";
import UsageGuide from "@/components/layout/UsageGuide";
import CodesClient from "./CodesClient";

export default async function CodesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div>
      <UsageGuide titleKey="codesTitle" whatKey="codesWhat" howKey="codesHow" />
      <CodesClient />
    </div>
  );
}
`);

w("app/[locale]/analysis/codes/CodesClient.tsx", `"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { analyzeHiddenCodes } from "@/lib/mark6/codes";
import NumberBall from "@/components/mark6/NumberBall";
import AnimalLabel from "@/components/mark6/AnimalLabel";

export default function CodesClient() {
  const t = useTranslations("codes");
  const [input, setInput] = useState("1 13 25 37");
  const [year, setYear] = useState(new Date().getFullYear());
  const codes = input.split(/\\s+/).map((s) => parseInt(s, 10)).filter((n) => n >= 1 && n <= 49);
  const result = codes.length === 4 ? analyzeHiddenCodes(codes, year) : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-6">{t("pageTitle")}</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("input")} className="rounded border border-surface-border bg-surface-card px-3 py-2 min-w-[200px]" />
        <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10))} className="w-24 rounded border border-surface-border bg-surface-card px-3 py-2" />
      </div>
      {result && (
        <div className="space-y-4">
          <p>{t("taiSui")}: <AnimalLabel animal={result.taiSui} /></p>
          <div>
            <p className="text-gold mb-2">{t("mapping")}</p>
            {result.mapped.map(({ n, animal }) => (
              <div key={n} className="flex items-center gap-2 mb-1">
                <NumberBall n={n} size="sm" />
                <AnimalLabel animal={animal} />
              </div>
            ))}
          </div>
          <div>
            <p className="text-gold mb-2">{t("ranking")}</p>
            <ul className="text-sm space-y-1">
              {result.ranking.map(({ animal, score }) => (
                <li key={animal}><AnimalLabel animal={animal} />: {score.toFixed(1)}</li>
              ))}
            </ul>
          </div>
          <p>{t("topPick")}: <AnimalLabel animal={result.topPick} /></p>
          <div className="flex flex-wrap gap-1">
            {result.numbers.map((n) => <NumberBall key={n} n={n} size="sm" />)}
          </div>
        </div>
      )}
    </div>
  );
}
`);

// Admin layout wrapper
w("app/admin/layout.tsx", `export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
`);

w("app/admin/login/page.tsx", `"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setError("密码错误");
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-surface-border bg-surface-card p-8 space-y-4">
        <h1 className="text-xl text-gold font-bold text-center">管理员登录</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密码"
          className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-text"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" className="w-full py-2 bg-gold text-surface rounded font-medium">登录</button>
      </form>
    </div>
  );
}
`);

w("lib/admin/guard.ts", `import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "./auth";

export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");
}
`);

w("app/admin/dashboard/page.tsx", `import AdminLayout from "@/components/admin/AdminLayout";
import { requireAdmin } from "@/lib/admin/guard";
import { getHongKongDraws } from "@/lib/draw/hongkong";
import { getInternationalDraws } from "@/lib/draw/international";
import { getPublishedArticles } from "@/lib/admin/articles";
import { getLogs } from "@/lib/admin/logs";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const hk = getHongKongDraws();
  const intl = getInternationalDraws();
  const articles = getPublishedArticles();
  const logs = getLogs().slice(0, 5);

  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">控制台</h1>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg border border-surface-border bg-surface-card p-4"><p className="text-text-muted text-sm">香港开奖</p><p className="text-2xl text-gold">{hk.length}</p></div>
        <div className="rounded-lg border border-surface-border bg-surface-card p-4"><p className="text-text-muted text-sm">国际开奖</p><p className="text-2xl text-gold">{intl.length}</p></div>
        <div className="rounded-lg border border-surface-border bg-surface-card p-4"><p className="text-text-muted text-sm">已发布文章</p><p className="text-2xl text-gold">{articles.length}</p></div>
      </div>
      <h2 className="text-lg text-gold mb-3">最近操作</h2>
      <ul className="text-sm space-y-2">
        {logs.map((l) => (
          <li key={l.id} className="text-text-muted">{l.at} — {l.action}: {l.detail}</li>
        ))}
        {logs.length === 0 && <li className="text-text-muted">暂无日志</li>}
      </ul>
    </AdminLayout>
  );
}
`);

w("app/admin/draws/hongkong/page.tsx", `import AdminLayout from "@/components/admin/AdminLayout";
import { requireAdmin } from "@/lib/admin/guard";
import HkDrawsAdmin from "./HkDrawsAdmin";
import { getHongKongDraws } from "@/lib/draw/hongkong";

export default async function AdminHkDrawsPage() {
  await requireAdmin();
  const draws = getHongKongDraws();
  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">香港开奖管理</h1>
      <HkDrawsAdmin initialDraws={draws} />
    </AdminLayout>
  );
}
`);

w("app/admin/draws/hongkong/HkDrawsAdmin.tsx", `"use client";

import { useState } from "react";
import DrawForm from "@/components/admin/DrawForm";
import type { DrawRecord } from "@/lib/mark6/types";

export default function HkDrawsAdmin({ initialDraws }: { initialDraws: DrawRecord[] }) {
  const [draws, setDraws] = useState(initialDraws);
  const [editing, setEditing] = useState<DrawRecord | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function refresh() {
    const res = await fetch("/api/admin/hk-draws");
    setDraws(await res.json());
  }

  async function save(data: { id: string; drawAt: string; numbers: number[]; special: number }) {
    const method = editing ? "PUT" : "POST";
    await fetch("/api/admin/hk-draws", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setShowForm(false);
    setEditing(null);
    await refresh();
  }

  async function remove(id: string) {
    if (!confirm("确认删除？")) return;
    await fetch(\`/api/admin/hk-draws?id=\${encodeURIComponent(id)}\`, { method: "DELETE" });
    await refresh();
  }

  return (
    <div>
      <button type="button" onClick={() => { setShowForm(true); setEditing(null); }} className="mb-4 px-4 py-2 bg-gold text-surface rounded">手动录入</button>
      {(showForm || editing) && (
        <DrawForm
          initial={editing ?? undefined}
          onSubmit={save}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
      <ul className="mt-6 space-y-3">
        {draws.map((d) => (
          <li key={d.id} className="flex justify-between items-center rounded border border-surface-border p-3 text-sm">
            <span>{d.id} — {d.numbers.join(" ")} + {d.special}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setEditing(d); setShowForm(true); }} className="text-gold">编辑</button>
              <button type="button" onClick={() => remove(d.id)} className="text-red-400">删除</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
`);

w("app/admin/draws/international/page.tsx", `import AdminLayout from "@/components/admin/AdminLayout";
import { requireAdmin } from "@/lib/admin/guard";
import IntlDrawsAdmin from "./IntlDrawsAdmin";
import { getInternationalDraws, getManualInternationalDraws } from "@/lib/draw/international";

export default async function AdminIntlDrawsPage() {
  await requireAdmin();
  const auto = getInternationalDraws();
  const manual = getManualInternationalDraws();
  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">国际开奖管理</h1>
      <IntlDrawsAdmin autoDraws={auto} manualDraws={manual} />
    </AdminLayout>
  );
}
`);

w("app/admin/draws/international/IntlDrawsAdmin.tsx", `"use client";

import { useState } from "react";
import type { DrawRecord } from "@/lib/mark6/types";

export default function IntlDrawsAdmin({ autoDraws, manualDraws }: { autoDraws: DrawRecord[]; manualDraws: DrawRecord[] }) {
  const [auto, setAuto] = useState(autoDraws);
  const [manual, setManual] = useState(manualDraws);
  const [msg, setMsg] = useState("");

  async function trigger() {
    const res = await fetch("/api/admin/intl-draws", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "trigger" }) });
    const data = await res.json();
    setMsg(\`已开奖: \${data.id}\`);
    const r = await fetch("/api/admin/intl-draws");
    const j = await r.json();
    setAuto(j.auto);
    setManual(j.manual);
  }

  async function addManual() {
    const res = await fetch("/api/admin/intl-draws", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "manual" }) });
    await res.json();
    const r = await fetch("/api/admin/intl-draws");
    const j = await r.json();
    setManual(j.manual);
    setAuto(j.auto);
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button type="button" onClick={trigger} className="px-4 py-2 bg-gold text-surface rounded">立即开奖</button>
        <button type="button" onClick={addManual} className="px-4 py-2 border border-surface-border rounded">手动添加记录</button>
      </div>
      {msg && <p className="text-sm text-gold mb-4">{msg}</p>}
      <h2 className="text-lg text-gold mb-2">自动开奖 (最近10期)</h2>
      <ul className="text-sm space-y-2 mb-6">
        {auto.slice(0, 10).map((d) => (
          <li key={d.id}>{d.id} {d.drawAt.slice(0, 10)} {d.numbers?.join(" ")} 特:{d.special}</li>
        ))}
      </ul>
      <h2 className="text-lg text-gold mb-2">手动记录 (draws.json)</h2>
      <ul className="text-sm space-y-2">
        {manual.map((d) => (
          <li key={d.id}>{d.id} {d.source} {d.numbers.join(" ")} 特:{d.special}</li>
        ))}
      </ul>
    </div>
  );
}
`);

w("app/admin/articles/page.tsx", `import AdminLayout from "@/components/admin/AdminLayout";
import { requireAdmin } from "@/lib/admin/guard";
import ArticlesAdmin from "./ArticlesAdmin";
import { getArticles } from "@/lib/admin/articles";

export default async function AdminArticlesPage() {
  await requireAdmin();
  const articles = getArticles();
  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">文章管理</h1>
      <ArticlesAdmin initial={articles} />
    </AdminLayout>
  );
}
`);

w("app/admin/articles/ArticlesAdmin.tsx", `"use client";

import { useState } from "react";
import ArticleEditor from "@/components/admin/ArticleEditor";
import type { KnowledgeArticle } from "@/lib/mark6/types";

export default function ArticlesAdmin({ initial }: { initial: KnowledgeArticle[] }) {
  const [articles, setArticles] = useState(initial);
  const [selected, setSelected] = useState<KnowledgeArticle | null>(null);

  async function refresh() {
    const res = await fetch("/api/admin/articles");
    setArticles(await res.json());
  }

  async function save(article: KnowledgeArticle) {
    await fetch("/api/admin/articles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(article) });
    await refresh();
    setSelected(null);
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <button type="button" onClick={() => setSelected(null)} className="mb-4 px-4 py-2 bg-gold text-surface rounded">新建文章</button>
        <ul className="space-y-2 text-sm">
          {articles.map((a) => (
            <li key={a.id}>
              <button type="button" onClick={() => setSelected(a)} className="text-left hover:text-gold w-full">
                {a.titleZh} {a.published ? "✅" : "📝"}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ArticleEditor key={selected?.id ?? "new"} initial={selected ?? undefined} onSave={save} />
    </div>
  );
}
`);

w("app/admin/settings/page.tsx", `import AdminLayout from "@/components/admin/AdminLayout";
import { requireAdmin } from "@/lib/admin/guard";
import { defaultSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const s = defaultSettings;
  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">系统设置</h1>
      <dl className="text-sm space-y-2">
        <div><dt className="text-text-muted">公司名</dt><dd>{s.companyName}</dd></div>
        <div><dt className="text-text-muted">注册地</dt><dd>{s.jurisdiction}</dd></div>
        <div><dt className="text-text-muted">注册号</dt><dd>{s.regNumber}</dd></div>
        <div><dt className="text-text-muted">国际自动开奖</dt><dd>{s.intlAutoEnabled ? "开启" : "关闭"}</dd></div>
        <div><dt className="text-text-muted">管理员密码</dt><dd>通过 ADMIN_PASSWORD 环境变量设置（默认 changeme）</dd></div>
      </dl>
    </AdminLayout>
  );
}
`);

w("app/admin/logs/page.tsx", `import AdminLayout from "@/components/admin/AdminLayout";
import { requireAdmin } from "@/lib/admin/guard";
import { getLogs } from "@/lib/admin/logs";

export default async function AdminLogsPage() {
  await requireAdmin();
  const logs = getLogs();
  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">操作日志</h1>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-text-muted"><th className="p-2">时间</th><th className="p-2">操作</th><th className="p-2">详情</th></tr></thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id} className="border-t border-surface-border"><td className="p-2">{l.at}</td><td className="p-2">{l.action}</td><td className="p-2">{l.detail}</td></tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
`);

console.log("Wrote pages part 2");
