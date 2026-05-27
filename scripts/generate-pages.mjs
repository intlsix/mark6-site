import fs from "fs";
import path from "path";

const ROOT = path.join("C:\\Users\\Win-Hermes\\mark6-site\\src");

function w(rel, content) {
  const fp = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content.replace(/\r?\n/g, "\n"), "utf8");
}

// Locale layout
w("app/[locale]/layout.tsx", `import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import SiteFooter from "@/components/layout/SiteFooter";
import LegalNotice from "@/components/layout/LegalNotice";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "zh")) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <div className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
            {children}
            <div className="mt-12">
              <LegalNotice />
            </div>
          </div>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
`);

w("app/[locale]/page.tsx", `import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import UsageGuide from "@/components/layout/UsageGuide";
import DrawBalls from "@/components/mark6/DrawBalls";
import { getHongKongDraws } from "@/lib/draw/hongkong";
import { getInternationalDraws } from "@/lib/draw/international";
import { getPublishedArticles } from "@/lib/admin/articles";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const hk = getHongKongDraws()[0];
  const intl = getInternationalDraws()[0];
  const articles = getPublishedArticles().slice(0, 3);

  return (
    <div>
      <UsageGuide titleKey="homeTitle" whatKey="homeWhat" howKey="homeHow" />
      <h1 className="text-3xl font-bold text-gold mb-2">{t("title")}</h1>
      <p className="text-text-muted mb-8">{t("subtitle")}</p>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="rounded-lg border border-surface-border bg-surface-card p-6">
          <h2 className="text-xl text-gold mb-2">{t("hkCard")}</h2>
          <p className="text-sm text-text-muted mb-4">{t("hkDesc")}</p>
          {hk ? (
            <>
              <p className="text-sm mb-2">{hk.id}</p>
              <DrawBalls numbers={hk.numbers} special={hk.special} zodiacMode="fixed" />
            </>
          ) : (
            <p className="text-text-muted text-sm">—</p>
          )}
          <Link href="/results/hongkong" className="inline-block mt-4 text-sm">{t("viewAll")}</Link>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface-card p-6">
          <h2 className="text-xl text-gold mb-2">{t("intlCard")}</h2>
          <p className="text-sm text-text-muted mb-4">{t("intlDesc")}</p>
          {intl ? (
            <>
              <p className="text-sm mb-2">{intl.id}</p>
              <DrawBalls
                numbers={intl.numbers}
                special={intl.special}
                zodiacMode="age"
                year={new Date(intl.drawAt).getFullYear()}
              />
            </>
          ) : (
            <p className="text-text-muted text-sm">—</p>
          )}
          <Link href="/results/international" className="inline-block mt-4 text-sm">{t("viewAll")}</Link>
        </div>
      </div>

      {articles.length > 0 && (
        <section>
          <h2 className="text-xl text-gold mb-4">{t("featured")}</h2>
          <ul className="space-y-2">
            {articles.map((a) => (
              <li key={a.id}>
                <Link href="/knowledge">{locale === "zh" ? a.titleZh : a.titleEn}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
`);

// HK Results
w("app/[locale]/results/hongkong/page.tsx", `import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import UsageGuide from "@/components/layout/UsageGuide";
import DrawBalls from "@/components/mark6/DrawBalls";
import { getHongKongDraws } from "@/lib/draw/hongkong";

export default async function HongKongListPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("results");
  const draws = getHongKongDraws();

  return (
    <div>
      <UsageGuide titleKey="hkListTitle" whatKey="hkListWhat" howKey="hkListHow" />
      <h1 className="text-2xl font-bold text-gold mb-2">{t("hkTitle")}</h1>
      <p className="text-text-muted mb-6">{t("count", { count: draws.length })}</p>
      {draws.length === 0 ? (
        <div className="rounded-lg border border-surface-border bg-surface-card p-8 text-center">
          <h2 className="text-lg text-gold mb-2">{t("hkEmptyTitle")}</h2>
          <p className="text-text-muted text-sm">{t("hkEmptyBody")}</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {draws.map((d) => (
            <li key={d.id} className="rounded-lg border border-surface-border bg-surface-card p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Link href={\`/results/hongkong/\${d.id}\`} className="font-medium text-gold">{d.id}</Link>
                  <p className="text-sm text-text-muted">{new Date(d.drawAt).toLocaleDateString(locale)}</p>
                </div>
                <Link href={\`/results/hongkong/\${d.id}\`} className="text-sm">{t("viewDetail")}</Link>
              </div>
              <DrawBalls numbers={d.numbers} special={d.special} zodiacMode="fixed" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
`);

