import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";
  return {
    title: isZh ? "常见问题 · 六合彩FAQ" : "FAQ · Mark Six Questions",
    description: isZh ? "六合彩常见问题解答：怎么玩、红字怎么看、暗码是什么、岁数法、波色、三合六冲——10条常见问题。" : "Mark Six FAQ: how to play, red character decoding, dark codes, age method, wave colors, triads & clashes — 10 common questions answered.",
  };
}

const FAQS = [
  {
    qZh: "六合彩怎么玩？",
    qEn: "How do I play Mark Six?",
    aZh: "每期从01-49中开出6个平码+1个特码。你可以猜特码（1个号）、特肖（12选1）、正码（猜平码）、波色（红/蓝/绿）、单双、大小等多种玩法。详见「玩法规则」页面。",
    aEn: "Each draw selects 6 main numbers + 1 special number from 01-49. You can bet on the special number, special zodiac (1/12), main numbers, wave color (Red/Blue/Green), odd/even, big/small, and more. See Game Rules for details.",
    link: "/rules",
  },
  {
    qZh: "红字是什么？怎么看红字？",
    qEn: "What are red characters and how do I read them?",
    aZh: "红字是六合皇信箱每期的四字标题（如057期「淚洒當場」）。通过拆字、典故、意象等手法，红字间接指向当期特肖。本站解码学院有完整8+5法教学。",
    aEn: "Red characters are the four-character titles in each issue of Liu He Huang Mailbox (e.g. Issue 057 \"淚洒當場\"). Through character decomposition, allusion, and imagery, they indirectly point to the special zodiac. Our Decoding Academy teaches all 8+5 methods.",
    link: "/analysis/idiom/learn",
  },
  {
    qZh: "暗码是什么？有什么用？",
    qEn: "What are dark codes and what are they for?",
    aZh: "每期四个数字（如05 15 25 49），通过六冲、三合、六合关系间接指向特肖。跨2020-2026年550期验证，89.3%命中率。",
    aEn: "Four numbers per issue (e.g. 05 15 25 49) that point to the special zodiac through clash, triad, and pair relationships. 89.3% accuracy across 550 issues (2020-2026).",
    link: "/analysis/codes/learn",
  },
  {
    qZh: "什么是岁数法？和固定生肖有什么区别？",
    qEn: "What is the Age Method? How is it different from fixed zodiac?",
    aZh: "岁数法：号码÷12取余数，以当年太岁为余1，逆地支排列得生肖。每年以太岁不同而轮转。固定生肖：每个号码永久对应一个生肖（01鼠、02牛...）。本站统一使用岁数法显示。",
    aEn: "Age Method: Number ÷ 12 = remainder → zodiac. Tai Sui is remainder 1, rotating counter-clockwise yearly. Fixed Zodiac: each number has a permanent zodiac (01=Rat, 02=Ox...). This site uses the Age Method throughout.",
    link: "/knowledge/age-method-explained",
  },
  {
    qZh: "香港开奖和国际开奖有什么区别？",
    qEn: "What's the difference between Hong Kong and International draws?",
    aZh: "香港开奖：每周二、四、六，适用于香港本土，本站仅作结果展示与分析。国际开奖：每日一期（UTC 13:30），适用于国际，采用SHA-256种子哈希可验证公平系统。",
    aEn: "Hong Kong: Tue/Thu/Sat, for Hong Kong players. International: daily at UTC 13:30, for international players, using SHA-256 seed hash verifiable fairness.",
    link: "/rules",
  },
  {
    qZh: "波色是什么？怎么看号码的波色？",
    qEn: "What are wave colors? How do I check a number's wave color?",
    aZh: "49个号码分红蓝绿三色波：红波17个、蓝波16个、绿波16个。猜特码的波色是国际民间特色玩法之一。具体号码对应见「波色与五行」文章。",
    aEn: "All 49 numbers belong to Red (17), Blue (16), or Green (16) waves. Betting on the special number's wave is an International folk bet. See the Wave Colors & Five Elements article for the full mapping.",
    link: "/knowledge/wave-elements-guide",
  },
  {
    qZh: "本站提供投注服务吗？",
    qEn: "Does this site offer betting services?",
    aZh: "不提供。本站仅供资讯参考与分析教学，不提供任何投注、支付或资金托管服务。请遵守当地法律。18+。",
    aEn: "No. This site provides information and analysis only. We do not offer betting, payment, or escrow services. Obey local laws. 18+.",
    link: null,
  },
  {
    qZh: "国际开奖如何保证公平？",
    qEn: "How does the International draw ensure fairness?",
    aZh: "每期国际开奖前，系统公示SHA-256种子哈希。开奖后公布原始种子，任何人都可以验证 SHA-256(种子) 与公示哈希是否一致。结果可追溯、不可篡改。",
    aEn: "Before each International draw, a SHA-256 seed hash is published. After the draw, the raw seed is revealed. Anyone can verify that SHA-256(seed) matches the published hash. Results are traceable and tamper-proof.",
    link: null,
  },
  {
    qZh: "什么是三合、六合、六冲？",
    qEn: "What are Triad, Six Harmony, and Six Clash?",
    aZh: "三合：四个生肖组（水木火金），同组互为贵人。六合：六组最佳配对。六冲：六组对立关系。这三者是暗码分析的核心工具。详见生肖工具页的可视化图表。",
    aEn: "Triad: four zodiac groups (Water/Wood/Fire/Metal), members are natural allies. Six Harmony: six best-match pairs. Six Clash: six opposing pairs. These are the core tools of dark code analysis. See visual diagrams on the Zodiac Tools page.",
    link: "/zodiac",
  },
  {
    qZh: "本站内容多久更新一次？",
    qEn: "How often is the site updated?",
    aZh: "香港开奖：每期开奖后更新（周二/四/六）。国际开奖：每日UTC 13:30自动开奖更新。分析文章：每期六合皇信箱发布后进行精读分析并发布。知识库文章持续扩充。",
    aEn: "Hong Kong draws: updated after each draw (Tue/Thu/Sat). International draws: auto-drawn daily at UTC 13:30. Analysis articles: published after each Liu He Huang Mailbox issue. Knowledge base continuously expanding.",
    link: null,
  },
];

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isZh = locale === "zh";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-6">FAQ</h1>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <details key={i} className="rounded-lg border border-surface-border bg-surface-card group">
            <summary className="p-4 cursor-pointer text-gold font-medium hover:text-gold-light select-none">
              {isZh ? faq.qZh : faq.qEn}
            </summary>
            <div className="px-4 pb-4 text-sm text-text-muted leading-relaxed">
              <p>{isZh ? faq.aZh : faq.aEn}</p>
              {faq.link && (
                <Link
                  href={faq.link}
                  className="inline-block mt-2 text-xs text-gold-dim hover:text-gold no-underline"
                >
                  {isZh ? "了解更多 →" : "Learn more →"}
                </Link>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
