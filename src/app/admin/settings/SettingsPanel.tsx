"use client";

import { useEffect, useState } from "react";
import { adminJson } from "@/lib/admin/admin-fetch";
import { AdminToast } from "@/components/admin/AdminToast";
import type { SiteSettings } from "@/lib/admin/backup";

const FIELDS: { key: keyof SiteSettings; label: string }[] = [
  { key: "siteNameZh", label: "站点名称（中文）" },
  { key: "siteNameEn", label: "站点名称（英文）" },
  { key: "company", label: "公司名称" },
  { key: "jurisdiction", label: "注册地" },
  { key: "regNumber", label: "注册号" },
  { key: "contactEmail", label: "联系邮箱" },
];

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

  async function testScrape() {
    setToast("正在测试采集…");
    try {
      const res = await adminJson<{ ok: boolean; message: string; count?: number }>(
        "/api/admin/scrape",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" },
      );
      if (res?.ok) setToast(`采集成功，新增 ${res.count ?? 0} 期`);
      else setToast(res?.message ?? "采集失败");
    } catch {
      setToast("采集请求失败");
    }
  }

  if (!s) return <p className="text-text-muted">加载中…</p>;

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) =>
    setS((prev) => (prev ? { ...prev, [k]: v } : prev));

  return (
    <div className="max-w-lg space-y-4">
      <AdminToast msg={toast} type={toast.includes("成功") || toast.includes("已") ? "ok" : "err"} />

      {/* Site info fields */}
      {FIELDS.map(({ key, label }) => (
        <div key={key}>
          <label className="text-xs text-text-muted">{label}</label>
          <input
            value={s[key] as string}
            onChange={(e) => set(key, e.target.value)}
            className="mt-1 w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm"
          />
        </div>
      ))}

      {/* Scrape config */}
      <div className="rounded-lg border border-surface-border bg-surface-card p-4 space-y-3">
        <h3 className="text-gold font-bold text-sm">🔗 香港开奖采集</h3>
        <div>
          <label className="text-xs text-text-muted">采集源 URL</label>
          <input
            value={s.hkScrapeUrl ?? ""}
            onChange={(e) => set("hkScrapeUrl", e.target.value)}
            placeholder="https://tbjl.sxhwqc.com:2025/hk.html"
            className="mt-1 w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm"
          />
          <p className="text-xs text-text-muted/50 mt-1">定时采集：周二/四/六 21:35 北京</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={s.hkScrapeEnabled ?? false}
              onChange={(e) => set("hkScrapeEnabled", e.target.checked)}
              className="accent-gold"
            />
            启用自动采集
          </label>
          <button type="button" onClick={testScrape}
            className="px-3 py-1 bg-gold/20 text-gold rounded text-sm border border-gold/30 hover:bg-gold/30">
            🧪 手动采集
          </button>
        </div>
      </div>

      {/* Auto backup */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={s.autoBackupEnabled}
          onChange={(e) => set("autoBackupEnabled", e.target.checked)}
          className="accent-gold"
        />
        启用自动备份（每天 03:00 UTC）
      </label>

      <button type="button" onClick={save} className="px-4 py-2 bg-gold text-surface rounded text-sm">
        保存设置
      </button>
    </div>
  );
}
