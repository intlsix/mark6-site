"use client";

import { useEffect, useState } from "react";
import { adminFetch, adminJson } from "@/lib/admin/admin-fetch";
import { AdminToast } from "@/components/admin/AdminToast";

interface AdminSafe {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function AdminsPanel() {
  const [admins, setAdmins] = useState<AdminSafe[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"super" | "editor">("editor");
  const [toast, setToast] = useState("");

  async function load() {
    setAdmins(await adminJson<AdminSafe[]>("/api/admin/admins"));
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function add() {
    await adminJson("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });
    setToast("已添加管理员");
    setUsername("");
    setPassword("");
    load();
  }

  async function changePwd(target: string) {
    const pwd = prompt("新密码");
    if (!pwd) return;
    await adminJson("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "password", username: target, password: pwd }),
    });
    setToast("密码已更新");
  }

  async function remove(target: string) {
    if (!confirm(`删除 ${target}？`)) return;
    await adminFetch(`/api/admin/admins?username=${encodeURIComponent(target)}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <AdminToast msg={toast} type="ok" />
      <div className="rounded border border-surface-border p-4 mb-6 space-y-2 max-w-md">
        <h3 className="text-gold text-sm">添加管理员</h3>
        <input placeholder="用户名" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm" />
        <input type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm" />
        <select value={role} onChange={(e) => setRole(e.target.value as "super" | "editor")} className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm">
          <option value="super">超级管理员</option>
          <option value="editor">编辑</option>
        </select>
        <button type="button" onClick={add} className="px-4 py-2 bg-gold text-surface rounded text-sm">确认添加</button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-text-muted text-left">
            <th className="py-2">用户名</th>
            <th>角色</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a.id} className="border-t border-surface-border">
              <td className="py-2">{a.username}</td>
              <td>{a.role}</td>
              <td className="space-x-2">
                <button type="button" onClick={() => changePwd(a.username)} className="text-gold text-xs">改密码</button>
                <button type="button" onClick={() => remove(a.username)} className="text-red-400 text-xs">删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
