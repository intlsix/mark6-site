"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import NumberBall from "@/components/mark6/NumberBall";
import AnimalLabel from "@/components/mark6/AnimalLabel";
import { decodeBySuiShuFa } from "@/lib/mark6/suishufa";
import { numToWave } from "@/lib/mark6/waves";

interface LiveState {
  numbers: (number | null)[];
  special: number | null;
  broadcasting: boolean;
  updatedAt: string;
}

const YEAR = 2026;

export default function LiveDrawViewer() {
  const tw = useTranslations("waves");
  const [state, setState] = useState<LiveState | null>(null);
  const [visNums, setVisNums] = useState<number[]>([]);
  const [visSpecial, setVisSpecial] = useState<number | null>(null);
  const prevRef = useRef<{ nums: number[]; sp: number | null }>({ nums: [], sp: null });

  // Poll live state
  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch("/api/public/live-draw");
        if (!res.ok) return;
        const data: LiveState = await res.json();
        if (!mounted) return;

        setState(data);

        if (data.broadcasting) {
          // Collect visible numbers (non-null, in order)
          const visible: number[] = [];
          let sp: number | null = null;
          for (const n of data.numbers) {
            if (n !== null) visible.push(n);
          }
          if (data.special !== null) sp = data.special;

          // Detect new numbers
          const prev = prevRef.current;
          const prevStr = JSON.stringify(prev);
          const curStr = JSON.stringify({ nums: visible, sp });

          if (curStr !== prevStr) {
            setVisNums([]);
            setVisSpecial(null);

            // Animate main numbers one by one
            for (let i = 0; i < visible.length; i++) {
              await new Promise((r) => setTimeout(r, 600));
              if (!mounted) return;
              setVisNums(visible.slice(0, i + 1));
            }

            // Then special
            if (sp !== null) {
              await new Promise((r) => setTimeout(r, 700));
              if (!mounted) return;
              setVisSpecial(sp);
            }

            prevRef.current = { nums: visible, sp };
          }
        }
      } catch {
        // ignore network errors
      }
      if (mounted) timer = setTimeout(poll, 1500);
    }

    poll();
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  const hasContent = visNums.length > 0 || visSpecial !== null;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      {!hasContent ? (
        <div className="text-center">
          <p className="text-6xl mb-4">🎰</p>
          <p className="text-text-muted text-lg">等待开奖...</p>
          <p className="text-text-muted/50 text-sm mt-2">
            管理员开始广播后，号码将逐个显示在此处
          </p>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gold mb-2">🎯 现场开奖</h1>
            <p className="text-sm text-text-muted">
              号码逐个弹出中...
            </p>
          </div>

          {/* Main numbers */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Array.from({ length: 6 }).map((_, idx) => {
              const n = visNums[idx] ?? null;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center gap-2 transition-all duration-500 ${
                    n !== null
                      ? "opacity-100 scale-100"
                      : "opacity-20 scale-90"
                  }`}
                >
                  {n !== null ? (
                    <>
                      <NumberBall n={n} size="lg" />
                      <span className="text-xs text-text-muted">
                        <AnimalLabel animal={decodeBySuiShuFa(n, YEAR)} />
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-surface-border/50 border-2 border-dashed border-surface-border" />
                      <div className="w-10 h-3 rounded bg-surface-border/30" />
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Special number */}
          <div
            className={`flex justify-center items-center gap-4 transition-all duration-700 ${
              visSpecial !== null
                ? "opacity-100 scale-100"
                : "opacity-0"
            }`}
          >
            {visSpecial !== null ? (
              <>
                <div className="relative">
                  <NumberBall n={visSpecial} size="xl" />
                  <span className="absolute -top-2 -right-2 bg-gold text-surface text-xs px-1.5 py-0.5 rounded-full font-bold">
                    特
                  </span>
                </div>
                <div>
                  <span className="text-xl font-bold text-gold">
                    <AnimalLabel animal={decodeBySuiShuFa(visSpecial, YEAR)} />
                  </span>
                  <span className="ml-2 text-text-muted text-sm">
                    {tw(numToWave(visSpecial))}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 opacity-40">
                <div className="w-16 h-16 rounded-full bg-surface-border/50 border-2 border-dashed border-surface-border" />
                <div className="w-16 h-4 rounded bg-surface-border/30" />
              </div>
            )}
          </div>

          {/* Live indicator */}
          <div className="mt-8 flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-900/30 text-red-300 text-xs rounded-full">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              LIVE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
