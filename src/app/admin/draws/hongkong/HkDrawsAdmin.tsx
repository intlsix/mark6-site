"use client";

import { useEffect, useState } from "react";
import { AdminToast } from "@/components/admin/AdminToast";
import { adminFetch, adminJson } from "@/lib/admin/admin-fetch";
import type { DrawRecord } from "@/lib/mark6/types";

export default function HkDrawsAdmin() {
  const [toast, setToast] = useState("");
  const [draws, setDraws] = useState<DrawRecord[]>([]);

  // Scrape source config
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scrapeSaving, setScrapeSaving] = useState(false);

  // Add/Edit form
  const [editId, setEditId] = useState<string | null>(null);
  const [formId, setFormId] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formNums, setFormNums] = useState<(number | null)[]>([null, null, null, null, null, null]);
  const [formSpecial, setFormSpecial] = useState<number | null>(null);

  // Select for batch delete
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    refresh();
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const s = await adminJson<Record<string, unknown>>("/api/admin/settings");
      if (s && typeof s.hkScrapeUrl === "string") setScrapeUrl(s.hkScrapeUrl);
    } catch { /* ignore */ }
  }

  async function saveScrapeUrl() {
    setScrapeSaving(true);
    try {
      await adminJson("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hkScrapeUrl: scrapeUrl }),
      });
      setToast("采集源已更新");
    } catch {
      setToast("保存失败");
    }
    setScrapeSaving(false);
  }

  async function refresh() {
    setDraws(await adminJson<DrawRecord[]>("/api/admin/hk-draws"));
  }

  function resetForm() {
    setEditId(null);
    setFormId("");
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormNums([null, null, null, null, null, null]);
    setFormSpecial(null);
  }

  function fillForm(d: DrawRecord) {
    setEditId(d.id);
    setFormId(d.id.replace(/^\d{4}-/, ""));
    setFormDate(d.drawAt.slice(0, 10));
    setFormNums(d.numbers.map((n) => n as number | null));
    setFormSpecial(d.special);
  }

  function handleNumChange(i: number, val: string) {
    const n = val === "" ? null : parseInt(val, 10);
    if (n !== null && (isNaN(n) || n < 1 || n > 49)) return;
    const next = [...formNums]; next[i] = n; setFormNums(next);
  }

  async function save() {
    const validNums = formNums.filter((n): n is number => n !== null);
    if (!formId || validNums.length < 6 || formSpecial === null) {
      setToast("请填写完整的期号、6个平码和特码");
      return;
    }
    // Trim whitespace from formId
    const id = formId.trim();
    if (!id) {
      setToast("期号不能为空");
      return;
    }
    const data: DrawRecord = {
      id: `${formDate.slice(0, 4)}-${id}`,
      drawAt: formDate,
      numbers: validNums,
      special: formSpecial,
      source: "manual",
    };
    const method = editId ? "PUT" : "POST";
    await adminJson("/api/admin/hk-draws", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setToast(editId ? "已修改" : "已添加");
    resetForm();
    await refresh();
  }

  async function remove(id: string) {
    if (!confirm("确认删除？")) return;
    await adminFetch(`/api/admin/hk-draws?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setToast("已删除");
    await refresh();
  }

  async function removeSelected() {
    if (selected.size === 0) { setToast("请先勾选要删除的项"); return; }
    if (!confirm(`确定删除选中的 ${selected.size} 条记录？`)) return;
    for (const id of selected) {
      await adminFetch(`/api/admin/hk-draws?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    }
    setSelected(new Set());
    setToast(`已删除 ${selected.size} 条`);
    await refresh();
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected((prev) =>
      prev.size === draws.length ? new Set() : new Set(draws.map((d) => d.id))
    );
  }

  const allSelected = draws.length > 0 && selected.size === draws.length;

  // Sort draws by date descending
  const sorted = [...draws].sort((a, b) => b.drawAt.localeCompare(a.drawAt));

  return (
    <div>
      <AdminToast msg={toast} type={toast.includes("已") ? "ok" : "err"} />

      {/* 采集源配置 */}
      <section className="rounded-lg border border-surface-border bg-surface-card p-5 mb-6">
        <h2 className="text-lg text-gold font-bold mb-3">🔗 自动采集源</h2>
        <p className="text-xs text-text-muted mb-3">香港开奖数据抓取地址。如采集页失效，更换新网址即可。手动录入功能作为备份保留。</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={scrapeUrl}
            onChange={(e) => setScrapeUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 rounded border border-surface-border bg-surface px-3 py-2 text-sm text-text"
          />
          <button
            type="button"
            onClick={saveScrapeUrl}
            disabled={scrapeSaving}
            className="px-4 py-2 bg-gold text-surface rounded text-sm disabled:opacity-50"
          >
            {scrapeSaving ? "保存中..." : "保存"}
          </button>
        </div>
        <p className="text-xs text-text-muted/50 mt-2">
          采集时间：每周二、四、六 21:35（北京时间）· 当前采集源正常时无需修改
        </p>
      </section>

      {/* 录入/修改表单 */}
      <section className="rounded-lg border border-surface-border bg-surface-card p-5 mb-6">
        <h2 className="text-lg text-gold font-bold mb-3">{editId ? "✏️ 修改开奖" : "📝 手动录入开奖"}</h2>
        <p className="text-xs text-text-muted mb-4">香港开奖数据需手动录入。期号格式如 2026-057。</p>

        <div className="flex flex-wrap items-end gap-3 p-3 bg-surface/50 rounded">
          <div>
            <p className="text-xs text-text-muted mb-1">期号</p>
            <input type="text" value={formId} onChange={(e) => setFormId(e.target.value)}
              placeholder=""
              className="rounded border border-surface-border bg-surface px-2 py-1.5 text-sm text-text w-20 text-center" />
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">日期</p>
            <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)}
              className="rounded border border-surface-border bg-surface px-2 py-1.5 text-sm text-text" />
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">平码（6个）</p>
            <div className="flex gap-1">
              {formNums.map((n, i) => (
                <input key={i} type="number" min={1} max={49} placeholder=""
                  value={n ?? ""} onChange={(e) => handleNumChange(i, e.target.value)}
                  className="w-11 h-11 rounded border border-surface-border bg-surface text-center text-sm font-bold text-gold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">特码</p>
            <input type="number" min={1} max={49} placeholder=""
              value={formSpecial ?? ""}
              onChange={(e) => {
                const v = e.target.value === "" ? null : parseInt(e.target.value, 10);
                if (v !== null && (isNaN(v) || v < 1 || v > 49)) return;
                setFormSpecial(v);
              }}
              className="w-11 h-11 rounded border-2 border-gold/40 bg-surface text-center text-sm font-bold text-gold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={save}
              className="px-3 py-2 bg-gold text-surface rounded text-sm">{editId ? "💾 保存修改" : "+ 添加"}</button>
            {editId && (
              <button type="button" onClick={resetForm}
                className="px-3 py-2 border border-surface-border rounded text-sm text-text-muted">取消</button>
            )}
          </div>
        </div>
      </section>

      {/* 开奖记录 */}
      <section className="rounded-lg border border-surface-border bg-surface-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg text-gold font-bold">📋 开奖记录</h2>
          <div className="flex items-center gap-2">
            {draws.length > 0 && (
              <button type="button" onClick={async () => {
                if (!confirm("确定清空所有香港开奖记录？此操作不可撤销！")) return;
                await adminJson("/api/admin/hk-draws", {
                  method: "POST", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "clear_all" }),
                });
                setDraws([]);
                setSelected(new Set());
                setToast("已清空所有开奖记录");
              }}
                className="px-2 py-1 bg-red-900/40 text-red-300 rounded text-xs">清空全部</button>
            )}
            {selected.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">已选 {selected.size} 项</span>
                <button type="button" onClick={removeSelected}
                  className="px-2 py-1 bg-red-900/40 text-red-300 rounded text-xs">删除选中</button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sorted.map((d) => (
            <div key={d.id}
              className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer hover:bg-surface/50 transition-colors ${
                editId === d.id ? "ring-1 ring-gold/40 bg-surface/50" : "bg-surface/20"
              }`}
              onClick={() => fillForm(d)}
            >
              <input type="checkbox" checked={selected.has(d.id)} onChange={() => toggleSelect(d.id)}
                onClick={(e) => e.stopPropagation()} className="accent-gold shrink-0" />
              <span className="text-gold font-medium w-28 shrink-0">{d.id}</span>
              <span className="text-text-muted text-xs w-24 shrink-0">{d.drawAt.slice(0, 10)}</span>
              <div className="flex gap-0.5 flex-1 flex-wrap">
                {d.numbers.map((n, i) => (
                  <span key={i} className="w-7 h-7 rounded-full bg-surface-border flex items-center justify-center text-xs font-bold text-text-muted">
                    {String(n).padStart(2, "0")}
                  </span>
                ))}
              </div>
              <span className="w-7 h-7 rounded-full bg-gold/30 flex items-center justify-center text-xs font-bold text-gold shrink-0">
                {String(d.special).padStart(2, "0")}
              </span>
              <span className="text-xs text-text-muted ml-1">✎</span>
            </div>
          ))}
          {sorted.length === 0 && (
            <p className="text-text-muted text-sm text-center py-4">暂无数据，请手动录入</p>
          )}
        </div>
      </section>
    </div>
  );
}
