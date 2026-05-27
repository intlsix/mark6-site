"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { startAdminSession } from "@/lib/admin/admin-fetch";

export default function LoginForm() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const reason = params.get("reason");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, remember }),
        credentials: "include",
      });
      let data: { error?: string; ok?: boolean };
      try {
        data = await res.json();
      } catch {
        const text = await res.text().catch(() => "");
        throw new Error(text.slice(0, 200) || `HTTP ${res.status}`);
      }
      if (!res.ok) throw new Error(data.error ?? "登录失败");
      startAdminSession();
      router.push("/admin/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-surface-border bg-surface-card p-8 space-y-4">
      <h1 className="text-xl text-gold font-bold text-center">管理员登录</h1>
      {reason === "idle" && <p className="text-amber-400 text-xs text-center">30 分钟无操作，已自动登出</p>}
      {reason === "expired" && <p className="text-amber-400 text-xs text-center">会话已过期，请重新登录</p>}
      <div>
        <label className="text-xs text-text-muted">用户名</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full rounded border border-surface-border bg-surface px-3 py-2 text-text"
          autoComplete="username"
        />
      </div>
      <div>
        <label className="text-xs text-text-muted">密码</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded border border-surface-border bg-surface px-3 py-2 text-text"
          autoComplete="current-password"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-text-muted">
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
        记住我（延长 refresh token）
      </label>
      <p className="text-xs text-text-muted">JWT 8 小时 · 操作中自动刷新 · 30 分钟无操作登出</p>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="w-full py-2 bg-gold text-surface rounded font-medium disabled:opacity-50">
        {loading ? "登录中…" : "登录"}
      </button>
    </form>
  );
}
