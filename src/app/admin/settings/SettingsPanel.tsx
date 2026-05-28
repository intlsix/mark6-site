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

  if (!s) return <p className="text-text-muted">加载中…</p>;

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) =>
    setS((prev) => (prev ? { ...prev, [k]: v } : prev));

  return (
    <div className="max-w-lg space-y-4">
      <AdminToast msg={toast} type="ok" />
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
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={s.autoBackupEnabled} onChange={(e) => set("autoBackupEnabled", e.target.checked)} />
        启用自动备份（每天 03:00 UTC）
      </label>
      <button type="button" onClick={save} className="px-4 py-2 bg-gold text-surface rounded text-sm">保存设置</button>
    </div>
  );
}
