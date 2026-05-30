"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = pathname.startsWith("/en") ? "en" : "zh";
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, locale, referrer: document.referrer || "direct" }),
    }).catch(() => {
      // Silent fail — analytics should never break the page
    });
  }, [pathname]);

  return null;
}
