"use client";

import { useTranslations } from "next-intl";
import { SANHE_GROUPS } from "@/lib/mark6/constants";
import AnimalSvg from "./AnimalSvg";
import AnimalLabel from "./AnimalLabel";

const LABEL_KEYS: Record<string, string> = {
  water: "water",
  wood: "wood",
  fire: "fire",
  metal: "metal",
};

export default function SanheTriangle() {
  const t = useTranslations("zodiac");

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {SANHE_GROUPS.map((group) => (
        <div key={group.label} className="rounded-lg border border-surface-border bg-surface-card p-4">
          <h3 className="text-gold mb-4 text-center">{t(LABEL_KEYS[group.label] as "water")}</h3>
          <div className="flex justify-center items-center gap-6">
            {group.animals.map((animal) => (
              <div key={animal} className="flex flex-col items-center">
                <AnimalSvg animal={animal} size={56} />
                <AnimalLabel animal={animal} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