w("app/[locale]/results/hongkong/[id]/page.tsx", `import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import UsageGuide from "@/components/layout/UsageGuide";
import DrawBalls from "@/components/mark6/DrawBalls";
import { getHongKongDraw } from "@/lib/draw/hongkong";

export default async function HongKongDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("results");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");
  const draw = getHongKongDraw(id);
  if (!draw) notFound();

  return (
    <div>
      <Breadcrumb items={[
        { label: tCommon("breadcrumbHome"), href: "/" },
        { label: tNav("hongkong"), href: "/results/hongkong" },
        { label: draw.id },
      ]} />
      <UsageGuide titleKey="hkDetailTitle" whatKey="hkDetailWhat" howKey="hkDetailHow" />
      <h1 className="text-2xl font-bold text-gold mb-2">{draw.id}</h1>
      <p className="text-text-muted mb-6">{new Date(draw.drawAt).toLocaleString(locale)}</p>
      <h2 className="text-lg mb-2">{t("drawNumbers")}</h2>
      <DrawBalls numbers={draw.numbers} special={draw.special} zodiacMode="fixed" />
      <div className="mt-8 flex gap-4 text-sm">
        <Link href="/analysis/idiom">{t("toIdiom")}</Link>
        <Link href="/analysis/codes">{t("toCodes")}</Link>
        <Link href="/trends">{t("toTrends")}</Link>
      </div>
      <Link href="/results/hongkong" className="inline-block mt-6 text-sm">{t("backHk")}</Link>
    </div>
  );
}
`);

// International Results
w("app/[locale]/results/international/page.tsx", `import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import UsageGuide from "@/components/layout/UsageGuide";
import DrawBalls from "@/components/mark6/DrawBalls";
import { getInternationalDraws } from "@/lib/draw/international";

export const dynamic = "force-dynamic";

export default async function InternationalListPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("results");
  const draws = getInternationalDraws();

  return (
    <div>
      <UsageGuide titleKey="intlListTitle" whatKey="intlListWhat" howKey="intlListHow" />
      <h1 className="text-2xl font-bold text-gold mb-2">{t("intlTitle")}</h1>
      <p className="text-sm text-gold-dim mb-2">{t("intlAutoLabel")}</p>
      <p className="text-text-muted mb-6">{t("count", { count: draws.length })}</p>
      <ul className="space-y-4">
        {draws.map((d) => {
          const year = new Date(d.drawAt).getFullYear();
          const pending = !d.numbers?.length;
          return (
            <li key={d.id} className="rounded-lg border border-surface-border bg-surface-card p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Link href={\`/results/international/\${d.id}\`} className="font-medium text-gold">{d.id}</Link>
                  <p className="text-sm text-text-muted">{new Date(d.drawAt).toLocaleString(locale)}</p>
                </div>
                <Link href={\`/results/international/\${d.id}\`} className="text-sm">{t("viewDetail")}</Link>
              </div>
              {pending ? (
                <p className="text-text-muted text-sm">{t("intlPendingTitle")}</p>
              ) : (
                <DrawBalls numbers={d.numbers} special={d.special} zodiacMode="age" year={year} />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
`);

