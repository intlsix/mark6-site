"use client";

import { useTranslations } from "next-intl";

export default function SiteFooter() {
  const t = useTranslations("legal");
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-surface-border bg-surface-raised mt-12 py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-text-muted space-y-2">
        <p>{t("footerFair")}</p>
        <p>{t("footerCopyright", { year, company: t("companyName") })}</p>
        <p>{t("footerReg", { jurisdiction: t("jurisdiction"), regNumber: t("regNumber") })}</p>
      </div>
    </footer>
  );
}
