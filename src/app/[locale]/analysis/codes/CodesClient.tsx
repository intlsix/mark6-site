"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { analyzeHiddenCodes } from "@/lib/mark6/codes";
import NumberBall from "@/components/mark6/NumberBall";
import AnimalLabel from "@/components/mark6/AnimalLabel";

export default function CodesClient() {
  const t = useTranslations("codes");
  const [input, setInput] = useState("1 13 25 37");
  const [year, setYear] = useState(new Date().getFullYear());
  const codes = input.split(/\s+/).map((s) => parseInt(s, 10)).filter((n) => n >= 1 && n <= 49);
  const result = codes.length === 4 ? analyzeHiddenCodes(codes, year) : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-6">{t("pageTitle")}</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("input")} className="rounded border border-surface-border bg-surface-card px-3 py-2 min-w-[200px]" />
        <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10))} className="w-24 rounded border border-surface-border bg-surface-card px-3 py-2" />
      </div>
      {result && (
        <div className="space-y-4">
          <p>{t("taiSui")}: <AnimalLabel animal={result.taiSui} /></p>
          <div>
            <p className="text-gold mb-2">{t("mapping")}</p>
            {result.mapped.map(({ n, animal }) => (
              <div key={n} className="flex items-center gap-2 mb-1">
                <NumberBall n={n} size="sm" />
                <AnimalLabel animal={animal} />
              </div>
            ))}
          </div>
          <div>
            <p className="text-gold mb-2">{t("ranking")}</p>
            <ul className="text-sm space-y-1">
              {result.ranking.map(({ animal, score }) => (
                <li key={animal}><AnimalLabel animal={animal} />: {score.toFixed(1)}</li>
              ))}
            </ul>
          </div>
          <p>{t("topPick")}: <AnimalLabel animal={result.topPick} /></p>
          <div className="flex flex-wrap gap-1">
            {result.numbers.map((n) => <NumberBall key={n} n={n} size="sm" />)}
          </div>
        </div>
      )}
    </div>
  );
}
