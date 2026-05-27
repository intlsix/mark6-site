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

interface Props {
  children: React.ReactNode;
}

const YEAR = 2026;

export default function HomeLiveDrawClient({ children }: Props) {
  const tw = useTranslations("waves");
  const [visNums, setVisNums] = useState<number[]>([]);
  const [visSpecial, setVisSpecial] = useState<number | null>(null);
  const lastSeenRef = useRef<{ nums: number[]; sp: number | null }>({ nums: [], sp: null });

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
          if (lastSeenRef.current.nums.length > 0 || lastSeenRef.current.sp !== null) {
            lastSeenRef.current = { nums: [], sp: null };
          }
          if (mounted) timer = setTimeout(poll, 1500);
          return;
        }

        const newVisible: number[] = data.numbers.filter((n) => n !== null) as number[];
        const newSp = data.special;
        const prev = lastSeenRef.current;

        // Skip if nothing changed
        const prevStr = JSON.stringify(prev);
        const curStr = JSON.stringify({ nums: newVisible, sp: newSp });
        if (prevStr === curStr) {
          if (mounted) timer = setTimeout(poll, 1500);
          return;
        }

        // Find newly added numbers (appended to the right)
        const newNums: number[] = [];
        for (let i = prev.nums.length; i < newVisible.length; i++) {
          newNums.push(newVisible[i]);
        }
        const hasNewSp = newSp !== null && prev.sp === null;

        // Animate new numbers one by one (incremental state update)
        for (let i = 0; i < newNums.length; i++) {
          await new Promise((r) => setTimeout(r, 700));
          if (!mounted) return;
          setVisNums((prevNums) => {
            const next = [...prevNums, newNums[i]];
            // Once we've shown all that the server has, update lastSeenRef in a stable way
            if (i === newNums.length - 1 && !hasNewSp) {
              lastSeenRef.current = { nums: newVisible, sp: newSp };
            }
            return next;
          });
        }

        // Then animate special if newly appeared
        if (hasNewSp) {
          await new Promise((r) => setTimeout(r, 800));
          if (!mounted) return;
          setVisSpecial(newSp);
          lastSeenRef.current = { nums: newVisible, sp: newSp };
        }
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

  const isActive = visNums.length > 0 || visSpecial !== null;

  if (isActive) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-2xl">
          {/* Live indicator */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-300 font-medium uppercase tracking-widest">Live</span>
            </div>
            <h1 className="text-3xl font-bold text-gold">🎯 现场开奖</h1>
          </div>

          {/* Main numbers */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {Array.from({ length: 6 }).map((_, idx) => {
              const n = visNums[idx] ?? null;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center gap-2 transition-all duration-500 ${
                    n !== null ? "opacity-100 scale-100" : "opacity-20 scale-90"
                  }`}
                >
                  {n !== null ? (
                    <>
                      <NumberBall n={n} size="xl" />
                      <span className="text-xs text-text-muted">
                        <AnimalLabel animal={decodeBySuiShuFa(n, YEAR)} />
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-surface-border/40 border-2 border-dashed border-surface-border" />
                      <div className="w-10 h-3 rounded bg-surface-border/20" />
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Special */}
          <div
            className={`flex justify-center items-center gap-4 transition-all duration-700 ${
              visSpecial !== null ? "opacity-100 scale-100" : "opacity-0"
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
            ) : null}
          </div>

          {/* Loading dots when animating new numbers */}
          {((visNums.length > 0 && visNums.length < 6 && visSpecial === null) ||
            (visNums.length === 6 && visSpecial === null)) && (
            <div className="flex justify-center mt-6 gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 bg-gold/60 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Not broadcasting: show server-rendered content
  return <>{children}</>;
}
