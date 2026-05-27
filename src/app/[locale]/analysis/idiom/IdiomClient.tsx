"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { decodeIdiom } from "@/lib/mark6/idiom";
import AnimalLabel from "@/components/mark6/AnimalLabel";
import AnimalSvg from "@/components/mark6/AnimalSvg";

export default function IdiomClient() {
  const t = useTranslations("idiom");
  const tPaths = useTranslations("idiomPaths");
  const [input, setInput] = useState("");
  const result = decodeIdiom(input);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-6">{t("pageTitle")}</h1>
      <div className="flex gap-2 mb-6 max-w-md">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("input")} className="flex-1 rounded border border-surface-border bg-surface-card px-3 py-2" />
      </div>
      {result ? (
        <div className="rounded-lg border border-surface-border bg-surface-card p-4">
          <p className="text-sm text-text-muted mb-2">{t("path")}: {tPaths(result.path as "story")}</p>
          <p className="mb-3">{t("pointing")}:</p>
          <div className="flex gap-4">
            {result.animals.map((a) => (
              <div key={a} className="flex flex-col items-center">
                <AnimalSvg animal={a} size={48} />
                <AnimalLabel animal={a} />
              </div>
            ))}
          </div>
        </div>
      ) : input.trim() ? (
        <p className="text-text-muted">{t("noResult")}</p>
      ) : null}
    </div>
  );
}