w("app/[locale]/results/international/[id]/page.tsx", `import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import UsageGuide from "@/components/layout/UsageGuide";
import DrawBalls from "@/components/mark6/DrawBalls";
import { getInternationalDraw } from "@/lib/draw/international";
import { verifySeed } from "@/lib/mark6/fairness";

export const dynamic = "force-dynamic";

export default async function InternationalDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("results");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");
  const draw = getInternationalDraw(id);
  if (!draw) notFound();
  const year = new Date(draw.drawAt).getFullYear();
  const verified = draw.seed && draw.seedHash ? verifySeed(draw.seed, draw.seedHash) : null;

  return (
    <div>
      <Breadcrumb items={[
        { label: tCommon("breadcrumbHome"), href: "/" },
        { label: tNav("international"), href: "/results/international" },
        { label: draw.id },
      ]} />
      <UsageGuide titleKey="intlDetailTitle" whatKey="intlDetailWhat" howKey="intlDetailHow" />
      <h1 className="text-2xl font-bold text-gold mb-2">{draw.id}</h1>
      <p className="text-text-muted mb-2">{t("drawnAt")}: {new Date(draw.drawAt).toLocaleString(locale)}</p>
      <p className="text-sm text-gold-dim mb-6">{t("zodiacAgeMethod")}</p>
      <DrawBalls numbers={draw.numbers} special={draw.special} zodiacMode="age" year={year} />
      <section className="mt-8 rounded-lg border border-surface-border bg-surface-card p-4">
        <h2 className="text-lg text-gold mb-3">{t("fairness")}</h2>
        {draw.seedHash && (
          <p className="text-xs break-all mb-2"><span className="text-text-muted">{t("seedHash")}: </span>{draw.seedHash}</p>
        )}
        {draw.seed && (
          <p className="text-xs break-all mb-2"><span className="text-text-muted">{t("seed")}: </span>{draw.seed}</p>
        )}
        {verified === true && <p className="text-green-400 text-sm">{t("verified")}</p>}
        {verified === false && <p className="text-red-400 text-sm">{t("failed")}</p>}
        {verified === null && <p className="text-text-muted text-sm">{t("pending")}</p>}
      </section>
      <Link href="/results/international" className="inline-block mt-6 text-sm">{t("backIntl")}</Link>
    </div>
  );
}
`);

// Zodiac
w("app/[locale]/zodiac/page.tsx", `import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import UsageGuide from "@/components/layout/UsageGuide";
import ZodiacGrid from "@/components/mark6/ZodiacGrid";
import SanheTriangle from "@/components/mark6/SanheTriangle";
import LiuhePairs from "@/components/mark6/LiuhePairs";
import LiuchongPairs from "@/components/mark6/LiuchongPairs";
import AgeMethodGrid from "@/components/mark6/AgeMethodGrid";

export default async function ZodiacPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("zodiac");
  const year = new Date().getFullYear();

  return (
    <div>
      <UsageGuide titleKey="zodiacTitle" whatKey="zodiacWhat" howKey="zodiacHow" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gold">{t("title")}</h1>
        <Link href="/zodiac/lookup" className="text-sm">{t("openLookup")}</Link>
      </div>
      <h2 className="text-xl text-gold mb-4">{t("fixedSection")}</h2>
      <ZodiacGrid />
      <h2 className="text-xl text-gold mt-10 mb-2">{t("ageSection", { year })}</h2>
      <p className="text-sm text-text-muted mb-4">{t("ageNote")}</p>
      <AgeMethodGrid year={year} />
      <h2 className="text-xl text-gold mt-10 mb-4">{t("sanheTitle")}</h2>
      <SanheTriangle />
      <h2 className="text-xl text-gold mt-10 mb-4">{t("liuheTitle")}</h2>
      <LiuhePairs />
      <h2 className="text-xl text-gold mt-10 mb-4">{t("liuchongTitle")}</h2>
      <LiuchongPairs />
    </div>
  );
}
`);

