"use client";

import { useEffect, useState } from "react";
import { adminJson } from "@/lib/admin/admin-fetch";
import { AdminToast } from "@/components/admin/AdminToast";
import type { SeoEntry } from "@/lib/admin/seo";

export default function SeoAdminPanel() {
  const [entries, setEntries] = useState<SeoEntry[]>([]);
  const [gv, setGv] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    adminJson<SeoEntry[]>("/api/admin/seo").then(setEntries).catch(() => {});
    adminJson<{ googleVerification?: string }>("/api/admin/settings")
      .then((s) => setGv(s.googleVerification || ""))
      .catch(() => {});
  }, []);

  async function save() {
    await adminJson("/api/admin/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entries),
    });
    await adminJson("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ googleVerification: gv }),
    });
    setToast("SEO 已保存");
  }

  function update(i: number, field: keyof SeoEntry, value: string) {
    setEntries((e) => e.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  }

  return (
    <div>
      <AdminToast msg={toast} type="ok" />
      <div className="flex gap-2 mb-4">
        <button type="button" onClick={save} className="px-4 py-2 bg-gold text-surface rounded text-sm">保存全部</button>
        <a href="/api/admin/seo?action=sitemap" target="_blank" className="px-4 py-2 border border-surface-border rounded text-sm no-underline text-gold">预览 sitemap</a>
        <a href="/api/admin/seo?action=robots" target="_blank" className="px-4 py-2 border border-surface-border rounded text-sm no-underline text-gold">预览 robots</a>
      </div>

      {/* Google Search Console 验证 */}
      <div className="rounded border border-surface-border p-4 mb-4">
        <h3 className="text-gold text-sm font-semibold mb-2">Google Search Console 验证</h3>
        <p className="text-text-muted text-xs mb-2">
          去 <a href="https://search.google.com/search-console" target="_blank" className="text-blue-400 underline">Google Search Console</a> → 添加资源 intlsix.com →
          选择「HTML 标签」验证方式 → 复制 meta 标签中 content=&#34;...&#34; 的值粘贴到这里
        </p>
        <input
          value={gv}
          onChange={(e) => setGv(e.target.value)}
          placeholder="粘贴 Google 验证码"
          className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm"
        />
        {gv && <p className="text-green-400 text-xs mt-1">已配置 ✓ 保存后生效。去 Search Console 点验证。</p>}
      </div>

      <div className="space-y-4">
        {entries.map((e, i) => (
          <div key={e.path} className="rounded border border-surface-border p-3 space-y-2 text-sm">
            <p className="text-gold font-mono">{e.path}</p>
            <input value={e.titleZh} onChange={(ev) => update(i, "titleZh", ev.target.value)} placeholder="Meta 标题（中文）" className="w-full rounded border border-surface-border bg-surface px-2 py-1" />
            <input value={e.titleEn} onChange={(ev) => update(i, "titleEn", ev.target.value)} placeholder="Meta title (EN)" className="w-full rounded border border-surface-border bg-surface px-2 py-1" />
            <textarea value={e.descZh} onChange={(ev) => update(i, "descZh", ev.target.value)} rows={2} className="w-full rounded border border-surface-border bg-surface px-2 py-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
