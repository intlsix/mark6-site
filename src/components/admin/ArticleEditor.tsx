"use client";

import { useState } from "react";
import type { KnowledgeArticle } from "@/lib/mark6/types";
import { adminJson } from "@/lib/admin/admin-fetch";
import { AdminToast } from "./AdminToast";

export default function ArticleEditor({
  initial,
  onSaved,
}: {
  initial?: KnowledgeArticle;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<KnowledgeArticle>(
    initial ?? {
      id: `art-${Date.now()}`,
      category: "knowledge",
      titleZh: "",
      titleEn: "",
      excerptZh: "",
      excerptEn: "",
      contentZh: "",
      contentEn: "",
      published: false,
      updatedAt: new Date().toISOString(),
    }
  );
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);

  async function autoTranslate() {
    if (!form.titleZh && !form.contentZh) return;
    setTranslating(true);
    try {
      const fields = [
        { key: "titleEn", text: form.titleZh },
        { key: "excerptEn", text: form.excerptZh || form.contentZh.slice(0, 200) },
        { key: "contentEn", text: form.contentZh },
      ] as const;
      for (const { key, text } of fields) {
        if (!text || form[key as keyof typeof form]) continue;
        const r = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        const data = await r.json();
        if (data.translated) set((key as any), data.translated);
        await new Promise(r => setTimeout(r, 300)); // rate limit
      }
      setToast("翻译完成，可手动调整");
    } catch {
      setToast("翻译失败");
    } finally {
      setTranslating(false);
    }
  }

  async function save(published?: boolean) {
    setSaving(true);
    try {
      const article = { ...form, published: published ?? form.published, updatedAt: new Date().toISOString() };
      await adminJson("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });
      setToast(published ? "已发布" : "已保存");
      onSaved();
    } catch (e) {
      setToast((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const set = (k: keyof KnowledgeArticle, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="rounded-lg border border-surface-border bg-surface-card p-4 space-y-3">
      <AdminToast msg={toast} type="ok" />
      <input placeholder="中文标题" value={form.titleZh} onChange={(e) => set("titleZh", e.target.value)} className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm" />
      <input placeholder="英文标题" value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm" />
      <select value={form.category} onChange={(e) => set("category", e.target.value)} className="rounded border border-surface-border bg-surface px-3 py-2 text-sm">
        <option value="knowledge">知识库</option>
      </select>
      <textarea placeholder="中文摘要" value={form.excerptZh} onChange={(e) => set("excerptZh", e.target.value)} rows={2} className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm" />
      <textarea placeholder="英文摘要" value={form.excerptEn} onChange={(e) => set("excerptEn", e.target.value)} rows={2} className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm" />
      <textarea placeholder="中文内容 Markdown" value={form.contentZh} onChange={(e) => set("contentZh", e.target.value)} rows={8} className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm font-mono" />
      <textarea placeholder="英文内容 Markdown" value={form.contentEn} onChange={(e) => set("contentEn", e.target.value)} rows={8} className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm font-mono" />
      <div className="flex gap-2">
        <button type="button" disabled={saving || translating} onClick={autoTranslate} className="px-4 py-2 border border-amber-500/50 text-amber-400 rounded text-sm disabled:opacity-50">
          {translating ? "翻译中..." : "🔄 自动翻译成英文"}
        </button>
        <button type="button" disabled={saving} onClick={() => save(false)} className="px-4 py-2 border border-surface-border rounded text-sm">保存草稿</button>
        <button type="button" disabled={saving} onClick={() => save(true)} className="px-4 py-2 bg-gold text-surface rounded text-sm">发布</button>
      </div>
    </div>
  );
}
