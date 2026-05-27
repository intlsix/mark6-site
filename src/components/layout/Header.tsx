"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LangSwitcher from "./LangSwitcher";

const NAV = [
  { key: "home", href: "/" },
  { key: "hongkong", href: "/results/hongkong" },
  { key: "international", href: "/results/international" },
  { key: "trends", href: "/trends" },
  { key: "zodiac", href: "/zodiac" },
  { key: "rules", href: "/rules" },
  { key: "knowledge", href: "/knowledge" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const pathname = usePathname();

  return (
    <header className="border-b border-surface-border bg-surface-raised/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-4 mb-3">
          <Link href="/" className="text-gold font-bold text-lg no-underline hover:text-gold-light">
            {tBrand("logoFull")}
          </Link>
          <LangSwitcher />
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {NAV.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className={`no-underline ${pathname === href ? "text-gold" : "text-text-muted hover:text-gold"}`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