w("app/[locale]/zodiac/lookup/page.tsx", `import LookupClient from "./LookupClient";
import UsageGuide from "@/components/layout/UsageGuide";
import { setRequestLocale } from "next-intl/server";

export default async function LookupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div>
      <UsageGuide titleKey="lookupTitle" whatKey="lookupWhat" howKey="lookupHow" />
      <LookupClient />
    </div>
  );
}
`);

w("app/[locale]/zodiac/lookup/LookupClient.tsx", `"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ALL_ANIMALS, type Animal } from "@/lib/mark6/types";
import { numToAnimalStd, animalToNumbers } from "@/lib/mark6/zodiac";
import { decodeBySuiShuFa, getSuiShuFaNumbers } from "@/lib/mark6/suishufa";
import NumberBall from "@/components/mark6/NumberBall";
import AnimalLabel from "@/components/mark6/AnimalLabel";
import AnimalSvg from "@/components/mark6/AnimalSvg";

export default function LookupClient() {
  const t = useTranslations("lookup");
  const year = new Date().getFullYear();
  const [num, setNum] = useState("1");
  const [animal, setAnimal] = useState<Animal>("鼠");
  const n = parseInt(num, 10);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-6">{t("title")}</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <section className="rounded-lg border border-surface-border bg-surface-card p-4">
          <h2 className="text-lg text-gold mb-3">{t("byNumber")}</h2>
          <input
            type="number"
            min={1}
            max={49}
            value={num}
            onChange={(e) => setNum(e.target.value)}
            className="w-full rounded border border-surface-border bg-surface px-3 py-2 mb-4"
          />
          {n >= 1 && n <= 49 && (
            <div className="space-y-3">
              <NumberBall n={n} size="lg" />
              <p>{t("fixed")}: <AnimalLabel animal={numToAnimalStd(n)} /></p>
              <p>{t("ageMethod", { year })}: <AnimalLabel animal={decodeBySuiShuFa(n, year)} /></p>
            </div>
          )}
        </section>
        <section className="rounded-lg border border-surface-border bg-surface-card p-4">
          <h2 className="text-lg text-gold mb-3">{t("byAnimal")}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {ALL_ANIMALS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAnimal(a)}
                className={\`p-1 rounded \${animal === a ? "ring-2 ring-gold" : ""}\`}
              >
                <AnimalSvg animal={a} size={36} />
              </button>
            ))}
          </div>
          <p className="mb-2"><AnimalLabel animal={animal} /></p>
          <p className="text-sm text-text-muted mb-2">{t("fixed")}</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {animalToNumbers(animal).map((x) => <NumberBall key={x} n={x} size="sm" />)}
          </div>
          <p className="text-sm text-text-muted mb-2">{t("ageMethod", { year })}</p>
          <div className="flex flex-wrap gap-1">
            {getSuiShuFaNumbers(animal, year).map((x) => <NumberBall key={x} n={x} size="sm" />)}
          </div>
        </section>
      </div>
    </div>
  );
}
`);

