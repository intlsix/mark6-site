import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return { title: "Dark Code Analysis · 暗码冲合教学", description: "How to decode special zodiac from four dark codes — clash, triad, pair analysis" };
}

export default async function CodesLearnPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isZh = locale === "zh";

  return (
    <div>
      <Link href="/analysis" className="text-sm text-gold-dim hover:text-gold no-underline mb-4 inline-block">
        {isZh ? "← 返回分析中心" : "← Back to Analysis"}
      </Link>

      <article className="rounded-lg border border-surface-border bg-surface-card p-6">
        <h1 className="text-2xl font-bold text-gold mb-2">
          {isZh ? "暗码冲合教学：从4个数字锁定特肖" : "Dark Code Analysis: Locking Special Zodiac from 4 Numbers"}
        </h1>
        <p className="text-sm text-text-muted mb-6">
          {isZh
            ? "每期六合皇信箱底部有四个暗码。它们不是随机数字——通过六冲、三合、六合关系，89.3%的期数中至少有一个暗码的冲合关系指向当期特肖。"
            : "Each issue has four dark codes at the bottom. They are not random — through clash, triad, and pair relationships, 89.3% of issues have at least one dark code's relationship pointing to the special zodiac."}
        </p>

        {/* Step by Step */}
        <h2 className="text-xl text-gold mt-8 mb-4">
          {isZh ? "一、解码四步法" : "I. Four-Step Method"}
        </h2>

        <div className="space-y-4">
          {[
            {
              step: "1", zhTitle: "暗码→余数→岁数→生肖", enTitle: "Code → Remainder → Age → Zodiac",
              zhDesc: "每个暗码÷12取余数，用当年岁数法查出对应生肖。2026马年：1马2蛇3龙4兔5虎6牛7鼠8猪9狗10鸡11猴12羊。",
              enDesc: "Divide each dark code by 12, use the year's Age Method to find the zodiac. 2026 Horse year: 1=Horse, 2=Snake, 3=Dragon, 4=Rabbit, 5=Tiger, 6=Ox, 7=Rat, 8=Pig, 9=Dog, 10=Rooster, 11=Monkey, 12=Goat.",
              zhEx: "暗码15→15÷12=1余3→岁数3=龙", enEx: "Code 15→15÷12=1 rem 3→Age 3=Dragon"
            },
            {
              step: "2", zhTitle: "列出全部冲合关系", enTitle: "List All Relationships",
              zhDesc: "每个生肖有：1个六冲、2个三合、1个六合、1个自身。四者权重：六冲 > 三合 > 六合 ≥ 自身。",
              enDesc: "Each zodiac has: 1 clash, 2 triads, 1 pair, 1 self. Priority: Clash > Triad > Pair ≥ Self.",
              zhEx: "龙：六冲狗、三合猴+鼠、六合鸡、自身龙", enEx: "Dragon: Clash Dog, Triad Monkey+Rat, Pair Rooster, Self Dragon"
            },
            {
              step: "3", zhTitle: "计分排名", enTitle: "Score & Rank",
              zhDesc: "每个关系指向的目标生肖计1分。四个暗码全部算完，分数累加后排名。",
              enDesc: "Each relationship pointing to a target zodiac scores 1 point. Calculate all four dark codes, accumulate scores, rank.",
              zhEx: "狗4分 > 虎2分 = 马2分 = 鼠2分 = 猴2分 = 羊2分 > 猪1分 = 鸡1分 = 龙1分",
              enEx: "Dog 4pts > Tiger 2pts = Horse 2pts = Rat 2pts = Monkey 2pts = Goat 2pts > Pig 1pt = Rooster 1pt = Dragon 1pt"
            },
            {
              step: "4", zhTitle: "红字交叉验证", enTitle: "Cross-verify with Red Characters",
              zhDesc: "暗码得分最高的候选，用红字解码去验证是否一致。一致→双保险。矛盾→重新审视。",
              enDesc: "Cross-check the top dark code candidate against red character decoding. Consistent → confirmed. Contradiction → re-examine.",
            },
          ].map(s => (
            <div key={s.step} className="p-4 rounded border border-surface-border bg-surface/50">
              <h3 className="text-gold font-semibold mb-1.5">
                {isZh ? `第${s.step}步：${s.zhTitle}` : `Step ${s.step}: ${s.enTitle}`}
              </h3>
              <p className="text-sm text-text-muted mb-1">{isZh ? s.zhDesc : s.enDesc}</p>
              {s.zhEx && <p className="text-xs text-text-muted/60 italic">{isZh ? `例：${s.zhEx}` : `Ex: ${s.enEx}`}</p>}
            </div>
          ))}
        </div>

        {/* Verified Data */}
        <h2 className="text-xl text-gold mt-10 mb-4">
          {isZh ? "二、已验证数据" : "II. Verified Data"}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-surface-border rounded">
            <thead>
              <tr className="bg-surface/50">
                <th className="p-2 text-left text-gold">{isZh ? "年份" : "Year"}</th>
                <th className="p-2 text-left text-gold">{isZh ? "命中率" : "Accuracy"}</th>
                <th className="p-2 text-left text-gold">{isZh ? "期数" : "Issues"}</th>
                <th className="p-2 text-left text-gold">{isZh ? "太岁" : "Tai Sui"}</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["2020", "50.0%", "10", "Rat"],
                ["2021", "90.8%", "98", "Ox"],
                ["2022", "94.4%", "90", "Tiger"],
                ["2023", "94.2%", "86", "Rabbit"],
                ["2024", "87.0%", "108", "Dragon"],
                ["2025", "87.5%", "112", "Snake"],
                ["2026", "84.8%", "46", "Horse"],
              ].map(([year, rate, issues, ts]) => (
                <tr key={year} className="border-t border-surface-border">
                  <td className="p-2">{year}</td>
                  <td className="p-2 text-gold font-semibold">{rate}</td>
                  <td className="p-2 text-text-muted">{issues}</td>
                  <td className="p-2 text-text-muted">{isZh ? {Rat:"鼠",Ox:"牛",Tiger:"虎",Rabbit:"兔",Dragon:"龙",Snake:"蛇",Horse:"马"}[ts as string] : ts}</td>
                </tr>
              ))}
              <tr className="border-t border-surface-border bg-gold/5 font-semibold">
                <td className="p-2">{isZh ? "总计" : "Total"}</td>
                <td className="p-2 text-gold">89.3%</td>
                <td className="p-2">550</td>
                <td className="p-2">—</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Two Traps */}
        <h2 className="text-xl text-gold mt-10 mb-4">
          {isZh ? "三、两大陷阱 ⚠️" : "III. Two Major Traps ⚠️"}
        </h2>

        <div className="space-y-4">
          <div className="p-4 rounded border border-red-500/30 bg-red-500/5">
            <h3 className="text-gold font-semibold mb-2">
              {isZh ? "陷阱一：强者陷阱（056期案例）" : "Trap 1: Strong Signal Trap (Issue 056)"}
            </h3>
            <p className="text-sm text-text-muted mb-2">
              {isZh
                ? "056期暗码17(虎冲猴)+41(虎冲猴)——双虎冲猴，信号极强。大脑自动锁死猴，忽略了21自身=狗（仅1分）。实际答案：狗。"
                : "Issue 056 codes 17(Tiger→Clash Monkey)+41(Tiger→Clash Monkey) — dual Tigers clashing Monkey, extremely strong signal. Brain auto-locked on Monkey, ignored 21 Self=Dog (only 1 point). Real answer: Dog."}
            </p>
            <p className="text-xs text-gold-dim">
              {isZh ? "教训：四个暗码必须全部算完。不能因为某信号'强'就只看它。" : "Lesson: Calculate ALL four dark codes. Never fixate on one signal just because it's strong."}
            </p>
          </div>

          <div className="p-4 rounded border border-red-500/30 bg-red-500/5">
            <h3 className="text-gold font-semibold mb-2">
              {isZh ? "陷阱二：连续期重复陷阱（057期案例）" : "Trap 2: Consecutive Repeat Trap (Issue 057)"}
            </h3>
            <p className="text-sm text-text-muted mb-2">
              {isZh
                ? "057期暗码05(虎三合狗)+15(龙冲狗)+25(马三合狗)+49(马三合狗)——四码全部指向狗，罕见完美共识。但上期056刚开狗。这期答案：鸡（龙六合→鸡，仅1分）。"
                : "Issue 057 codes 05(Tiger→Triad Dog)+15(Dragon→Clash Dog)+25(Horse→Triad Dog)+49(Horse→Triad Dog) — all four point to Dog, rare perfect consensus. But Dog just won last issue. Real answer: Rooster (Dragon→Pair Rooster, only 1 point)."}
            </p>
            <p className="text-xs text-gold-dim">
              {isZh ? "教训：暗码越'完美'越可疑。第一步永远先查上期开什么。" : "Lesson: The more 'perfect' the dark codes, the more suspicious. Always check what won last issue first."}
            </p>
          </div>
        </div>

        {/* Key Rules */}
        <h2 className="text-xl text-gold mt-10 mb-4">
          {isZh ? "四、核心规则" : "IV. Core Rules"}
        </h2>
        <div className="p-4 rounded border border-gold/30 bg-gold/5">
          <ul className="text-sm text-text-muted space-y-2 list-disc pl-5">
            {(isZh ? [
              "四个暗码必须全部算完，逐条列出冲合关系",
              "不要因为某个信号'强'就忽略其他信号",
              "强信号和弱信号冲突时，不能自动选强信号",
              "正确的答案往往是暗码中得分最低的那个（1分弱信号）",
              "暗码89%可靠，11%看读者信——两者结合约95%覆盖",
              "六冲 > 三合 > 六合 ≥ 自身（权重排序）",
            ] : [
              "Calculate ALL four dark codes — list every relationship",
              "Never ignore a signal just because another one is 'stronger'",
              "When strong and weak signals conflict, don't automatically pick the strong one",
              "The correct answer is often the weakest-scoring candidate (1 point)",
              "Dark codes 89% reliable, 11% in reader letters — combined ~95% coverage",
              "Clash > Triad > Pair ≥ Self (priority order)",
            ]).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </article>
    </div>
  );
}
