"use client";

import { useTranslations } from "next-intl";

interface Props {
  titleKey: string;
  whatKey: string;
  howKey: string;
}

export default function UsageGuide({ titleKey, whatKey, howKey }: Props) {
  const t = useTranslations("usage");
  return (
    <aside className="rounded-lg border border-surface-border bg-surface-card/50 p-4 mb-8 text-sm">
      <p className="text-gold font-medium mb-1">{t("label")}</p>
      <h2 className="font-semibold mb-2">{t(titleKey as "homeTitle")}</h2>
      <p className="text-text-muted mb-1">{t(whatKey as "homeWhat")}</p>
      <p className="text-text-muted">{t(howKey as "homeHow")}</p>
    </aside>
  );
}
