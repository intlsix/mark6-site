"use client";

import { useState, useEffect, useRef } from "react";
import NumberBall from "./NumberBall";
import AnimalLabel from "./AnimalLabel";
import { decodeBySuiShuFa } from "@/lib/mark6/suishufa";
import { numToAnimalStd } from "@/lib/mark6/zodiac";
import { numToWave } from "@/lib/mark6/waves";
import { useTranslations } from "next-intl";
import type { Animal } from "@/lib/mark6/types";

interface Props {
  numbers: number[];
  special: number;
  zodiacMode: "fixed" | "age";
  year?: number;
  showWave?: boolean;
  animate?: boolean;
  /** ms between each number reveal */
  interval?: number;
}

function getAnimal(n: number, mode: "fixed" | "age", year: number): Animal {
  return mode === "fixed" ? numToAnimalStd(n) : decodeBySuiShuFa(n, year);
}

export default function DrawBalls({
  numbers,
  special,
  zodiacMode,
  year = new Date().getFullYear(),
  showWave = true,
  animate = false,
  interval = 800,
}: Props) {
  const tw = useTranslations("waves");
  const [revealed, setRevealed] = useState(0);
  const total = numbers.length + 1; // 6 main + 1 special
  const started = useRef(false);

  useEffect(() => {
    if (!animate) {
      setRevealed(total);
      return;
    }
    started.current = true;
    setRevealed(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= total; i++) {
      timers.push(setTimeout(() => setRevealed(i), i * interval));
    }
    return () => timers.forEach(clearTimeout);
  }, [animate, numbers, special, total, interval]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {numbers.map((n, idx) => {
          const show = !animate || idx < revealed;
          return (
            <div
              key={n}
              className={`flex flex-col items-center gap-1 transition-all duration-500 ${
                show
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-75 pointer-events-none"
              }`}
            >
              {show ? (
                <NumberBall n={n} />
              ) : (
                <div className="w-10 h-10 rounded-full bg-surface-border border border-surface-border" />
              )}
              {show && (
                <span className="text-xs text-text-muted">
                  <AnimalLabel animal={getAnimal(n, zodiacMode, year)} />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div
        className={`flex items-center gap-3 transition-all duration-500 ${
          !animate || revealed >= numbers.length + 1
            ? "opacity-100 scale-100"
            : "opacity-0 scale-75 pointer-events-none"
        }`}
      >
        {!animate || revealed >= numbers.length + 1 ? (
          <>
            <NumberBall n={special} size="lg" />
            <div className="text-sm">
              <AnimalLabel animal={getAnimal(special, zodiacMode, year)} />
              {showWave && (
                <span className="ml-2 text-text-muted">
                  {tw(numToWave(special))}
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-surface-border border border-surface-border" />
            <div className="w-20 h-4 rounded bg-surface-border" />
          </>
        )}
      </div>
    </div>
  );
}
