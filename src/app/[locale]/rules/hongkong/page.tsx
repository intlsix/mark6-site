import { getTranslations } from "next-intl/server";
import { getSeoForPath } from "@/lib/admin/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return await getSeoForPath("/rules/hongkong", locale);
}

const PRIZE_TABLE_ZH = [
  { prize: "头奖", condition: "选中 6 个「搅出号码」", payout: "奖金会因应该期获中头奖注数而有所不同，每期头奖奖金基金订为不少于港币 800 万元。" },
  { prize: "二奖", condition: "选中 5 个「搅出号码」+「特别号码」", payout: "奖金会因应该期获中二奖注数而有所不同" },
  { prize: "三奖", condition: "选中 5 个「搅出号码」", payout: "奖金会因应该期获中三奖注数而有所不同" },
  { prize: "四奖", condition: "选中 4 个「搅出号码」+「特别号码」", payout: "固定奖金港币 9,600 元" },
  { prize: "五奖", condition: "选中 4 个「搅出号码」", payout: "固定奖金港币 640 元" },
  { prize: "六奖", condition: "选中 3 个「搅出号码」+「特别号码」", payout: "固定奖金港币 320 元" },
  { prize: "七奖", condition: "选中 3 个「搅出号码」", payout: "固定奖金港币 40 元" },
];

const PRIZE_TABLE_EN = [
  { prize: "1st Prize", condition: "Match all 6 drawn numbers", payout: "Prize varies by number of winning units. Minimum prize fund HK$8,000,000 per draw." },
  { prize: "2nd Prize", condition: "Match 5 drawn numbers + Extra Number", payout: "Prize varies by number of winning units" },
  { prize: "3rd Prize", condition: "Match 5 drawn numbers", payout: "Prize varies by number of winning units" },
  { prize: "4th Prize", condition: "Match 4 drawn numbers + Extra Number", payout: "Fixed HK$9,600 per winning unit" },
  { prize: "5th Prize", condition: "Match 4 drawn numbers", payout: "Fixed HK$640 per winning unit" },
  { prize: "6th Prize", condition: "Match 3 drawn numbers + Extra Number", payout: "Fixed HK$320 per winning unit" },
  { prize: "7th Prize", condition: "Match 3 drawn numbers", payout: "Fixed HK$40 per winning unit" },
];

const DIST_TABLE_ZH = [
  { group: "第一组奖金", formula: "45% × (奖金基金 − 第四至七组总奖金 − 金多宝扣数) ÷ 中奖单位" },
  { group: "第二组奖金", formula: "15% × (奖金基金 − 第四至七组总奖金 − 金多宝扣数) ÷ 中奖单位" },
  { group: "第三组奖金", formula: "40% × (奖金基金 − 第四至七组总奖金 − 金多宝扣数) ÷ 中奖单位" },
  { group: "第四组奖金", formula: "每注港币 9,600 元" },
  { group: "第五组奖金", formula: "每注港币 640 元" },
  { group: "第六组奖金", formula: "每注港币 320 元" },
  { group: "第七组奖金", formula: "每注港币 40 元" },
];

const DIST_TABLE_EN = [
  { group: "1st Prize", formula: "45% × (Prize Fund − 4th–7th prizes − Snowball Deduction) ÷ Winning Units" },
  { group: "2nd Prize", formula: "15% × (Prize Fund − 4th–7th prizes − Snowball Deduction) ÷ Winning Units" },
  { group: "3rd Prize", formula: "40% × (Prize Fund − 4th–7th prizes − Snowball Deduction) ÷ Winning Units" },
  { group: "4th Prize", formula: "HK$9,600 per winning unit" },
  { group: "5th Prize", formula: "HK$640 per winning unit" },
  { group: "6th Prize", formula: "HK$320 per winning unit" },
  { group: "7th Prize", formula: "HK$40 per winning unit" },
];

