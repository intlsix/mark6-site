"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import NumberBall from "@/components/mark6/NumberBall";
import AnimalLabel from "@/components/mark6/AnimalLabel";
import DrawBalls from "@/components/mark6/DrawBalls";
import { decodeBySuiShuFa } from "@/lib/mark6/suishufa";
import { numToWave } from "@/lib/mark6/waves";
import type { DrawRecord } from "@/lib/mark6/types";

interface LiveState {
  numbers: (number | null)[];
  special: number | null;
  broadcasting: boolean;
  updatedAt: string;
}

interface Props {
  fallback: DrawRecord | undefined;
  year: number;
}

const YEAR = 2026;
const DRAW_HOUR_BJ = 21;
const DRAW_MIN_BJ = 30;
const PREPARE_OFFSET = 10; // 21:20
const READY_OFFSET = 2;    // 21:28

type Phase = "normal" | "preparing" | "ready" | "live";

function getBeijingNow(): { h: number; m: number } {
  const now = new Date();
  const bj = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Shanghai" }));
  return { h: bj.getHours(), m: bj.getMinutes() };
}

function calcPhase(): Phase {
  const { h, m } = getBeijingNow();
  const totalMin = h * 60 + m;
  const drawMin = DRAW_HOUR_BJ * 60 + DRAW_MIN_BJ;
  const prepMin = drawMin - PREPARE_OFFSET; // 21:20
  const readyMin = drawMin - READY_OFFSET;   // 21:28

  if (totalMin >= drawMin) return "live";
  if (totalMin >= readyMin) return "ready";
  if (totalMin >= prepMin) return "preparing";
  return "normal";
}

