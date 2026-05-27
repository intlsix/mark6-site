import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return { title: "Red Character Decoding · 红字解码教学", description: "8 core + 5 advanced methods for decoding four-character red titles" };
}

export default async function IdiomLearnPage({ params }: { params: Promise<{ locale: string }> }) {
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
          {isZh ? "红字解码教学：8+5法全解" : "Red Character Decoding: 8+5 Methods"}
        </h1>
        <p className="text-sm text-text-muted mb-6">
          {isZh
            ? "六合皇信箱每期有一个四字红字标题（如057期「淚洒當場」）。这4个字中藏有当期特肖线索。以下13种手法逐一拆解。"
            : "Each issue of Liu He Huang Mailbox features a four-character red title (e.g. Issue 057「淚洒當場」). These four characters contain clues to the special zodiac. Here are all 13 methods."}
        </p>

        {/* 8 Core Methods */}
        <h2 className="text-xl text-gold mt-8 mb-4">
          {isZh ? "一、八种基本手法" : "I. Eight Core Methods"}
        </h2>

        {[
          {
            num: "①", zhName: "典故引申法", enName: "Allusion",
            zhDesc: "利用成语背后的历史典故指向生肖。",
            enDesc: "Uses the historical story behind the idiom to point to a zodiac.",
            zhEx: "火牛阵→牛、心猿→猴、叶公好龙→龙、守株待兔→兔、画蛇添足→蛇、亡羊补牢→羊",
            enEx: "Fiery Ox Formation → Ox, Heart Monkey → Monkey, Lord Ye's Dragon → Dragon"
          },
          {
            num: "②", zhName: "意象联想法", enName: "Imagery Association",
            zhDesc: "从红字描绘的视觉意象中提取生肖特征。",
            enDesc: "Extracts zodiac traits from the visual imagery of the red characters.",
            zhEx: "蛇蜕皮重生→蛇、龙腾飞→龙、凤鸣岐山→鸡（凤=鸡）",
            enEx: "Snake shedding skin → Snake, Dragon soaring → Dragon, Phoenix cry → Rooster"
          },
          {
            num: "③", zhName: "跑狗诗句意象法", enName: "Running Dog Poem",
            zhDesc: "跑狗图中的诗句映射特定生肖，需看图读诗。",
            enDesc: "The poem in the Running Dog illustration maps to a specific zodiac.",
            zhEx: "「旷野苍茫孤影独行」→虎（独行之王）、「油头光棍」→虎",
            enEx: "\"Lone shadow in vast wilderness\" → Tiger, \"Greasy bachelor\" → Tiger"
          },
          {
            num: "④", zhName: "行为特征法", enName: "Behavioral Traits",
            zhDesc: "用动物的典型行为特征来指向生肖。",
            enDesc: "Uses typical animal behaviors to identify the zodiac.",
            zhEx: "跺脚/倔强→牛、机灵善变→猴、温顺→羊/兔、嘴硬→狗",
            enEx: "Stomping/stubborn → Ox, Clever/adaptable → Monkey, Gentle → Goat/Rabbit"
          },
          {
            num: "⑤", zhName: "物品指向法", enName: "Object Reference",
            zhDesc: "红字中提到的物品与生肖的关联。",
            enDesc: "Objects mentioned in red characters link to zodiac animals.",
            zhEx: "卵=蛋→鸡、两足/禽→鸡、四足→牛/马/羊、角→牛/羊/龙",
            enEx: "Egg → Rooster, Two feet/bird → Rooster, Four feet → Ox/Horse/Goat"
          },
          {
            num: "⑥", zhName: "三合暗转法", enName: "Triad Transformation",
            zhDesc: "从一个生肖通过地支三合关系间接指向另一个生肖。",
            enDesc: "Routes through the Earthly Branch system from one zodiac to another via triad.",
            zhEx: "豕=猪→亥→亥卯未三合→羊。子=鼠→申子辰三合→龙/猴",
            enEx: "Pig (豕) → Hai → Hai-Mao-Wei triad → Goat. Rat (子) → Shen-Zi-Chen triad → Dragon/Monkey"
          },
          {
            num: "⑦", zhName: "谐音双关法", enName: "Pun / Homophone",
            zhDesc: "利用汉字的同音或近音关系指向生肖。",
            enDesc: "Uses Chinese homophones to redirect to zodiac animals.",
            zhEx: "福(蝠)→鼠、洒(殺)→鸡、牛反刍→重温旧梦→羊(旧地重游)",
            enEx: "Bat (蝠) sounds like fortune (福) → Rat. Kill (殺) sounds like sprinkle (洒) → Rooster"
          },
          {
            num: "⑧", zhName: "跑狗直接点名法", enName: "Direct Naming",
            zhDesc: "跑狗诗句中直接出现生肖名称。这是最直接的信号。",
            enDesc: "A zodiac animal is directly named in the Running Dog poem. The most straightforward signal.",
            zhEx: "跑狗诗中直接写「虎啸」「龙吟」「马奔」等",
            enEx: "Poem directly says \"Tiger roars\", \"Dragon chants\", \"Horse gallops\""
          },
        ].map(m => (
          <div key={m.num} className="mb-6 p-4 rounded border border-surface-border bg-surface/50">
            <h3 className="text-gold font-semibold mb-2">
              {m.num} {isZh ? m.zhName : m.enName}
              {isZh && <span className="text-text-muted/50 text-xs ml-2 font-normal">({m.enName})</span>}
            </h3>
            <p className="text-sm text-text-muted mb-1">{isZh ? m.zhDesc : m.enDesc}</p>
            <p className="text-xs text-text-muted/60 italic">{isZh ? `例：${m.zhEx}` : `Ex: ${m.enEx}`}</p>
          </div>
        ))}

        {/* 5 Advanced Methods */}
        <h2 className="text-xl text-gold mt-10 mb-4">
          {isZh ? "二、五种进阶手法" : "II. Five Advanced Methods"}
        </h2>
        <p className="text-sm text-text-muted mb-4">
          {isZh
            ? "以下手法在错误期深解中发现，超越传统8法："
            : "Discovered through deep analysis of error periods, beyond the core 8:"}
        </p>

        {[
          {
            num: "⑨", zhName: "现代引申义", enName: "Modern Extended Meaning",
            zhDesc: "红字的现代引申含义指向生肖。",
            enDesc: "The modern extended meaning of the red characters points to a zodiac.",
            zhEx: "「独占鳌头」→牛市→牛、「枯树生花」→枯木逢春→牛市→牛",
            enEx: "\"Top of the list\" → Bull market → Ox. \"Dead tree blooms\" → Spring → Bull market → Ox"
          },
          {
            num: "⑩", zhName: "时辰地支对应", enName: "Time-Branch Mapping",
            zhDesc: "红字中的时间意象对应十二地支时辰→生肖。",
            enDesc: "Time imagery in red characters maps to earthly branches → zodiac.",
            zhEx: "洒→西→酉时(17-19)→鸡。相逢恨晚→亥时(21-23)→猪。雷峰夕照→酉→鸡。金风送爽→酉金→鸡",
            enEx: "洒→West→You(酉) hour→Rooster. Sunset→You→Rooster. Late meeting→Hai(亥)→Pig"
          },
          {
            num: "⑪", zhName: "动物文化特征", enName: "Cultural Animal Traits",
            zhDesc: "利用生肖在中国传统文化中的象征意义。",
            enDesc: "Uses the zodiac animal's symbolic meaning in Chinese traditional culture.",
            zhEx: "「五德犖犖」→鸡有五德→鸡。「空穴来风」→虎啸生风→虎。「将勤补拙」→闻鸡起舞→鸡",
            enEx: "\"Five virtues\" → Rooster's five virtues → Rooster. \"Wind from empty cave\" → Tiger's roar → Tiger"
          },
          {
            num: "⑫", zhName: "自然现象+五行", enName: "Nature + Five Elements",
            zhDesc: "红字中的自然景象关联季节/五行→生肖。",
            enDesc: "Natural imagery links to season/element → zodiac.",
            zhEx: "「雷声大作」→春雷→卯月惊蛰→兔。「山寒水冷」→水→水肖→猪。「金风送爽」→金→金肖→鸡",
            enEx: "\"Thunder roars\" → Spring thunder → Mao month → Rabbit. \"Mountain cold\" → Water → Pig"
          },
          {
            num: "⑬", zhName: "读者信中藏线索", enName: "Reader Letter Clues",
            zhDesc: "当暗码未命中时（约11%），答案常藏在读者来信或署名中。",
            enDesc: "When dark codes miss (~11%), the answer is often hidden in reader letters or pen names.",
            zhEx: "署名「哈士奇」=狗✅。读者问「二月二龙抬头」→龙✅。读者名「客家鼠」→鼠✅。老总回「羊遇猪会发福」→猪✅",
            enEx: "Pen name \"Husky\" = Dog ✅. Letter asks about \"Dragon raising head\" → Dragon ✅. Editor replies \"Goat meets Pig\" → Pig ✅"
          },
        ].map(m => (
          <div key={m.num} className="mb-6 p-4 rounded border border-gold/20 bg-surface/50">
            <h3 className="text-gold font-semibold mb-2">
              {m.num} {isZh ? m.zhName : m.enName}
              {isZh && <span className="text-text-muted/50 text-xs ml-2 font-normal">({m.enName})</span>}
            </h3>
            <p className="text-sm text-text-muted mb-1">{isZh ? m.zhDesc : m.enDesc}</p>
            <p className="text-xs text-text-muted/60 italic">{isZh ? `例：${m.zhEx}` : `Ex: ${m.enEx}`}</p>
          </div>
        ))}

        {/* Key Principles */}
        <h2 className="text-xl text-gold mt-10 mb-4">
          {isZh ? "三、关键原则" : "III. Key Principles"}
        </h2>
        <div className="p-4 rounded border border-gold/30 bg-gold/5">
          <ul className="text-sm text-text-muted space-y-2 list-disc pl-5">
            {(isZh ? [
              "每期手法不重复——不能用固定公式套用",
              "必须精读全部六封信+老总回复后才下判断",
              "拆字是最直接的手法——如果一个字可以拆出生肖偏旁，不要忽略",
              "暗码是锚点(89%可靠)，红字是核心，两者结合可达95%以上覆盖率",
              "最明显的信号往往是陷阱——参考056/057期案例",
            ] : [
              "Methods vary per issue — no fixed formula",
              "Must read all six letters and editor replies before judging",
              "Character decomposition is most direct — never ignore a zodiac radical in a character",
              "Dark codes are anchors (89% reliable), red characters are core — together ~95% coverage",
              "The most obvious signal is often a trap — see Issue 056/057 case studies",
            ]).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </article>
    </div>
  );
}
