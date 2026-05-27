"use client";

import { useEffect, useState } from "react";
import { adminJson } from "@/lib/admin/admin-fetch";
import { AdminToast } from "@/components/admin/AdminToast";
import type { SeoEntry } from "@/lib/admin/seo";

export default function SeoAdminPanel() {
  const [entries, setEntries] = useState<SeoEntry[]>([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    adminJson<SeoEntry[]>("/api/admin/seo").then(setEntries).catch(() => {});
  }, []);

  async function save() {
    await adminJson("/api/admin/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entries),
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
