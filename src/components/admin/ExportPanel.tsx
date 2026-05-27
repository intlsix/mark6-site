"use client";

import { useEffect, useState } from "react";
import { adminFetch, adminJson } from "@/lib/admin/admin-fetch";
import { AdminToast } from "./AdminToast";

interface ExportRecord {
  filename: string;
  track: string;
  sizeBytes: number;
  at: string;
}

export default function ExportPanel() {
  const [track, setTrack] = useState<"hongkong" | "international">("hongkong");
  const [year, setYear] = useState("");
  const [history, setHistory] = useState<ExportRecord[]>([]);
  const [toast, setToast] = useState("");

  async function loadHistory() {
    const data = await adminJson<{ history: ExportRecord[] }>("/api/admin/export");
    setHistory(data.history ?? []);
  }

  useEffect(() => {
    loadHistory().catch(() => {});
  }, []);

  async function exportData() {
    const url = `/api/admin/export?track=${track}${year ? `&year=${year}` : ""}`;
    const res = await adminFetch(url);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${track}_${year || "all"}.json`;
    a.click();
    setToast("导出已开始下载");
    loadHistory();
  }

  async function recordOnly() {
    const r = await adminJson<{ count: number; record: ExportRecord }>("/api/admin/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track, year: year ? parseInt(year, 10) : undefined }),
    });
    setToast(`已记录导出 ${r.count} 条`);
    loadHistory();
  }

  return (
    <div>
      <AdminToast msg={toast} type="ok" />
      <div className="flex flex-wrap gap-3 mb-4">
        <select value={track} onChange={(e) => setTrack(e.target.value as "hongkong" | "international")} className="rounded border border-surface-border bg-surface px-3 py-2 text-sm">
          <option value="hongkong">香港开奖</option>
          <option value="international">国际开奖</option>
        </select>
        <input placeholder="年份（可选）" value={year} onChange={(e) => setYear(e.target.value)} className="w-28 rounded border border-surface-border bg-surface px-3 py-2 text-sm" />
        <button type="button" onClick={exportData} className="px-4 py-2 bg-gold text-surface rounded text-sm">
          下载 JSON
        </button>
        <button type="button" onClick={recordOnly} className="px-4 py-2 border border-surface-border rounded text-sm">
          仅记录导出
        </button>
      </div>
      <h3 className="text-sm text-gold mb-2">最近导出</h3>
      <ul className="text-sm space-y-1 text-text-muted">
        {history.map((h, i) => (
          <li key={i}>{h.at.slice(0, 10)} — {h.filename} ({(h.sizeBytes / 1024).toFixed(1)} KB)</li>
        ))}
        {history.length === 0 && <li>暂无记录</li>}
      </ul>
    </div>
  );
}
