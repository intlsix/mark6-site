"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { adminFetch, startAdminSession, stopAdminSession } from "@/lib/admin/admin-fetch";

const NAV = [
  { href: "/admin/dashboard", label: "控制台" },
  { href: "/admin/draws/hongkong", label: "香港开奖" },
  { href: "/admin/draws/international", label: "国际开奖" },
  { href: "/admin/draws/import", label: "批量导入" },
  { href: "/admin/draws/export", label: "数据导出" },
  { href: "/admin/articles", label: "文章管理" },
  { href: "/admin/pages", label: "页面管理" },
  { href: "/admin/seo", label: "SEO管理" },
  { href: "/admin/settings", label: "系统设置" },
  { href: "/admin/admins", label: "管理员" },
  { href: "/admin/backup", label: "数据备份" },
  { href: "/admin/logs", label: "操作日志" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    startAdminSession();
    adminFetch("/api/admin/me")
      .then((r) => {
        if (!r.ok) router.replace("/admin/login");
      })
      .catch(() => router.replace("/admin/login"));
    return () => stopAdminSession();
  }, [router]);

  async function logout() {
    await adminFetch("/api/admin/logout", { method: "POST" });
    stopAdminSession();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-surface text-text">
      <header className="border-b border-surface-border bg-surface-raised px-4 py-3 flex items-center justify-between">
        <span className="text-gold font-bold">Mark6 后台 · 12 模块</span>
        <button type="button" onClick={logout} className="text-sm text-text-muted hover:text-gold">
          退出登录
        </button>
      </header>
      <div className="flex">
        <aside className="w-52 border-r border-surface-border min-h-[calc(100vh-52px)] p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2 rounded text-sm no-underline ${
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-gold/20 text-gold"
                  : "text-text-muted hover:text-gold"
              }`}
            >
              {label}
            </Link>
          ))}
        </aside>
        <main className="flex-1 p-6 max-w-5xl">{children}</main>
      </div>
    </div>
  );
}
