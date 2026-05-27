"use client";

import { useState } from "react";
import { adminJson } from "@/lib/admin/admin-fetch";
import { AdminToast } from "./AdminToast";

export default function ImportDropzone() {
  const [track, setTrack] = useState<"hongkong" | "international">("hongkong");
  const [format, setFormat] = useState<"txt" | "json">("txt");
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<{ newCount: number; skipCount: number; errors: string[] } | null>(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  async function doPreview() {
    setLoading(true);
    try {
      const p = await adminJson<{ newCount: number; skipCount: number; errors: string[] }>("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track, format, text, confirm: false }),
      });
      setPreview(p);
    } catch (e) {
      setToast((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function doConfirm() {
    setLoading(true);
    try {
      const r = await adminJson<{ newCount: number; skipCount: number }>("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track, format, text, confirm: true }),
      });
      setToast(`导入成功：新增 ${r.newCount} 条，跳过 ${r.skipCount} 条`);
      setPreview(null);
      setText("");
    } catch (e) {
      setToast((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function onFile(f: File) {
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result ?? ""));
    reader.readAsText(f);
    if (f.name.endsWith(".json")) setFormat("json");
  }

  return (
    <div>
      <AdminToast msg={toast} type={toast.includes("成功") ? "ok" : "err"} />
      <div className="flex flex-wrap gap-3 mb-4">
        <select value={track} onChange={(e) => setTrack(e.target.value as "hongkong" | "international")} className="rounded border border-surface-border bg-surface px-3 py-2 text-sm">
          <option value="hongkong">香港开奖</option>
          <option value="international">国际开奖</option>
        </select>
        <select value={format} onChange={(e) => setFormat(e.target.value as "txt" | "json")} className="rounded border border-surface-border bg-surface px-3 py-2 text-sm">
          <option value="txt">TXT</option>
          <option value="json">JSON</option>
        </select>
        <input type="file" accept=".json,.csv,.txt" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} className="text-sm" />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="2026-056 11 22 33 44 05 18 + 35"
        className="w-full rounded border border-surface-border bg-surface px-3 py-2 text-sm font-mono"
      />
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={doPreview} disabled={loading || !text} className="px-4 py-2 bg-surface-border rounded text-sm">
          预览
        </button>
        {preview ? (
          <button type="button" onClick={doConfirm} disabled={loading} className="px-4 py-2 bg-gold text-surface rounded text-sm">
            确认导入（新增 {preview.newCount}，跳过 {preview.skipCount}）
          </button>
        ) : (
          <button type="button" disabled className="px-4 py-2 bg-surface-border rounded text-sm text-text-muted cursor-not-allowed" title="请先预览数据">
            确认导入（请先预览）
          </button>
        )}
      </div>
      {preview?.errors?.length ? (
        <ul className="mt-2 text-xs text-red-400">{preview.errors.slice(0, 5).map((e, i) => <li key={i}>{e}</li>)}</ul>
      ) : null}
    </div>
  );
}