// Simple SVG pie chart component
function PieChart({ segments }: { segments: { label: string; pct: number; color: string }[] }) {
  let cumulative = 0;
  const paths = segments.map((s) => {
    const startAngle = (cumulative / 100) * 360;
    cumulative += s.pct;
    const endAngle = (cumulative / 100) * 360;
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const x1 = 80 + 60 * Math.cos(startRad);
    const y1 = 80 + 60 * Math.sin(startRad);
    const x2 = 80 + 60 * Math.cos(endRad);
    const y2 = 80 + 60 * Math.sin(endRad);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return {
      d: `M 80 80 L ${x1} ${y1} A 60 60 0 ${large} 1 ${x2} ${y2} Z`,
      color: s.color,
      label: s.label,
      pct: s.pct,
    };
  });
  return (
    <svg viewBox="0 0 160 160" className="w-40 h-40 shrink-0">
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} stroke="#1a1a2e" strokeWidth="1" />
      ))}
    </svg>
  );
}

export default async function RulesHkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isZh = locale === "zh";
  const t = await getTranslations("rules");
  const prizeTable = isZh ? PRIZE_TABLE_ZH : PRIZE_TABLE_EN;
  const distTable = isZh ? DIST_TABLE_ZH : DIST_TABLE_EN;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gold">
        {isZh ? "香港六合彩 — 获奖资格与奖金分配" : "HK Mark Six — Prizes & Distribution"}
      </h1>

      {/* ===== 获奖资格 / Prize Qualification ===== */}
      <section className="rounded-lg border border-surface-border bg-surface-card p-6">
        <h2 className="text-xl text-gold mb-4">
          {isZh ? "获奖资格" : "Prize Qualification"}
        </h2>
        <div className="text-sm text-text-muted space-y-3">
          <p>
            {isZh
              ? "六合彩注项单位为每注港币 10 元。选择复式或胆拖注项时，可以每注港币 $5「部份注项单位」投注。有关之奖金则根据每注「部份注项单位」占注项单位的份数计算。"
              : "Each Mark Six entry unit costs HK$10. For compound or banker entries, you may place a \"Partial Unit\" of HK$5 per bet. Prize amounts are calculated proportionally based on the Partial Unit's share of a full unit."}
          </p>
          <p>
            {isZh
              ? "每期六合彩搅珠均从 49 个号码中搅出七个号码。首六个号码称为「搅出号码」，而第七个号码称为「特别号码」。"
              : "Each draw selects 7 numbers from 49. The first six are the \"Drawn Numbers\", and the seventh is the \"Extra Number\"."}
          </p>
        </div>
      </section>

      {/* ===== 奖项详情 / Prize Details ===== */}
      <section className="rounded-lg border border-surface-border bg-surface-card p-6">
        <h2 className="text-xl text-gold mb-4">
          {isZh ? "奖项详情" : "Prize Details"}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="p-3 text-left text-gold font-medium w-[12%]">{isZh ? "奖项" : "Prize"}</th>
                <th className="p-3 text-left text-gold font-medium w-[35%]">{isZh ? "条件" : "Condition"}</th>
                <th className="p-3 text-left text-gold font-medium">{isZh ? "奖金说明" : "Payout"}</th>
              </tr>
            </thead>
            <tbody>
              {prizeTable.map((row, i) => (
                <tr key={row.prize} className={`border-b border-surface-border/50 ${i % 2 === 0 ? "bg-surface/30" : ""}`}>
                  <td className="p-3 font-medium text-gold">{row.prize}</td>
                  <td className="p-3">{row.condition}</td>
                  <td className="p-3 text-text-muted">{row.payout}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== 领取奖金 / Claiming Prizes ===== */}
      <section className="rounded-lg border border-surface-border bg-surface-card p-6">
        <h2 className="text-xl text-gold mb-4">
          {isZh ? "领取奖金" : "Claiming Prizes"}
        </h2>
        <p className="text-sm text-text-muted">
          {isZh
            ? "所有获中彩票，必须于有关搅珠的日期后起计 60 天内领取（例子：于 3 月 1 日所举行的搅珠的获中彩票，可于 3 月 1 日当天至 4 月 30 日内任何一天领取）。"
            : "All winning tickets must be claimed within 60 days of the draw date (e.g. for a draw held on March 1, winning tickets may be claimed any day from March 1 to April 30)."}
        </p>
      </section>

      {/* ===== 奖金基金分配 / Prize Fund Distribution ===== */}
      <section className="rounded-lg border border-surface-border bg-surface-card p-6">
        <h2 className="text-xl text-gold mb-4">
          {isZh ? "奖金基金的分配" : "Prize Fund Distribution"}
        </h2>

        {/* Pie chart + legend */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <PieChart
            segments={[
              { label: isZh ? "奖金基金" : "Prize Fund", pct: 54, color: "#e74c3c" },
              { label: isZh ? "奖券博彩税" : "Betting Duty", pct: 25, color: "#3498db" },
              { label: isZh ? "奖券基金" : "Lotteries Fund", pct: 15, color: "#2ecc71" },
              { label: isZh ? "马会佣金" : "HKJC Commission", pct: 6, color: "#f39c12" },
            ]}
          />
          <div className="space-y-2 text-sm">
            {[
              { label: isZh ? "奖金基金" : "Prize Fund", pct: 54, color: "#e74c3c" },
              { label: isZh ? "奖券博彩税" : "Betting Duty", pct: 25, color: "#3498db" },
              { label: isZh ? "奖券基金" : "Lotteries Fund", pct: 15, color: "#2ecc71" },
              { label: isZh ? "马会佣金" : "HKJC Commission", pct: 6, color: "#f39c12" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm inline-block shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-text-muted">{s.label}: {s.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-text-muted space-y-2 mb-6">
          <p>
            {isZh
              ? "每期头奖奖金基金订为不少于港币 800 万元，并不设上限。"
              : "The minimum 1st Prize fund is HK$8,000,000 per draw, with no maximum limit."}
          </p>
          <p>
            {isZh
              ? "若头奖及 / 或二奖无人中奖，奖金将会拨入下一期搅珠的头奖基金作「多宝」金额。"
              : "If the 1st and/or 2nd Prize is not won, the amount will be added to the next draw's 1st Prize fund as a \"Snowball\"."}
          </p>
        </div>

        {/* Distribution table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="p-3 text-left text-gold font-medium w-[25%]">{isZh ? "各组奖金" : "Prize Group"}</th>
                <th className="p-3 text-left text-gold font-medium">{isZh ? "奖金分配" : "Allocation"}</th>
              </tr>
            </thead>
            <tbody>
              {distTable.map((row, i) => (
                <tr key={row.group} className={`border-b border-surface-border/50 ${i % 2 === 0 ? "bg-surface/30" : ""}`}>
                  <td className="p-3 font-medium">{row.group}</td>
                  <td className="p-3 text-text-muted">{row.formula}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-text-muted/50 mt-4">
          {isZh
            ? "* 由 2024 年 5 月 21 日起，金多宝扣数定为 [9% × [奖金基金 − 第四、五、六及七组总奖金 − 55% × (60% × 奖金基金 − 第四至七组总奖金)] + 55% × (60% × 奖金基金 − 第四至七组总奖金)]。"
            : "* Effective 21 May 2024, the Snowball Deduction = [9% × [Prize Fund − 4th–7th Prizes − 55% × (60% × Prize Fund − 4th–7th Prizes)] + 55% × (60% × Prize Fund − 4th–7th Prizes)]."}
        </p>
      </section>

      {/* ===== 重要事项 / Important Notes ===== */}
      <section className="rounded-lg border border-surface-border bg-surface-card p-6">
        <h2 className="text-xl text-gold mb-4">
          {isZh ? "重要事项" : "Important Notes"}
        </h2>

        <div className="text-sm text-text-muted space-y-4">
          <p>
            {isZh
              ? "奖金的分配须受香港马会奖券有限公司的奖券规例所约制。由 2024 年 5 月 21 日起，奖金分配如下："
              : "Prize distribution is governed by the HKJC Lotteries Limited Rules. Effective 21 May 2024, the prize allocation is as follows:"}
          </p>

          {/* Repeat distribution table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="p-3 text-left text-gold font-medium w-[25%]">{isZh ? "各组奖金" : "Prize Group"}</th>
                  <th className="p-3 text-left text-gold font-medium">{isZh ? "奖金分配（每港币 $10 一注）" : "Allocation (per HK$10 unit)"}</th>
                </tr>
              </thead>
              <tbody>
                {distTable.map((row, i) => (
                  <tr key={row.group} className={`border-b border-surface-border/50 ${i % 2 === 0 ? "bg-surface/30" : ""}`}>
                    <td className="p-3 font-medium">{row.group}</td>
                    <td className="p-3 text-text-muted">{row.formula}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gold mt-2">
            {isZh
              ? "每期头奖奖金基金订为不少于港币 800 万元。"
              : "The minimum 1st Prize fund is HK$8,000,000 per draw."}
          </p>

          <p>
            {isZh
              ? "奖金基金是指每期搅珠的总投注额的百分之五十四。余下的百分之四十六将根据博彩税条例分配如下：(i) 奖券收益的征税（百分之二十五）；(ii) 奖券基金（百分之十五）；及 (iii) 香港马会奖券有限公司的佣金（百分之六）。"
              : "The Prize Fund represents 54% of total turnover per draw. The remaining 46% is allocated per the Betting Duty Ordinance: (i) Betting duty on lottery proceeds (25%); (ii) Lotteries Fund (15%); and (iii) HKJC Lotteries Limited commission (6%)."}
          </p>

          <p className="text-xs text-text-muted/50">
            {isZh
              ? "由 2024 年 5 月 21 日起，金多宝扣数定为 {9% × [奖金基金 − 第四、五、六及七组总奖金 − 55% × (60% × 奖金基金 − 第四至七组总奖金)] + 55% × (60% × 奖金基金 − 第四至七组总奖金)}。"
              : "Effective 21 May 2024, Snowball Deduction = {9% × [Prize Fund − 4th–7th Prizes − 55% × (60% × Prize Fund − 4th–7th Prizes)] + 55% × (60% × Prize Fund − 4th–7th Prizes)}."}
          </p>

          <p>
            {isZh
              ? "第一组、第二组及第三组奖金基金之分配百分率可作调整，以尽量确保在任何时间内，每一有关奖金以一注项单位作计算：(i) 第一组奖金应最少为第二组奖金的两倍；(ii) 第二组奖金应最少为第三组奖金的两倍；及 (iii) 第三组奖金应最少为第四组奖金的两倍。第四组、第五组、第六组及第七组奖金亦可根据奖券规例而被调整。"
              : "The percentage allocation for 1st, 2nd, and 3rd Prizes may be adjusted to ensure, as far as possible: (i) 1st Prize ≥ 2 × 2nd Prize; (ii) 2nd Prize ≥ 2 × 3rd Prize; and (iii) 3rd Prize ≥ 2 × 4th Prize. 4th through 7th Prizes may also be adjusted per the Mark Six Rules."}
          </p>

          <h3 className="text-base text-gold mt-6 mb-2">
            {isZh ? "领取奖金" : "Claiming Prizes"}
          </h3>
          <p>
            {isZh
              ? "所有获中彩票，必须于有关搅珠的日期后起计 60 天内领取（例子：于 3 月 1 日所举行的搅珠的获中彩票，可于 3 月 1 日当天至 4 月 30 日内任何一天领取）。"
              : "All winning tickets must be claimed within 60 days of the draw date (e.g. for a draw on March 1, winning tickets may be claimed any day from March 1 to April 30)."}
          </p>
        </div>
      </section>

      <p className="text-sm text-text-muted">{t("disclaimer")}</p>
    </div>
  );
}
