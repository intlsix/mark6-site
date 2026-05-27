"use client";

import { useTranslations } from "next-intl";

export default function LegalNotice() {
  const t = useTranslations("legal");
  return (
    <section className="rounded-lg border border-gold/30 bg-surface-card p-6 shadow-gold">
      <h2 className="text-xl font-bold text-gold mb-4">{t("noticeTitle")}</h2>
      <p className="mb-2">{t("operatorLine", { company: t("companyName") })}</p>
      <p className="mb-4 text-text-muted text-sm">
        {t("registeredLine", { jurisdiction: t("jurisdiction"), regNumber: t("regNumber") })}
      </p>
      <h3 className="font-semibold mb-2">{t("complianceTitle")}</h3>
      <ul className="list-disc pl-5 text-sm text-text-muted space-y-1 mb-4">
        <li>{t("law1")}</li>
        <li>{t("law2")}</li>
        <li>{t("law3")}</li>
      </ul>
      <h3 className="font-semibold mb-2">{t("fairTitle")}</h3>
      <ul className="list-disc pl-5 text-sm text-text-muted space-y-1 mb-4">
        <li>{t("fair1")}</li>
        <li>{t("fair2")}</li>
        <li>{t("fair3")}</li>
      </ul>
      <p className="text-sm">{t("ageLimit")}</p>
      <p className="text-sm text-text-muted">{t("responsible")}</p>
    </section>
  );
}
