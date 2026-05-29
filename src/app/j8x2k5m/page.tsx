"use client";

import { useState } from "react";

export default function Page() {
  const [step, setStep] = useState<"auth" | "form" | "done">("auth");
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [period, setPeriod] = useState("");
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const [n3, setN3] = useState("");
  const [n4, setN4] = useState("");
  const [n5, setN5] = useState("");
  const [n6, setN6] = useState("");
  const [special, setSpecial] = useState("");
  const [drawDate, setDrawDate] = useState("");

  async function doAuth() {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/quick-submit/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      if (!r.ok) { setError("安全码错误"); setLoading(false); return; }
      setToken((await r.json()).token);
      setStep("form");
    } catch { setError("网络错误"); }
    setLoading(false);
  }

  async function doSubmit() {
    const nums = [n1, n2, n3, n4, n5, n6].map(Number);
    const s = Number(special);
    if (!period.trim() || nums.some(n => !n || n < 1 || n > 49) || !s || s < 1 || s > 49) {
      setError("号码 1-49，不重复"); return;
    }
    if (new Set([...nums, s]).size !== 7) { setError("号码重复"); return; }
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/quick-submit/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, draw: { id: period.trim(), drawAt: drawDate || new Date().toISOString().slice(0, 10), numbers: nums, special: s } }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "失败"); setLoading(false); return; }
      setStep("done");
    } catch { setError("网络错误"); }
    setLoading(false);
  }

  const inputStyle = "w-full bg-gray-900 border border-gray-700 rounded p-3 text-white text-center text-lg focus:outline-none focus:border-blue-500";
  const numStyle = "w-full bg-gray-900 border border-gray-700 rounded p-3 text-white text-center text-lg focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  if (step === "auth") return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-xs">
        <input type="password" inputMode="numeric" value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => e.key === "Enter" && doAuth()} placeholder="安全码" autoFocus className={inputStyle} />
        {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}
        <button onClick={doAuth} disabled={loading || !code.trim()} className="w-full mt-4 bg-blue-600 text-white py-3 rounded font-medium disabled:opacity-40">验证</button>
      </div>
    </div>
  );

  if (step === "done") return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-green-400 text-lg mb-4">提交成功</p>
        <button onClick={() => { setStep("form"); setPeriod(""); setN1(""); setN2(""); setN3(""); setN4(""); setN5(""); setN6(""); setSpecial(""); setDrawDate(""); setError(""); }} className="bg-blue-600 text-white px-6 py-3 rounded">再录一期</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-xs mx-auto">
        <input type="text" value={period} onChange={e => setPeriod(e.target.value)} placeholder="期号 如 2026-057" autoFocus className={inputStyle + " mb-3"} />
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[n1, n2, n3, n4, n5, n6].map((v, i) => (
            <input key={i} type="number" inputMode="numeric" min={1} max={49} value={v}
              onChange={e => { const a = [setN1, setN2, setN3, setN4, setN5, setN6]; a[i](e.target.value); }}
              placeholder={(i + 1).toString()} className={numStyle} />
          ))}
        </div>
        <input type="number" inputMode="numeric" min={1} max={49} value={special} onChange={e => setSpecial(e.target.value)} placeholder="特码" className={numStyle + " mb-3 border-yellow-600 text-yellow-400 w-20"} />
        <input type="date" value={drawDate} onChange={e => setDrawDate(e.target.value)} className={inputStyle + " mb-4"} />
        {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}
        <button onClick={doSubmit} disabled={loading} className="w-full bg-green-600 text-white py-3 rounded font-medium text-lg disabled:opacity-40">确认录入</button>
      </div>
    </div>
  );
}