export default function IntlCardLive({ fallback: initialFallback, year: initialYear }: Props) {
  const tw = useTranslations("waves");
  const t = useTranslations("home");
  const [phase, setPhase] = useState<Phase>(calcPhase());
  const [visNums, setVisNums] = useState<number[]>([]);
  const [visSpecial, setVisSpecial] = useState<number | null>(null);
  const lastSeenRef = useRef<{ nums: number[]; sp: number | null }>({ nums: [], sp: null });
  const [isLive, setIsLive] = useState(false);
  const isLiveRef = useRef(false);
  const [latestDraw, setLatestDraw] = useState<DrawRecord | undefined>(initialFallback);
  const [latestYear, setLatestYear] = useState(initialYear);

  // Time checker — runs every 30s to update phase
  useEffect(() => {
    function tick() {
      setPhase(calcPhase());
    }
    const iv = setInterval(tick, 30000);
    return () => clearInterval(iv);
  }, []);

  // Live draw poller
  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch("/api/public/live-draw");
        if (!res.ok) return;
        const data: LiveState = await res.json();
        if (!mounted) return;

        if (!data.broadcasting) {
          if (isLiveRef.current) {
            isLiveRef.current = false;
            setIsLive(false);
            fetch("/api/public/latest-intl-draw")
              .then((r) => r.ok ? r.json() : null)
              .then((d) => {
                if (d && mounted) {
                  setLatestDraw(d);
                  setLatestYear(new Date(d.drawAt).getFullYear());
                }
              })
              .catch(() => {});
          }
          lastSeenRef.current = { nums: [], sp: null };
          setVisNums([]);
          setVisSpecial(null);
          if (mounted) timer = setTimeout(poll, 2000);
          return;
        }

        if (!isLiveRef.current) {
          isLiveRef.current = true;
          setIsLive(true);
          setPhase("live");
        }
        const newVisible: number[] = data.numbers.filter((n) => n !== null) as number[];
        const newSp = data.special;
        const prev = lastSeenRef.current;

        const prevStr = JSON.stringify(prev);
        const curStr = JSON.stringify({ nums: newVisible, sp: newSp });
        if (prevStr === curStr) {
          if (mounted) timer = setTimeout(poll, 1500);
          return;
        }

        const newNums: number[] = [];
        for (let i = prev.nums.length; i < newVisible.length; i++) {
          newNums.push(newVisible[i]);
        }
        const hasNewSp = newSp !== null && prev.sp === null;

        for (let i = 0; i < newNums.length; i++) {
          await new Promise((r) => setTimeout(r, 700));
          if (!mounted) return;
          setVisNums((prevNums) => [...prevNums, newNums[i]]);
        }

        if (hasNewSp) {
          await new Promise((r) => setTimeout(r, 800));
          if (!mounted) return;
          setVisSpecial(newSp);
        }

        lastSeenRef.current = { nums: newVisible, sp: newSp };
      } catch {
        // ignore
      }
      if (mounted) timer = setTimeout(poll, 1500);
    }

    poll();
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [tw]);

  // --- Rendering ---

  if (isLive) {
    return (
      <div className="rounded-lg border border-gold/40 bg-surface-card p-6 ring-1 ring-gold/20">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl text-gold">{t("intlCard")}</h2>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-900/40 text-red-300 text-xs rounded-full">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            LIVE
          </span>
        </div>
        <p className="text-sm text-text-muted mb-4">{t("intlDesc")}</p>
        <div className="flex flex-wrap gap-3 mb-4">
          {Array.from({ length: 6 }).map((_, idx) => {
            const n = visNums[idx] ?? null;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                {n !== null ? (
                  <NumberBall n={n} />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-surface-border/40 border-2 border-dashed border-surface-border" />
                )}
                {n !== null && (
                  <span className="text-xs text-text-muted">
                    <AnimalLabel animal={decodeBySuiShuFa(n, YEAR)} />
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mb-3">
          {visSpecial !== null ? (
            <>
              <NumberBall n={visSpecial} size="lg" />
              <span className="text-sm"><AnimalLabel animal={decodeBySuiShuFa(visSpecial, YEAR)} /></span>
              <span className="text-xs text-text-muted">{tw(numToWave(visSpecial))}</span>
            </>
          ) : (
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-12 h-12 rounded-full bg-surface-border/40 border-2 border-dashed border-surface-border" />
              <span className="text-sm text-text-muted">—</span>
            </div>
          )}
        </div>
        <Link href="/results/international" className="inline-block mt-1 text-sm">{t("viewAll")}</Link>
      </div>
    );
  }

  // Preparing / Ready state
  if (phase === "preparing" || phase === "ready") {
    const chars = phase === "preparing"
      ? ["国", "际", "开", "奖", "准", "备", "中"]
      : ["国", "际", "开", "奖", "就", "绪", "中"];
    return (
      <div className="rounded-lg border border-gold/20 bg-surface-card p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl text-gold">{t("intlCard")}</h2>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold/20 text-gold-dim text-xs rounded-full">
            <span className={`w-1.5 h-1.5 rounded-full ${phase === "ready" ? "bg-gold animate-pulse" : "bg-gold/60"}`} />
            {phase === "ready" ? "即将开奖" : "准备中"}
          </span>
        </div>
        <p className="text-sm text-text-muted mb-4">{t("intlDesc")}</p>
        <div className="flex flex-wrap gap-3 mb-4 justify-center">
          {chars.map((ch, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div className={`w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center ${
                phase === "ready"
                  ? "bg-gold/15 border-gold/40"
                  : "bg-surface-border/30 border-surface-border/50"
              }`}>
                <span className={`text-sm font-medium ${
                  phase === "ready" ? "text-gold" : "text-text-muted/50"
                }`}>{ch}</span>
              </div>
            </div>
          ))}
        </div>
        <Link href="/results/international" className="inline-block mt-1 text-sm">{t("viewAll")}</Link>
      </div>
    );
  }

  // Normal: show latest draw
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card p-6">
      <h2 className="text-xl text-gold mb-2">{t("intlCard")}</h2>
      <p className="text-sm text-text-muted mb-4">{t("intlDesc")}</p>
      {latestDraw ? (
        <>
          <p className="text-sm mb-2">{latestDraw.id}</p>
          <DrawBalls
            numbers={latestDraw.numbers}
            special={latestDraw.special}
            zodiacMode="age"
            year={latestYear}
          />
        </>
      ) : (
        <p className="text-text-muted text-sm">—</p>
      )}
      <Link href="/results/international" className="inline-block mt-4 text-sm">{t("viewAll")}</Link>
    </div>
  );
}
