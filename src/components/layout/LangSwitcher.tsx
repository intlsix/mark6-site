"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: "en" | "zh") => {
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="flex gap-1 text-sm">
      <button
        type="button"
        onClick={() => switchTo("en")}
        className={`px-2 py-1 rounded ${locale === "en" ? "bg-gold text-surface" : "text-text-muted hover:text-gold"}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchTo("zh")}
        className={`px-2 py-1 rounded ${locale === "zh" ? "bg-gold text-surface" : "text-text-muted hover:text-gold"}`}
      >
        中文
      </button>
    </div>
  );
}
