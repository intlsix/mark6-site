"use client";

import { useEffect, useState } from "react";
import { adminJson } from "@/lib/admin/admin-fetch";
import { AdminToast } from "@/components/admin/AdminToast";
import type { SiteSettings } from "@/lib/admin/backup";

export default function SettingsPanel() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    adminJson<SiteSettings>("/api/admin/settings").then(setS).catch(() => {});
  }, []);

  async function save() {
    if (!s) return;
    await adminJson("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    setToast("设置已保存");
  }

  if (!s) return <p className="text-text-muted">加载中…</p>;

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) =>
    setS((prev) => (prev ? { ...prev, [k]: v } : prev));

  return (
    <div className="max-w-lg space-y-3">
      <AdminToast msg={toast} type="ok" />
      {(["siteNameZh", "siteNameEn", "company", "jurisdiction", "regNumber", "contactEmail"] as const).map((k) => (
        <div key={k}>
          <label className="text-xs text-text-muted">{k}</label>
          <input
            value={s[k]}
            onChange={(e) => set(k, e.target.value)}
            className="mt-1 w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm"
          />
        </div>
      ))}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={s.autoBackupEnabled} onChange={(e) => set("autoBackupEnabled", e.target.checked)} />
        启用自动备份（每天 03:00 UTC）
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={s.hkScrapeEnabled} onChange={(e) => set("hkScrapeEnabled", e.target.checked)} />
        启用香港自动采集（需配置数据源）
      </label>
      <button type="button" onClick={save} className="px-4 py-2 bg-gold text-surface rounded text-sm">保存</button>
    </div>
  );
}
