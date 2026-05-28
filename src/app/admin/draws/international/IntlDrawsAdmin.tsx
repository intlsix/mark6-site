"use client";

import { useEffect, useState } from "react";
import { AdminToast } from "@/components/admin/AdminToast";
import { adminJson } from "@/lib/admin/admin-fetch";
import type { DrawRecord } from "@/lib/mark6/types";

interface ScheduledDraw {
  date: string;
  numbers: (number | null)[];
  special: number | null;
}

interface ScheduleSettings {
  nextPeriod?: string;
}

export default function IntlDrawsAdmin() {
  const [toast, setToast] = useState("");
  const [draws, setDraws] = useState<DrawRecord[]>([]);

  // Settings
  const [scheduled, setScheduled] = useState<ScheduledDraw[]>([]);
  const [nextPeriod, setNextPeriod] = useState("");

  // Add/Edit form
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [formDate, setFormDate] = useState("");
  const [formNums, setFormNums] = useState<(number | null)[]>([null, null, null, null, null, null]);
  const [formSpecial, setFormSpecial] = useState<number | null>(null);

  // Select for batch delete
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // Load data
  useEffect(() => {
    loadScheduled();
    refreshDraws();
  }, []);

  async function refreshDraws() {
    try {
      const data = await adminJson<{ draws: DrawRecord[] }>("/api/admin/intl-draws");
      setDraws(data.draws ?? []);
    } catch {}
  }

  async function loadScheduled() {
    try {
      const data = await adminJson<{ draws: ScheduledDraw[]; settings: ScheduleSettings }>("/api/admin/intl-draws/scheduled");
      setScheduled(data.draws ?? []);
      setNextPeriod(data.settings?.nextPeriod ?? "");
    } catch {}
  }

  async function savePeriod() {
    await adminJson("/api/admin/intl-draws/scheduled", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_settings", settings: { nextPeriod } }),
    });
    setToast("期号已保存");
  }

  // --- Form helpers ---

  function resetForm() {
    setEditIdx(null);
    setFormDate("");
    setFormNums([null, null, null, null, null, null]);
    setFormSpecial(null);
  }

  function fillForm(idx: number) {
    const s = scheduled[idx];
    setEditIdx(idx);
    setFormDate(s.date);
    setFormNums([...s.numbers]);
    setFormSpecial(s.special);
  }

  function handleNumChange(i: number, val: string) {
    const n = val === "" ? null : parseInt(val, 10);
    if (n !== null && (isNaN(n) || n < 1 || n > 49)) return;
    const next = [...formNums]; next[i] = n; setFormNums(next);
  }

  // --- CRUD (auto-save on every change) ---

  async function persist(newDraws: ScheduledDraw[]) {
    await adminJson("/api/admin/intl-draws/scheduled", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_draws", draws: newDraws }),
    });
  }

  async function upsertRow() {
    // 日期留空：基于已有预置的最后日期+1天
    let date = formDate;
    if (!date) {
      const lastDate = scheduled.length > 0 ? scheduled[scheduled.length - 1].date : "";
      if (lastDate) {
        const d = new Date(lastDate);
        d.setDate(d.getDate() + 1);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        date = `${y}-${m}-${day}`;
      } else {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        date = `${y}-${m}-${day}`;
      }
    }
    const validNums = formNums.filter((n) => n !== null);
    if (validNums.length < 6 || formSpecial === null) {
      setToast("请填写完整的6个平码+特码");
      return;
    }
    const entry: ScheduledDraw = { date, numbers: [...formNums], special: formSpecial };

    let newDraws: ScheduledDraw[];
    if (editIdx !== null) {
      newDraws = [...scheduled];
      newDraws[editIdx] = entry;
    } else {
      newDraws = [...scheduled, entry];
    }
    setScheduled(newDraws);
    resetForm();

    await persist(newDraws);
    setToast(date ? `已${editIdx !== null ? "修改" : "添加"} ${date}（自动保存）` : "");
  }

  async function removeSelected() {
    if (selected.size === 0) { setToast("请先勾选要删除的项"); return; }
    const newDraws = scheduled.filter((_, i) => !selected.has(i));
    setScheduled(newDraws);
    setSelected(new Set());
    if (editIdx !== null && selected.has(editIdx)) resetForm();

    await persist(newDraws);
    setToast(`已删除 ${selected.size} 项（自动保存）`);
  }

  function toggleSelect(idx: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected((prev) => prev.size === scheduled.length ? new Set() : new Set(scheduled.keys()));
  }

  const allSelected = scheduled.length > 0 && selected.size === scheduled.length;

  return (
    <div>
      <AdminToast msg={toast} type={toast.includes("🎉") || toast.includes("已") ? "ok" : "err"} />

      {/* 期号设置 */}
      <section className="rounded-lg border border-surface-border bg-surface-card p-5 mb-6">
        <h2 className="text-lg text-gold font-bold mb-3">🔢 期号设置</h2>
        <p className="text-xs text-text-muted mb-4">留空则按日期自动生成（INT-20260526），每天一期。填了则按手动值。</p>
        <div className="flex items-center gap-3">
          <label className="text-sm text-text-muted whitespace-nowrap">下一期号：</label>
          <input type="text" value={nextPeriod} onChange={(e) => setNextPeriod(e.target.value)}
            placeholder="留空自动按日期生成"
            className="flex-1 rounded border border-surface-border bg-surface px-3 py-1.5 text-sm text-text" />
          <button type="button" onClick={savePeriod}
            className="px-3 py-1.5 bg-gold text-surface rounded text-sm">保存</button>
        </div>
      </section>

      {/* 预置开奖 */}
      <section className="rounded-lg border border-surface-border bg-surface-card p-5 mb-6">
        <h2 className="text-lg text-gold font-bold mb-3">📅 预置开奖号码</h2>
        <p className="text-xs text-text-muted mb-4">提前设置未来多期的号码。日期留空则自动按顺序填入。已添加的项可修改或批量删除。</p>

        {/* 添加/修改表单 */}
        <div className="flex flex-wrap items-end gap-3 mb-4 p-3 bg-surface/50 rounded">
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
            <button type="button" onClick={upsertRow}
              className="px-3 py-2 bg-gold text-surface rounded text-sm">{editIdx !== null ? "💾 保存修改" : "+ 添加"}</button>
            {editIdx !== null && (
              <button type="button" onClick={resetForm}
                className="px-3 py-2 border border-surface-border rounded text-sm text-text-muted">取消</button>
            )}
          </div>
        </div>

        {/* 已添加列表 */}
        {scheduled.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-4">暂无预置开奖</p>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <label className="flex items-center gap-1.5 text-sm text-text-muted cursor-pointer">
                <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="accent-gold" />
                全选
              </label>
              {selected.size > 0 && (
                <span className="text-xs text-text-muted">已选 {selected.size} 项</span>
              )}
              <button type="button" onClick={removeSelected}
                className="ml-auto px-2 py-1 bg-red-900/40 text-red-300 rounded text-xs">删除选中</button>
            </div>
            <div className="space-y-1.5 max-h-80 overflow-y-auto">
              {scheduled.map((s, idx) => (
                <div key={idx}
                  className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer hover:bg-surface/50 transition-colors ${
                    editIdx === idx ? "ring-1 ring-gold/40 bg-surface/50" : "bg-surface/20"
                  }`}
                  onClick={() => fillForm(idx)}
                >
                  <input type="checkbox" checked={selected.has(idx)} onChange={() => toggleSelect(idx)}
                    onClick={(e) => e.stopPropagation()} className="accent-gold shrink-0" />
                  <span className="text-gold font-medium w-24 shrink-0">{s.date}</span>
                  <div className="flex gap-0.5 flex-1 flex-wrap">
                    {s.numbers.map((n, i) => (
                      <span key={i}
                        className="w-7 h-7 rounded-full bg-surface-border flex items-center justify-center text-xs font-bold text-text-muted">
                        {n !== null ? String(n).padStart(2, "0") : "?"}
                      </span>
                    ))}
                  </div>
                  <span className="w-7 h-7 rounded-full bg-gold/30 flex items-center justify-center text-xs font-bold text-gold shrink-0">
                    {s.special !== null ? String(s.special).padStart(2, "0") : "?"}
                  </span>
                  <span className="text-xs text-text-muted ml-1">✎</span>
                </div>
              ))}
            </div>
          </>
        )}

        {scheduled.length > 0 && (
          <p className="mt-3 text-xs text-text-muted/50">每次添加/修改/删除自动保存</p>
        )}
      </section>

      {/* 开奖记录 */}
      <section className="rounded-lg border border-surface-border bg-surface-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg text-gold font-bold">📋 开奖记录</h2>
          {draws.length > 0 && (
            <button type="button" onClick={async () => {
              if (!confirm("确定清空所有国际开奖记录？此操作不可撤销！")) return;
              await adminJson("/api/admin/intl-draws", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "clear_all" }),
              });
              setDraws([]);
              setToast("已清空所有开奖记录");
            }}
              className="px-2 py-1 bg-red-900/40 text-red-300 rounded text-xs">清空全部</button>
          )}
        </div>
        <p className="text-xs text-text-muted mb-4">自动开奖：每天 UTC 13:30（北京 21:30）</p>
        <ul className="space-y-1 text-sm max-h-60 overflow-y-auto">
          {draws.slice(0, 10).map((d) => (
            <li key={d.id} className="rounded border border-surface-border p-2 flex gap-2 items-center">
              <span className="text-gold font-medium">{d.id}</span>
              <span className="text-text-muted text-xs">{d.drawAt.slice(0, 10)}</span>
              <span className="flex-1">{d.numbers.join(" ")}</span>
              <span className="text-gold-dim">+ {d.special}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

