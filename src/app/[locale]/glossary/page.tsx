import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";
  return {
    title: isZh ? "术语词典 · Mark Six 中英对照" : "Glossary · Mark Six Terminology",
    description: isZh ? "六合彩核心术语中英对照：特码、波色、红字、暗码、岁数法、三合六冲——新人入门必读。" : "Core Mark Six terminology: Special Number, Wave Color, Red Character, Dark Code, Age Method, Triad & Clash — essential reference.",
  };
}

const TERMS = [
  { zh: "特码", en: "Special Number", defZh: "每期开出的第7个号码，也称「特别号码」，投注焦点所在。", defEn: "The 7th number drawn each round — the primary betting target." },
  { zh: "平码", en: "Main Numbers", defZh: "每期开出的前6个常规号码。", defEn: "The first six regular numbers drawn each round." },
  { zh: "特肖", en: "Special Zodiac", defZh: "特码对应的生肖。本站统一使用岁数法而非固定生肖。", defEn: "The zodiac animal of the special number. This site uses the Age Method, not fixed zodiac." },
  { zh: "波色", en: "Wave Color", defZh: "每个号码所属的颜色：红波、蓝波、绿波，三者概率均等。", defEn: "Each number belongs to one of three color waves: Red, Blue, or Green — equal probability." },
  { zh: "红字", en: "Red Character", defZh: "六合皇信箱每期的四字标题。通过拆字、典故、意象指向特定生肖，是核心解码对象。", defEn: "The four-character title in each issue of Liu He Huang Mailbox. Decoded via character decomposition, allusion, and imagery to point to a zodiac." },
  { zh: "暗码", en: "Dark Code", defZh: "每期信箱底部的四个数字（如05 15 25 49），通过冲合关系间接指向特肖。", defEn: "Four numbers at the bottom of each issue (e.g. 05 15 25 49). Their clash/triad/pair relationships indirectly point to the special zodiac." },
  { zh: "跑狗", en: "Running Dog", defZh: "每期配图谜语，以狗为主角的连环画，诗句中藏有生肖线索。", defEn: "Illustrated puzzle in each issue featuring a dog comic strip with hidden zodiac clues in the poem." },
  { zh: "岁数法", en: "Age Method", defZh: "号码除以12取余数，以当年太岁为余1，逆地支循环排列得出生肖。例（2026马年）：1马2蛇3龙4兔5虎6牛7鼠8猪9狗10鸡11猴12羊。", defEn: "Number ÷ 12 = remainder → zodiac. Rotates counter-clockwise through earthly branches each year from Tai Sui as remainder 1. Example (2026 Horse year): 1=Horse, 2=Snake, 3=Dragon, 4=Rabbit, 5=Tiger, 6=Ox, 7=Rat, 8=Pig, 9=Dog, 10=Rooster, 11=Monkey, 12=Goat." },
  { zh: "三合", en: "Triad", defZh: "十二生肖四组三合局：申子辰(猴鼠龙/水)、巳酉丑(蛇鸡牛/金)、寅午戌(虎马狗/火)、亥卯未(猪兔羊/木)。三合生肖互为贵人。", defEn: "Four zodiac triads: Monkey-Rat-Dragon (Water), Snake-Rooster-Ox (Metal), Tiger-Horse-Dog (Fire), Pig-Rabbit-Goat (Wood). Triad animals are natural allies." },
  { zh: "六合", en: "Six Harmony", defZh: "六组配对：鼠牛、虎猪、兔狗、龙鸡、蛇猴、马羊。最和谐的搭档关系。", defEn: "Six zodiac pairs: Rat-Ox, Tiger-Pig, Rabbit-Dog, Dragon-Rooster, Snake-Monkey, Horse-Goat. The most harmonious pairing." },
  { zh: "六冲", en: "Six Clash", defZh: "六组对立：鼠马、牛羊、虎猴、兔鸡、龙狗、蛇猪。对冲相克，暗码分析中权重最高。", defEn: "Six opposing zodiac pairs: Rat-Horse, Ox-Goat, Tiger-Monkey, Rabbit-Rooster, Dragon-Dog, Snake-Pig. Highest weight in dark code analysis." },
  { zh: "太岁", en: "Tai Sui", defZh: "当年值年生肖。2026年为马年，太岁属马。岁数法以当年太岁为基准轮转。", defEn: "The zodiac of the current year. 2026 is Year of the Horse. The Age Method rotates from Tai Sui as remainder 1." },
  { zh: "五行", en: "Five Elements", defZh: "金木水火土。金=猴鸡、木=虎兔、水=鼠猪、火=蛇马、土=牛龙羊狗。", defEn: "Metal-Wood-Water-Fire-Earth. Metal=Monkey/Rooster, Wood=Tiger/Rabbit, Water=Rat/Pig, Fire=Snake/Horse, Earth=Ox/Dragon/Goat/Dog." },
  { zh: "地支", en: "Earthly Branches", defZh: "子丑寅卯辰巳午未申酉戌亥，对应十二生肖和十二时辰（每个时辰2小时）。", defEn: "The 12-branch cycle: Zi=Rat, Chou=Ox, Yin=Tiger, Mao=Rabbit, Chen=Dragon, Si=Snake, Wu=Horse, Wei=Goat, Shen=Monkey, You=Rooster, Xu=Dog, Hai=Pig. Also corresponds to two-hour time periods." },
  { zh: "合数", en: "Digit Sum", defZh: "号码十位数与个位数之和。如38→3+8=11合。合数单双为国际民间特色玩法。", defEn: "Sum of tens + units digits. e.g. 38→3+8=11. Odd/even digit sum is an International exclusive folk bet." },
  { zh: "头数", en: "Head Digit", defZh: "号码的十位数（0-4）。如38→头3。01-09头数为0。", defEn: "The tens digit (0–4). e.g. 38→head 3. 01–09 have head 0." },
  { zh: "尾数", en: "Tail Digit", defZh: "号码的个位数（0-9）。如38→尾8。", defEn: "The units digit (0–9). e.g. 38→tail 8." },
  { zh: "单双", en: "Odd/Even", defZh: "单数=奇数（1,3,5,7,9结尾），双数=偶数（0,2,4,6,8结尾）。", defEn: "Odd = numbers ending in 1,3,5,7,9. Even = numbers ending in 0,2,4,6,8." },
  { zh: "大小", en: "Big/Small", defZh: "大=25-49，小=01-24。以25为分界线。", defEn: "Big = 25–49, Small = 01–24. The midpoint is 25." },
  { zh: "玄机", en: "Mystic Clues", defZh: "六合皇信箱每期发布的玄机诗句和图片，提供额外生肖线索。", defEn: "Additional poem and image puzzles published alongside each issue for extra zodiac hints." },
  { zh: "陈先生", en: "Mr. Chen", defZh: "六合皇信箱独立栏目作者，每期以短句谜面给出线索，需用拆字法解读。", defEn: "Author of an independent column. Each issue features a cryptic phrase requiring character decomposition to decode." },
  { zh: "开奖日", en: "Draw Day", defZh: "香港开奖每周二、四、六。国际开奖每日一期（UTC 13:30）。", defEn: "HK draws on Tue/Thu/Sat. International draws daily at UTC 13:30 (Beijing 21:30)." },
  { zh: "期号", en: "Issue Number", defZh: "开奖编号，如057期。香港与国际开奖使用独立期号体系。", defEn: "Draw period identifier (e.g. Issue 057). HK and International use separate period numbering." },
  { zh: "种子哈希", en: "Seed Hash", defZh: "国际开奖开奖前公示的SHA-256哈希值。开奖后公布原始种子供验证公平性。", defEn: "SHA-256 hash published before each International draw. The raw seed is revealed afterward for independent verification." },
  { zh: "固定生肖", en: "Fixed Zodiac", defZh: "每个号码永久对应的生肖（01鼠、02牛…），与岁数法不同。本站统一使用岁数法。", defEn: "Permanent number-to-zodiac mapping (01=Rat, 02=Ox…). Different from Age Method. This site uses Age Method throughout." },
  { zh: "冷热号", en: "Hot/Cold Numbers", defZh: "历史统计中频率高的为热号，出现少的为冷号。走势工具可查看。", defEn: "Hot numbers = high historical frequency. Cold = low frequency. Viewable in the Trends tool." },
];

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("glossary");
  const isZh = locale === "zh";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-2">{t("title")}</h1>
      <p className="text-text-muted mb-8 text-sm">{t("subtitle")}</p>

      <div className="space-y-4">
        {TERMS.map((term) => (
          <div key={term.en} className="rounded-lg border border-surface-border bg-surface-card p-5 hover:border-gold/30 transition">
            <h3 className="text-gold font-semibold mb-1.5">
              {isZh ? term.zh : term.en}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {isZh ? term.defZh : term.defEn}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-lg border border-surface-border bg-surface-card/50 text-xs text-text-muted/60">
        {isZh
          ? "本站所有生肖显示统一使用岁数法（号码÷12取余），非固定生肖。详见「生肖工具」页面。"
          : "All zodiac displays on this site use the Age Method (number ÷ 12 = remainder), not fixed zodiac. See Zodiac Tools for details."}
      </div>
    </div>
  );
}
