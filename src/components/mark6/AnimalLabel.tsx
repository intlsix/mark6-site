"use client";

import { useTranslations } from "next-intl";
import type { Animal } from "@/lib/mark6/types";

export default function AnimalLabel({ animal }: { animal: Animal }) {
  const t = useTranslations("animals");
  return <span>{t(animal)}</span>;
}
