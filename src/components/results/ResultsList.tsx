"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import DrawBalls from "@/components/mark6/DrawBalls";
import type { DrawRecord } from "@/lib/mark6/types";

interface Props {
  draws: DrawRecord[];
  mode: "hk" | "intl";
  locale: string;
}

export default function ResultsList({ draws, mode, locale }: Props) {
  const t = useTranslations("results");
  const [limit, setLimit] = useState(10);
  const [year, setYear] = useState<string>("all");

  // Get available years from draws
  const years = useMemo(() => {
    const y = new Set<number>();
    draws.forEach((d) => y.add(new Date(d.drawAt).getFullYear()));
    return Array.from(y).sort((a, b) => b - a);
  }, [draws]);

  // Filter draws
  const filtered = useMemo(() => {
    let list = [...draws];
    if (year !== "all") {
      list = list.filter((d) => new Date(d.drawAt).getFullYear() === Number(year));
    }
    if (limit > 0) list = list.slice(0, limit);
    return list;
  }, [draws, limit, year]);

  const showYearPicker = limit === 0;

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <label className="text-sm text-text-muted">{t("showLabel")}</label>
        <select
          value={limit}
          onChange={(e) => {
            const v = Number(e.target.value);
            setLimit(v);
            if (v !== 0) setYear("all");
          }}
          className="bg-surface-card border border-surface-border rounded px-3 py-1.5 text-sm text-text"
        >
          <option value={10}>10 {t("periods")}</option>
          <option value={50}>50 {t("periods")}</option>
          <option value={100}>100 {t("periods")}</option>
          <option value={-1}>{t("all")}</option>
          <option value={0}>{t("byYear")}</option>
        </select>

        {showYearPicker && years.length > 0 && (
          <>
            <label className="text-sm text-text-muted">{t("yearLabel")}</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-surface-card border border-surface-border rounded px-3 py-1.5 text-sm text-text"
            >
              <option value="all">{t("allYears")}</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}{t("yearSuffix")}</option>
              ))}
            </select>
          </>
        )}

        <span className="text-sm text-text-muted ml-auto">
          {t("count", { count: draws.length })}
        </span>
      </div>

      {/* Draw list */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-surface-border bg-surface-card p-8 text-center">
          {mode === "hk" ? (
            <>
              <h2 className="text-lg text-gold mb-2">{t("hkEmptyTitle")}</h2>
              <p className="text-text-muted text-sm">{t("hkEmptyBody")}</p>
            </>
          ) : (
            <>
              <h2 className="text-lg text-gold mb-2">{t("intlPendingTitle")}</h2>
              <p className="text-text-muted text-sm">{t("intlPendingBody")}</p>
            </>
          )}
        </div>
      ) : (
        <ul className="space-y-4">
          {filtered.map((d) => {
            const drawYear = new Date(d.drawAt).getFullYear();
            const pending = !d.numbers?.length;
            const linkPath = mode === "hk"
              ? `/results/hongkong/${d.id}`
              : `/results/international/${d.id}`;

            return (
              <li key={d.id} className="rounded-lg border border-surface-border bg-surface-card p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <Link href={linkPath} className="font-medium text-gold">{d.id}</Link>
                  </div>
                  <Link href={linkPath} className="text-sm">{t("viewDetail")}</Link>
                </div>
                {pending ? (
                  <p className="text-text-muted text-sm">{t("intlPendingTitle")}</p>
                ) : (
                  <DrawBalls
                    numbers={d.numbers}
                    special={d.special}
                    zodiacMode="age"
                    year={drawYear}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
