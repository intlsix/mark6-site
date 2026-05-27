"use client";

import { useState } from "react";
import type { DrawRecord } from "@/lib/mark6/types";

export default function DrawForm({
  initial,
  onSubmit,
  onCancel,
  track = "hongkong",
}: {
  initial?: DrawRecord;
  onSubmit: (data: DrawRecord) => Promise<void>;
  onCancel: () => void;
  track?: "hongkong" | "international";
}) {
  const [id, setId] = useState(initial?.id ?? "");
  const [drawAt, setDrawAt] = useState(initial?.drawAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [nums, setNums] = useState(initial?.numbers?.join(" ") ?? "");
  const [special, setSpecial] = useState(String(initial?.special ?? ""));
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const numbers = nums.split(/\s+/).map(Number).filter((n) => n >= 1 && n <= 49);
    const sp = parseInt(special, 10);
    if (numbers.length !== 6 || !sp) return;
    setSaving(true);
    await onSubmit({ id, drawAt, numbers, special: sp, source: "manual" });
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-surface-border bg-surface-card p-4 space-y-3 mb-4">
      <h3 className="text-gold font-medium">{initial ? "编辑" : "手动录入"} · {track === "hongkong" ? "香港" : "国际"}</h3>
      <input
        placeholder={track === "hongkong" ? "期号 2026-057" : "期号 INT-019"}
        value={id}
        onChange={(e) => setId(e.target.value)}
        disabled={!!initial}
        className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm"
        required
      />
      <input type="date" value={drawAt} onChange={(e) => setDrawAt(e.target.value)} className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm" />
      <input placeholder="平码（空格分隔 6 个）" value={nums} onChange={(e) => setNums(e.target.value)} className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm" required />
      <input placeholder="特码" value={special} onChange={(e) => setSpecial(e.target.value)} className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm" required />
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-gold text-surface rounded text-sm disabled:opacity-50">
          {saving ? "保存中…" : "保存"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-surface-border rounded text-sm">
          取消
        </button>
      </div>
    </form>
  );
}
