"use client";

import { useState } from "react";
import type { StaticPage } from "@/lib/admin/pages";
import { adminJson } from "@/lib/admin/admin-fetch";
import { AdminToast } from "./AdminToast";

export default function PageEditor({ page, onSaved, onCancel }: { page: StaticPage; onSaved: () => void; onCancel?: () => void }) {
  const [form, setForm] = useState(page);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(published?: boolean) {
    if (saving) return;
    setSaving(true);
    try {
      await adminJson("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, published: published ?? form.published }),
      });
      setToast("已保存");
      onSaved();
    } catch (e) {
      setToast((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-gold/40 bg-surface-card p-4 space-y-3 mt-4">
      <AdminToast msg={toast} type="ok" />
      <p className="text-xs text-text-muted">slug: {form.slug}</p>
      <input value={form.titleZh} onChange={(e) => setForm({ ...form, titleZh: e.target.value })} className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm" />
      <input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm" />
      <textarea value={form.contentZh} onChange={(e) => setForm({ ...form, contentZh: e.target.value })} rows={6} className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm font-mono" />
      <textarea value={form.contentEn} onChange={(e) => setForm({ ...form, contentEn: e.target.value })} rows={6} className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm font-mono" />
      <div className="flex gap-2">
        <button type="button" disabled={saving} onClick={() => save()} className="px-4 py-2 bg-gold text-surface rounded text-sm disabled:opacity-50">{saving ? "保存中…" : "保存"}</button>
        <button type="button" disabled={saving} onClick={() => save(true)} className="px-4 py-2 border border-surface-border rounded text-sm disabled:opacity-50">发布</button>
        {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 border border-surface-border rounded text-sm text-text-muted">取消</button>}
      </div>
    </div>
  );
}
