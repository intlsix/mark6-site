"use client";

import { useEffect, useState } from "react";
import PageEditor from "@/components/admin/PageEditor";
import { adminJson } from "@/lib/admin/admin-fetch";
import type { StaticPage } from "@/lib/admin/pages";

export default function PagesAdminPanel() {
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [active, setActive] = useState<StaticPage | null>(null);

  async function load() {
    setPages(await adminJson<StaticPage[]>("/api/admin/pages"));
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <div>
      <ul className="space-y-2 mb-4">
        {pages.map((p) => (
          <li key={p.slug} className="flex justify-between border border-surface-border rounded p-3 text-sm">
            <span>{p.titleZh} {p.published ? "✅" : "📝"}</span>
            <button type="button" onClick={() => setActive(p)} className="text-gold">编辑</button>
          </li>
        ))}
      </ul>
      {active && <PageEditor page={active} onSaved={() => { setActive(null); load(); }} onCancel={() => setActive(null)} />}
    </div>
  );
}
