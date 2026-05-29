"use client";

import { useState } from "react";

type Step = "auth" | "form" | "done";

export default function QuickSubmitPage() {
  const [step, setStep] = useState<Step>("auth");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  // Form state
  const [period, setPeriod] = useState("");
  const [nums, setNums] = useState(["", "", "", "", "", ""]);
  const [special, setSpecial] = useState("");
  const [drawDate, setDrawDate] = useState("");
  const [submitted, setSubmitted] = useState("");

  async function handleAuth() {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/quick-submit/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      if (!res.ok) {
        if (res.status === 404) {
          setError("安全码错误");
        } else if (res.status === 429) {
          setError("尝试次数过多，请1小时后再试");
        } else {
          setError("验证失败");
        }
        setLoading(false);
        return;
      }
      const data = await res.json();
      setToken(data.token);
      setStep("form");
    } catch {
      setError("网络错误");
    }
    setLoading(false);
  }

  function updateNum(i: number, v: string) {
    const next = [...nums];
    next[i] = v;
    setNums(next);
  }

  function allNumsValid(): boolean {
    const ns = nums.map(Number);
    const s = Number(special);
    if (!period.trim()) return false;
    if (ns.some((n) => !n || n < 1 || n > 49)) return false;
    if (!s || s < 1 || s > 49) return false;
    if (new Set([...ns, s]).size !== 7) return false;
    return true;
  }

  async function handleSubmit() {
    if (!allNumsValid()) {
      setError("请检查号码：6个平码+1个特码，1-49，不重复");
      return;
    }
    setLoading(true);
    setError("");

    const date = drawDate || guessDate(period);

    try {
      const res = await fetch("/api/quick-submit/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          draw: {
            id: period.trim(),
            drawAt: date,
            numbers: nums.map(Number),
            special: Number(special),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "提交失败");
        setLoading(false);
        return;
      }
      setSubmitted(data.id);
      setStep("done");
    } catch {
      setError("网络错误");
    }
    setLoading(false);
  }

  function guessDate(p: string): string {
    // Try to parse period like "2026-057" → extract year and issue number
    const m = p.match(/^(\d{4})-(\d+)$/);
    if (m) {
      // Rough estimate: each issue ~3.5 days apart
      // This is just a fallback; owner can set exact date
      const issue = parseInt(m[2]);
      const d = new Date(parseInt(m[1]), 0, 1);
      d.setDate(d.getDate() + (issue - 1) * 3.5);
      return d.toISOString().slice(0, 10);
    }
    return new Date().toISOString().slice(0, 10);
  }

  // Auth step
  if (step === "auth") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <h1 className="text-white text-lg font-medium mb-6 text-center">
            安全验证
          </h1>
          <input
            type="password"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            placeholder="输入安全码"
            autoFocus
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-center text-lg focus:outline-none focus:border-blue-500"
          />
          {error && (
            <p className="text-red-400 text-sm text-center mt-3">{error}</p>
          )}
          <button
            onClick={handleAuth}
            disabled={loading || !code.trim()}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-40 active:bg-blue-700"
          >
            {loading ? "验证中..." : "验证"}
          </button>
        </div>
      </div>
    );
  }

  // Done step
  if (step === "done") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-green-400 text-5xl mb-4">&#10003;</div>
          <p className="text-white text-lg mb-1">提交成功</p>
          <p className="text-gray-400 text-sm">{submitted}</p>
          <button
            onClick={() => {
              setStep("form");
              setPeriod("");
              setNums(["", "", "", "", "", ""]);
              setSpecial("");
              setDrawDate("");
              setError("");
              setSubmitted("");
            }}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium active:bg-blue-700"
          >
            再录一期
          </button>
        </div>
      </div>
    );
  }

  // Form step
  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-sm mx-auto">
        <h1 className="text-white text-lg font-medium mb-4">录入香港开奖</h1>

        {/* Period */}
        <label className="text-gray-400 text-xs mb-1 block">期号</label>
        <input
          type="text"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder="2026-057"
          autoFocus
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-center text-lg mb-3 focus:outline-none focus:border-blue-500"
        />

        {/* 6 regular numbers */}
        <label className="text-gray-400 text-xs mb-1 block">平码 6 个</label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {nums.map((n, i) => (
            <input
              key={i}
              type="number"
              inputMode="numeric"
              min={1}
              max={49}
              value={n}
              onChange={(e) => updateNum(i, e.target.value)}
              placeholder={(i + 1).toString()}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-3 text-white text-center text-lg focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          ))}
        </div>

        {/* Special number */}
        <label className="text-gray-400 text-xs mb-1 block">特码</label>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={49}
          value={special}
          onChange={(e) => setSpecial(e.target.value)}
          placeholder="特"
          className="w-20 bg-gray-900 border border-yellow-600 rounded-lg px-4 py-3 text-yellow-400 text-center text-lg mb-3 focus:outline-none focus:border-yellow-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        {/* Draw date */}
        <label className="text-gray-400 text-xs mb-1 block">开奖日期（选填）</label>
        <input
          type="date"
          value={drawDate}
          onChange={(e) => setDrawDate(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-center mb-4 focus:outline-none focus:border-blue-500"
        />

        {error && (
          <p className="text-red-400 text-sm text-center mb-3">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !allNumsValid()}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium text-lg disabled:opacity-40 active:bg-green-700"
        >
          {loading ? "提交中..." : "确认录入"}
        </button>

        <button
          onClick={() => { setStep("auth"); setCode(""); setToken(""); }}
          className="w-full mt-2 text-gray-500 py-2 text-sm"
        >
          返回
        </button>
      </div>
    </div>
  );
}
