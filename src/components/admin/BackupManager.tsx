"use client";

import { useEffect, useState } from "react";
import { adminFetch, adminJson } from "@/lib/admin/admin-fetch";
import { AdminToast } from "./AdminToast";

interface BackupRecord {
  id: string;
  filename: string;
  sizeBytes: number;
  at: string;
}

export default function BackupManager() {
  const [list, setList] = useState<BackupRecord[]>([]);
  const [toast, setToast] = useState("");

  async function load() {
    setList(await adminJson<BackupRecord[]>("/api/admin/backup"));
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function create() {
    const rec = await adminJson<BackupRecord>("/api/admin/backup", { method: "POST", body: JSON.stringify({}) });
    setToast(`备份完成：${rec.filename}`);
    load();
  }

  async function restore(id: string) {
    if (!confirm("恢复将覆盖当前数据，是否继续？")) return;
    await adminJson("/api/admin/backup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "restore", id }),
    });
    setToast("恢复完成");
  }

  async function download(id: string) {
    const res = await adminFetch(`/api/admin/backup?download=${id}`);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${id}.json`;
    a.click();
  }

  return (
    <div>
      <AdminToast msg={toast} type="ok" />
      <p className="text-sm text-text-muted mb-4">自动备份：每天 03:00 UTC（可在系统设置启用）</p>
      <button type="button" onClick={create} className="mb-4 px-4 py-2 bg-gold text-surface rounded text-sm">
        立即备份
      </button>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-text-muted text-left">
            <th className="py-2">文件</th>
            <th>大小</th>
            <th>日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {list.map((b) => (
            <tr key={b.id} className="border-t border-surface-border">
              <td className="py-2">{b.filename}</td>
              <td>{(b.sizeBytes / 1024 / 1024).toFixed(2)} MB</td>
              <td>{b.at.slice(0, 10)}</td>
              <td className="space-x-2">
                <button type="button" onClick={() => download(b.id)} className="text-gold text-xs">下载</button>
                <button type="button" onClick={() => restore(b.id)} className="text-amber-400 text-xs">恢复</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
