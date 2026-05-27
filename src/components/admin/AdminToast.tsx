"use client";

export function AdminToast({ msg, type }: { msg: string; type?: "ok" | "err" }) {
  if (!msg) return null;
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-2 text-sm shadow-lg ${
        type === "err" ? "bg-red-900 text-red-100" : "bg-emerald-900 text-emerald-100"
      }`}
    >
      {msg}
    </div>
  );
}
