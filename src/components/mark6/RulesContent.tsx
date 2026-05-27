import { getTranslations } from "next-intl/server";
import { WAVE_MAP } from "@/lib/mark6/constants";
import { FIXED_ZODIAC } from "@/lib/mark6/constants";

export async function RulesBasic({ scheduleKey, sourceKey }: { scheduleKey: "hkSchedule" | "intlSchedule"; sourceKey: "hkSource" | "intlSource" }) {
  const t = await getTranslations("rules");
  const tLegal = await getTranslations("legal");
  return (
    <section className="mb-8 rounded-lg border border-surface-border bg-surface-card p-6">
      <h2 className="text-xl text-gold mb-4">{t("basicTitle")}</h2>
      <dl className="grid gap-3 text-sm">
        <div className="flex gap-2"><dt className="text-text-muted shrink-0 w-24">{t("rangeLabel")}:</dt><dd className="text-text">{t("rangeValue")}</dd></div>
        <div className="flex gap-2"><dt className="text-text-muted shrink-0 w-24">{t("drawFormat")}:</dt><dd className="text-text">{t("drawFormatValue")}</dd></div>
        <div className="flex gap-2"><dt className="text-text-muted shrink-0 w-24">{t("scheduleLabel")}:</dt><dd className="text-text">{t(scheduleKey)}</dd></div>
        <div className="flex gap-2"><dt className="text-text-muted shrink-0 w-24">{t("sourceLabel")}:</dt><dd className="text-text">{sourceKey === "intlSource" ? t(sourceKey, { company: tLegal("companyName") }) : t(sourceKey)}</dd></div>
      </dl>
    </section>
  );
}

export async function BetTable({ rows }: { rows: { type: string; desc: string }[] }) {
  const t = await getTranslations("rules");
  return (
    <section className="mb-8 rounded-lg border border-surface-border bg-surface-card p-6">
      <h2 className="text-xl text-gold mb-4">{t("betsTitle")}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-surface-border"><th className="p-3 text-left text-gold font-medium w-1/3">{t("betType")}</th><th className="p-3 text-left text-gold font-medium">{t("betDesc")}</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.type} className={`border-b border-surface-border/50 ${i % 2 === 0 ? "bg-surface/30" : ""}`}><td className="p-3 font-medium">{r.type}</td><td className="p-3 text-text-muted">{r.desc}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
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
  ).map(([a, nums]) => `${a}: ${nums.sort((x, y) => x - y).map((n) => String(n).padStart(2, "0")).join(" ")}`);

  return (
    <>
      <section className="mb-8">
        <h2 className="text-xl text-gold mb-2">{t("zodiacTitle")}</h2>
        <p className="text-sm text-text-muted mb-2">{t("zodiacNote")}</p>
        <pre className="text-xs bg-surface-card p-4 rounded overflow-x-auto">{zodiacLines.join("\n")}</pre>
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
