"use client";

import { useEffect, useState } from "react";
import ArticleEditor from "@/components/admin/ArticleEditor";
import { adminFetch, adminJson } from "@/lib/admin/admin-fetch";
import type { KnowledgeArticle } from "@/lib/mark6/types";

export default function ArticlesAdminPanel() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [editing, setEditing] = useState<KnowledgeArticle | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    setArticles(await adminJson<KnowledgeArticle[]>("/api/admin/articles"));
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function remove(id: string) {
    if (!confirm("删除文章？")) return;
    await adminFetch(`/api/admin/articles?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <button type="button" onClick={() => { setCreating(true); setEditing(null); }} className="mb-4 px-4 py-2 bg-gold text-surface rounded text-sm">新建文章</button>
      {(creating || editing) && (
        <ArticleEditor
          initial={editing ?? undefined}
          onSaved={() => { setCreating(false); setEditing(null); load(); }}
        />
      )}
      <ul className="mt-6 space-y-2 text-sm">
        {articles.map((a) => (
          <li key={a.id} className="flex justify-between border border-surface-border rounded p-3">
            <span>{a.titleZh} {a.published ? "✅" : "📝"}</span>
            <span>
              <button type="button" onClick={() => { setEditing(a); setCreating(true); }} className="text-gold mr-2">编辑</button>
              <button type="button" onClick={() => remove(a.id)} className="text-red-400">删</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