// Rules pages - shared component
w("components/mark6/RulesContent.tsx", `import { getTranslations } from "next-intl/server";
import { WAVE_MAP } from "@/lib/mark6/constants";
import { FIXED_ZODIAC } from "@/lib/mark6/constants";

export async function RulesBasic({ scheduleKey, sourceKey }: { scheduleKey: "hkSchedule" | "intlSchedule"; sourceKey: "hkSource" | "intlSource" }) {
  const t = await getTranslations("rules");
  const tLegal = await getTranslations("legal");
  return (
    <section className="mb-8">
      <h2 className="text-xl text-gold mb-4">{t("basicTitle")}</h2>
      <dl className="grid gap-2 text-sm">
        <div><dt className="text-text-muted inline">{t("rangeLabel")}: </dt><dd className="inline">{t("rangeValue")}</dd></div>
        <div><dt className="text-text-muted inline">{t("drawFormat")}: </dt><dd className="inline">{t("drawFormatValue")}</dd></div>
        <div><dt className="text-text-muted inline">{t("scheduleLabel")}: </dt><dd className="inline">{t(scheduleKey)}</dd></div>
        <div><dt className="text-text-muted inline">{t("sourceLabel")}: </dt><dd className="inline">{sourceKey === "intlSource" ? t(sourceKey, { company: tLegal("companyName") }) : t(sourceKey)}</dd></div>
      </dl>
    </section>
  );
}

export async function BetTable({ rows }: { rows: { type: string; desc: string }[] }) {
  const t = await getTranslations("rules");
  return (
    <section className="mb-8 overflow-x-auto">
      <h2 className="text-xl text-gold mb-4">{t("betsTitle")}</h2>
      <table className="w-full text-sm border border-surface-border">
        <thead><tr className="bg-surface-card"><th className="p-2 text-left">{t("betType")}</th><th className="p-2 text-left">{t("betDesc")}</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.type} className="border-t border-surface-border"><td className="p-2">{r.type}</td><td className="p-2 text-text-muted">{r.desc}</td></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export async function ZodiacWaveRef() {
  const t = await getTranslations("rules");
  const red = Object.entries(WAVE_MAP).filter(([, w]) => w === "红波").map(([n]) => n).join(" ");
  const blue = Object.entries(WAVE_MAP).filter(([, w]) => w === "蓝波").map(([n]) => n).join(" ");
  const green = Object.entries(WAVE_MAP).filter(([, w]) => w === "绿波").map(([n]) => n).join(" ");
  const zodiacLines = Object.entries(
    Object.entries(FIXED_ZODIAC).reduce<Record<string, number[]>>((acc, [n, a]) => {
      acc[a] = acc[a] ?? [];
      if (!acc[a].includes(Number(n))) acc[a].push(Number(n));
      return acc;
    }, {}),
  ).map(([a, nums]) => \`\${a}: \${nums.sort((x, y) => x - y).map((n) => String(n).padStart(2, "0")).join(" ")}\`);

  return (
    <>
      <section className="mb-8">
        <h2 className="text-xl text-gold mb-2">{t("zodiacTitle")}</h2>
        <p className="text-sm text-text-muted mb-2">{t("zodiacNote")}</p>
        <pre className="text-xs bg-surface-card p-4 rounded overflow-x-auto">{zodiacLines.join("\\n")}</pre>
      </section>
      <section className="mb-8">
        <h2 className="text-xl text-gold mb-2">{t("waveTitle")}</h2>
        <p className="text-sm"><span className="text-ball-red">{t("waveRed")}</span>: {red}</p>
        <p className="text-sm"><span className="text-ball-blue">{t("waveBlue")}</span>: {blue}</p>
        <p className="text-sm"><span className="text-ball-green">{t("waveGreen")}</span>: {green}</p>
      </section>
    </>
  );
}
`);

w("app/[locale]/rules/page.tsx", `import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import UsageGuide from "@/components/layout/UsageGuide";

export default async function RulesHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rules");

  return (
    <div>
      <UsageGuide titleKey="rulesTitle" whatKey="rulesWhat" howKey="rulesHow" />
      <h1 className="text-2xl font-bold text-gold mb-2">{t("hubTitle")}</h1>
      <p className="text-text-muted mb-8">{t("hubIntro")}</p>
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/rules/hongkong" className="block rounded-lg border border-surface-border bg-surface-card p-6 no-underline hover:border-gold/50">
          <h2 className="text-xl text-gold mb-2">{t("hkCard")}</h2>
          <p className="text-sm text-text-muted">{t("hkCardDesc")}</p>
        </Link>
        <Link href="/rules/international" className="block rounded-lg border border-surface-border bg-surface-card p-6 no-underline hover:border-gold/50">
          <h2 className="text-xl text-gold mb-2">{t("intlCard")}</h2>
          <p className="text-sm text-text-muted">{t("intlCardDesc")}</p>
        </Link>
      </div>
    </div>
  );
}
`);

