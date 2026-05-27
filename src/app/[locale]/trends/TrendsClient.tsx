"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import NumberBall from "@/components/mark6/NumberBall";
import type { DrawRecord } from "@/lib/mark6/types";

interface Props {
  hkDraws?: DrawRecord[];
  intlDraws?: DrawRecord[];
}

const CURRENT_YEAR = String(new Date().getFullYear());

function filterByYear(draws: DrawRecord[], year: string) {
  return draws.filter((d) => d.id.startsWith(year) || d.drawAt.startsWith(year));
}

function computeFreq(draws: DrawRecord[]) {
  const freq: Record<number, number> = {};
  for (let n = 1; n <= 49; n++) freq[n] = 0;
  for (const d of draws) {
    for (const n of d.numbers) freq[n]++;
    freq[d.special]++;
  }
  return freq;
}

export default function TrendsClient({ hkDraws = [], intlDraws = [] }: Props) {
  const t = useTranslations("trends");
  const [track, setTrack] = useState<"hk" | "intl">("hk");

  // Client will fetch if empty - use embedded data from server via separate API or pass as props
  // For simplicity, fetch on mount
  const [hk, setHk] = useState(hkDraws);
  const [intl, setIntl] = useState(intlDraws);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    fetch("/api/public/draws")
      .then((r) => r.json())
      .then((data: { hk: DrawRecord[]; intl: DrawRecord[] }) => {
        setHk(data.hk);
        setIntl(data.intl);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [loaded]);

  const rawDraws = track === "hk" ? hk : intl;
  const draws = filterByYear(rawDraws, CURRENT_YEAR);
  const freq = computeFreq(draws);
  const chartData = Object.entries(freq)
    .map(([num, count]) => ({ num: parseInt(num, 10), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  const max = Math.max(...Object.values(freq), 1);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-4">{t("title")}</h1>
      <div className="flex gap-2 mb-6">
        <button type="button" onClick={() => setTrack("hk")} className={`px-4 py-2 rounded ${track === "hk" ? "bg-gold text-surface" : "border border-surface-border"}`}>{t("trackHk")}</button>
        <button type="button" onClick={() => setTrack("intl")} className={`px-4 py-2 rounded ${track === "intl" ? "bg-gold text-surface" : "border border-surface-border"}`}>{t("trackIntl")}</button>
      </div>
      <p className="text-text-muted mb-4">{t("draws", { count: draws.length })}</p>
      <h2 className="text-lg text-gold mb-2">{t("freqChart")}</h2>
      <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="num" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#d4af37" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <h2 className="text-lg text-gold mb-2">{t("hotCold")}</h2>
      <p className="text-sm text-text-muted mb-4">{t("hotColdHint")}</p>
      <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
        {Array.from({ length: 49 }, (_, i) => i + 1).map((n) => (
          <div key={n} className="flex flex-col items-center" style={{ opacity: 0.3 + (freq[n] / max) * 0.7 }}>
            <NumberBall n={n} size="sm" />
            <span className="text-xs text-text-muted">{freq[n]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
