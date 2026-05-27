"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminJson } from "@/lib/admin/admin-fetch";
import type { AdminLogEntry } from "@/lib/mark6/types";

export default function DashboardClient() {
  const [stats, setStats] = useState({ hk: 0, intl: 0, articles: 0 });
  const [logs, setLogs] = useState<AdminLogEntry[]>([]);

  useEffect(() => {
    Promise.all([
      adminJson<unknown[]>("/api/admin/hk-draws"),
      adminJson<{ draws: unknown[] }>("/api/admin/intl-draws"),
      adminJson<unknown[]>("/api/admin/articles"),
      adminJson<AdminLogEntry[]>("/api/admin/logs?day=today"),
    ]).then(([hk, intl, arts, lg]) => {
      setStats({ hk: hk.length, intl: intl.draws?.length ?? 0, articles: arts.length });
      setLogs(lg.slice(0, 8));
    }).catch(() => {});
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">控制台</h1>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg border border-surface-border bg-surface-card p-4">
          <p className="text-text-muted text-sm">香港开奖</p>
          <p className="text-2xl text-gold">{stats.hk}</p>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface-card p-4">
          <p className="text-text-muted text-sm">国际开奖</p>
          <p className="text-2xl text-gold">{stats.intl}</p>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface-card p-4">
          <p className="text-text-muted text-sm">文章</p>
          <p className="text-2xl text-gold">{stats.articles}</p>
        </div>
      </div>
      <h2 className="text-lg text-gold mb-3">快捷操作</h2>
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/admin/draws/hongkong" className="px-3 py-2 rounded border border-surface-border text-sm no-underline hover:border-gold">录入香港开奖</Link>
        <Link href="/admin/draws/international" className="px-3 py-2 rounded border border-surface-border text-sm no-underline hover:border-gold">国际摇奖</Link>
        <Link href="/admin/draws/import" className="px-3 py-2 rounded border border-surface-border text-sm no-underline hover:border-gold">导入历史</Link>
        <Link href="/admin/articles" className="px-3 py-2 rounded border border-surface-border text-sm no-underline hover:border-gold">写文章</Link>
      </div>
      <h2 className="text-lg text-gold mb-3">今日操作</h2>
      <ul className="text-sm space-y-2 text-text-muted">
        {logs.map((l) => (
          <li key={l.id}>{l.at.slice(11, 19)} — {l.action}: {l.detail}</li>
        ))}
        {logs.length === 0 && <li>暂无</li>}
      </ul>
    </AdminLayout>
  );
}