w("app/[locale]/rules/hongkong/page.tsx", `import { getTranslations, setRequestLocale } from "next-intl/server";
import UsageGuide from "@/components/layout/UsageGuide";
import { RulesBasic, BetTable, ZodiacWaveRef } from "@/components/mark6/RulesContent";

export default async function RulesHkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rules");

  const rows = [
    { type: t("tema"), desc: t("temaDesc") },
    { type: t("temaZodiac"), desc: t("temaZodiacDesc") },
    { type: t("main"), desc: t("mainDesc") },
    { type: t("twoAll"), desc: t("twoAllDesc") },
    { type: t("threeAll"), desc: t("threeAllDesc") },
    { type: t("twoSp"), desc: t("twoSpDesc") },
    { type: t("combo"), desc: t("comboDesc") },
    { type: t("wave"), desc: t("waveDesc") },
    { type: t("oddEven"), desc: t("oddEvenDesc") },
    { type: t("bigSmall"), desc: t("bigSmallDesc") },
  ];

  return (
    <div>
      <UsageGuide titleKey="rulesHkTitle" whatKey="rulesHkWhat" howKey="rulesHkHow" />
      <h1 className="text-2xl font-bold text-gold mb-6">{t("hkSection")}</h1>
      <RulesBasic scheduleKey="hkSchedule" sourceKey="hkSource" />
      <BetTable rows={rows} />
      <ZodiacWaveRef />
      <p className="text-sm text-text-muted">{t("disclaimer")}</p>
    </div>
  );
}
`);

w("app/[locale]/rules/international/page.tsx", `import { getTranslations, setRequestLocale } from "next-intl/server";
import UsageGuide from "@/components/layout/UsageGuide";
import LegalNotice from "@/components/layout/LegalNotice";
import { RulesBasic, BetTable, ZodiacWaveRef } from "@/components/mark6/RulesContent";

export default async function RulesIntlPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rules");
  const tLegal = await getTranslations("legal");

  const standard = [
    { type: t("tema"), desc: t("temaDesc") },
    { type: t("temaZodiac"), desc: t("temaZodiacDesc") },
    { type: t("main"), desc: t("mainDesc") },
    { type: t("twoAll"), desc: t("twoAllDesc") },
    { type: t("threeAll"), desc: t("threeAllDesc") },
    { type: t("wave"), desc: t("waveDesc") },
  ];
  const folk = [
    { type: t("oddEven"), desc: t("oddEvenDesc") },
    { type: t("bigSmall"), desc: t("bigSmallDesc") },
    { type: t("sumOddEven"), desc: t("sumOddEvenDesc") },
    { type: t("head"), desc: t("headDesc") },
    { type: t("tail"), desc: t("tailDesc") },
    { type: t("threeWave"), desc: t("threeWaveDesc") },
    { type: t("fiveElements"), desc: t("fiveElementsDesc") },
  ];

  return (
    <div>
      <UsageGuide titleKey="rulesIntlTitle" whatKey="rulesIntlWhat" howKey="rulesIntlHow" />
      <h1 className="text-2xl font-bold text-gold mb-6">{t("intlSection")}</h1>
      <RulesBasic scheduleKey="intlSchedule" sourceKey="intlSource" />
      <BetTable rows={standard} />
      <h2 className="text-xl text-gold mb-4">{t("folkTitle")}</h2>
      <BetTable rows={folk} />
      <ZodiacWaveRef />
      <section className="mb-8">
        <h2 className="text-xl text-gold mb-4">{t("legalBlockTitle")}</h2>
        <LegalNotice />
      </section>
      <p className="text-sm text-text-muted">{t("disclaimer")}</p>
    </div>
  );
}
`);

console.log("Wrote locale pages part 1");
