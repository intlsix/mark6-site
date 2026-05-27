"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import DrawBalls from "@/components/mark6/DrawBalls";
import type { DrawRecord } from "@/lib/mark6/types";

interface Props {
  initial: DrawRecord | undefined;
  year: number;
}

export default function HkCardLive({ initial, year: initialYear }: Props) {
  const t = useTranslations("home");
  const [draw, setDraw] = useState<DrawRecord | undefined>(initial);
  const [drawYear, setDrawYear] = useState(initialYear);
  const idRef = useRef(initial?.id);

  useEffect(() => {
    let mounted = true;

    async function poll() {
      try {
        const res = await fetch("/api/public/draws");
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;

        const latest: DrawRecord | undefined = data?.hk?.[0];
        if (!latest) return;

        if (latest.id !== idRef.current) {
          idRef.current = latest.id;
          setDraw(latest);
          setDrawYear(new Date(latest.drawAt).getFullYear());
        }
      } catch {
        // ignore
      }
    }

    const iv = setInterval(poll, 5000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  return (
    <div className="rounded-lg border border-surface-border bg-surface-card p-6">
      <h2 className="text-xl text-gold mb-2">{t("hkCard")}</h2>
      <p className="text-sm text-text-muted mb-4">{t("hkDesc")}</p>
      {draw ? (
        <>
          <p className="text-sm mb-2">{draw.id}</p>
          <DrawBalls numbers={draw.numbers} special={draw.special} zodiacMode="age" year={drawYear} />
        </>
      ) : (
        <p className="text-text-muted text-sm">—</p>
      )}
      <Link href="/results/hongkong" className="inline-block mt-4 text-sm">{t("viewAll")}</Link>
    </div>
  );
}
