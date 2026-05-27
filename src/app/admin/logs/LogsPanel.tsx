"use client";

import { useEffect, useState } from "react";
import { adminJson } from "@/lib/admin/admin-fetch";
import type { AdminLogEntry } from "@/lib/mark6/types";

export default function LogsPanel() {
  const [logs, setLogs] = useState<AdminLogEntry[]>([]);
  const [action, setAction] = useState("all");
  const [day, setDay] = useState("all");

  async function load() {
    const q = new URLSearchParams();
    if (action !== "all") q.set("action", action);
    if (day !== "all") q.set("day", day);
    setLogs(await adminJson<AdminLogEntry[]>(`/api/admin/logs?${q}`));
  }

  useEffect(() => {
    load().catch(() => {});
  }, [action, day]);

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <select value={action} onChange={(e) => setAction(e.target.value)} className="rounded border border-surface-border bg-surface px-3 py-2 text-sm">
          <option value="all">全部操作</option>
          <option value="login">登录</option>
          <option value="hk">香港</option>
          <option value="intl">国际</option>
          <option value="import">导入</option>
        </select>
        <select value={day} onChange={(e) => setDay(e.target.value)} className="rounded border border-surface-border bg-surface px-3 py-2 text-sm">
          <option value="all">全部日期</option>
          <option value="today">今天</option>
        </select>
        <button type="button" onClick={load} className="px-3 py-2 border border-surface-border rounded text-sm">刷新</button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-text-muted text-left">
            <th className="py-2">时间</th>
            <th>操作</th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id} className="border-t border-surface-border">
              <td className="py-2 whitespace-nowrap">{l.at.replace("T", " ").slice(0, 19)}</td>
              <td>{l.action}</td>
              <td className="text-text-muted">{l.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
