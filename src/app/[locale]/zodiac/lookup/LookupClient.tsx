"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { type Animal } from "@/lib/mark6/types";
import { numToAnimalStd } from "@/lib/mark6/zodiac";
import { decodeBySuiShuFa } from "@/lib/mark6/suishufa";
import { numToWave } from "@/lib/mark6/waves";
import { TAI_SUI, SANHE_GROUPS, LIUHE_PAIRS, LIUCHONG_PAIRS, HAI_TAI_SUI, PO_TAI_SUI, SELF_XING } from "@/lib/mark6/constants";
import NumberBall from "@/components/mark6/NumberBall";
import AnimalSvg from "@/components/mark6/AnimalSvg";
import AnimalLabel from "@/components/mark6/AnimalLabel";

// Structural fortune data (non-translatable)
const FORTUNE_DATA: Record<Animal, {
  luckyNums: number[];
  luckyColors: string[];
  match: Animal[];
  clash: Animal;
}> = {
  "鼠": { luckyNums: [2, 3], luckyColors: ["蓝色", "金色"], match: ["牛", "龙", "猴"], clash: "马" },
  "牛": { luckyNums: [1, 4], luckyColors: ["绿色", "红色"], match: ["鼠", "蛇", "鸡"], clash: "羊" },
  "虎": { luckyNums: [3, 6], luckyColors: ["橙色", "白色"], match: ["马", "狗", "猪"], clash: "猴" },
  "兔": { luckyNums: [4, 9], luckyColors: ["粉色", "紫色"], match: ["羊", "狗", "猪"], clash: "鸡" },
  "龙": { luckyNums: [5, 6], luckyColors: ["金色", "白色"], match: ["鼠", "猴", "鸡"], clash: "狗" },
  "蛇": { luckyNums: [2, 8], luckyColors: ["红色", "黑色"], match: ["牛", "鸡", "猴"], clash: "猪" },
  "马": { luckyNums: [3, 7], luckyColors: ["红色", "黄色"], match: ["虎", "狗", "羊"], clash: "鼠" },
  "羊": { luckyNums: [2, 7], luckyColors: ["绿色", "粉色"], match: ["兔", "马", "猪"], clash: "牛" },
  "猴": { luckyNums: [1, 8], luckyColors: ["白色", "蓝色"], match: ["鼠", "龙", "蛇"], clash: "虎" },
  "鸡": { luckyNums: [5, 9], luckyColors: ["金色", "红色"], match: ["牛", "龙", "蛇"], clash: "兔" },
  "狗": { luckyNums: [3, 4], luckyColors: ["黄色", "绿色"], match: ["虎", "兔", "马"], clash: "龙" },
  "猪": { luckyNums: [2, 5], luckyColors: ["粉色", "蓝色"], match: ["虎", "兔", "羊"], clash: "蛇" },
};

// 2026年岁数法映射 (准确，已验证)
const YEAR = 2026;
const TAI_SUI_ANIMAL = TAI_SUI[YEAR] || "马";

export default function LookupClient() {
  const t = useTranslations("lookup");
  const tw = useTranslations("waves");
  const tf = useTranslations("fortune");
  const tc = useTranslations("colors");
  const ta = useTranslations("animals");
  const [numStr, setNumStr] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const n = parseInt(numStr, 10);
  const hasValidNum = n >= 1 && n <= 49 && numStr !== "";

  // Get info from number using 岁数法 (2026)
  const info = useMemo(() => {
    if (!hasValidNum) return null;
    const sui = decodeBySuiShuFa(n, YEAR);  // 2026年岁数法
    const wave = numToWave(n);
    const data = FORTUNE_DATA[sui];
    const sanhe = SANHE_GROUPS.find(g => g.animals.includes(sui));
    const liuhe = LIUHE_PAIRS.find(p => p[0] === sui || p[1] === sui);
    const liuchong = LIUCHONG_PAIRS.find(p => p[0] === sui || p[1] === sui);
    return { sui, wave, data, sanhe, liuhe, liuchong };
  }, [n, hasValidNum]);

  const displayAnimal: Animal = selectedAnimal || info?.sui || "鼠";

  return (
    <div className="grid md:grid-cols-5 gap-6">
      {/* Left: number input + 岁数法映射表 */}
      <div className="md:col-span-2 space-y-4">
        <section className="rounded-lg border border-surface-border bg-surface-card p-4">
          <h2 className="text-lg text-gold mb-3">{t("byNumber")}</h2>
          <p className="text-xs text-text-muted mb-3">{t("inputPrompt", { year: YEAR })}</p>
          <input
            type="number"
            min={1}
            max={49}
            value={numStr}
            onChange={(e) => setNumStr(e.target.value)}
            placeholder={t("inputPlaceholder")}
            className="w-full rounded border border-surface-border bg-surface px-3 py-2 mb-4 text-text placeholder:text-text-muted/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {hasValidNum && info && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <NumberBall n={n} size="lg" />
                <div>
                  <span className="text-gold font-bold text-lg"><AnimalLabel animal={info.sui} /></span>
                  <span className="text-text-muted text-sm ml-2">{tw(info.wave)}</span>
                </div>
              </div>

              {/* 太岁关系 */}
              <div className="bg-surface/50 rounded p-3 text-sm">
                <p className="text-gold mb-1">{t("taiSuiTitle", { year: YEAR, animal: ta(TAI_SUI_ANIMAL) })}</p>
                <div className="text-xs text-text-muted space-y-0.5">
                  {info.sui === TAI_SUI_ANIMAL && <p>{t("zodiacYear")}</p>}
                  {info.liuchong && info.liuchong.includes(TAI_SUI_ANIMAL) && <p>{t("opposition")}</p>}
                  {HAI_TAI_SUI[TAI_SUI_ANIMAL] === info.sui && <p>{t("harm")}</p>}
                  {PO_TAI_SUI[TAI_SUI_ANIMAL] === info.sui && <p>{t("break")}</p>}
                  {SELF_XING.includes(info.sui) && info.sui === TAI_SUI_ANIMAL && <p>{t("selfPunish")}</p>}
                  {info.liuhe && (info.liuhe[0] === TAI_SUI_ANIMAL || info.liuhe[1] === TAI_SUI_ANIMAL) && <p>{t("union")}</p>}
                  {info.sanhe && info.sanhe.animals.includes(TAI_SUI_ANIMAL) && <p>{t("triad")}</p>}
                  {info.sui !== TAI_SUI_ANIMAL && HAI_TAI_SUI[TAI_SUI_ANIMAL] !== info.sui && PO_TAI_SUI[TAI_SUI_ANIMAL] !== info.sui && !(info.liuchong?.includes(TAI_SUI_ANIMAL)) && !(info.liuhe && (info.liuhe[0] === TAI_SUI_ANIMAL || info.liuhe[1] === TAI_SUI_ANIMAL)) && !(info.sanhe?.animals.includes(TAI_SUI_ANIMAL)) && <p>{t("averageYear")}</p>}
                </div>
              </div>

              {/* 化解太岁 */}
              <div className="bg-gold/5 border border-gold/20 rounded p-3 text-sm">
                <p className="text-gold mb-2">{t("resolve")}</p>
                <div className="text-xs text-text-muted space-y-1">
                  {info.sui === TAI_SUI_ANIMAL && (
                    <p>{t("remedyZhi")}{SANHE_GROUPS.find(g => g.animals.includes(TAI_SUI_ANIMAL))?.animals.filter(a => a !== TAI_SUI_ANIMAL).map(a => ta(a)).join("、")}{t("remedyZhi2")}</p>
                  )}
                  {info.liuchong && info.liuchong.includes(TAI_SUI_ANIMAL) && (
                    <p>{t("remedyChong")}{ta(LIUHE_PAIRS.find(p => p[0] === info.sui || p[1] === info.sui)?.filter(a => a !== info.sui)[0] || "")}{t("remedyChong2")}</p>
                  )}
                  {HAI_TAI_SUI[TAI_SUI_ANIMAL] === info.sui && (
                    <p>{t("remedyHai")}{info.sanhe?.animals.filter(a => a !== info.sui).map(a => ta(a)).join("、")}{t("remedyHai2")}</p>
                  )}
                  {PO_TAI_SUI[TAI_SUI_ANIMAL] === info.sui && (
                    <p>{t("remedyPo")}{ta(LIUHE_PAIRS.find(p => p[0] === info.sui || p[1] === info.sui)?.filter(a => a !== info.sui)[0] || "")}{t("remedyPo2")}</p>
                  )}
                  {SELF_XING.includes(info.sui) && info.sui === TAI_SUI_ANIMAL && (
                    <p>{t("remedyXing")}</p>
                  )}
                  {info.sui !== TAI_SUI_ANIMAL && HAI_TAI_SUI[TAI_SUI_ANIMAL] !== info.sui && PO_TAI_SUI[TAI_SUI_ANIMAL] !== info.sui && info.liuhe && (info.liuhe[0] === TAI_SUI_ANIMAL || info.liuhe[1] === TAI_SUI_ANIMAL) && (
                    <p>{t("remedyHe")}</p>
                  )}
                  {info.sui !== TAI_SUI_ANIMAL && HAI_TAI_SUI[TAI_SUI_ANIMAL] !== info.sui && PO_TAI_SUI[TAI_SUI_ANIMAL] !== info.sui && info.sanhe && info.sanhe.animals.includes(TAI_SUI_ANIMAL) && (
                    <p>{t("remedySanhe")}</p>
                  )}
                  {info.sui !== TAI_SUI_ANIMAL && HAI_TAI_SUI[TAI_SUI_ANIMAL] !== info.sui && PO_TAI_SUI[TAI_SUI_ANIMAL] !== info.sui && !(info.liuchong?.includes(TAI_SUI_ANIMAL)) && !(info.liuhe && (info.liuhe[0] === TAI_SUI_ANIMAL || info.liuhe[1] === TAI_SUI_ANIMAL)) && !(info.sanhe?.animals.includes(TAI_SUI_ANIMAL)) && (
                    <p>{t("remedyPing")}</p>
                  )}
                </div>
              </div>

              {/* 冲合关系 */}
              <div className="flex flex-wrap gap-1 text-xs">
                {info.sanhe && (
                  <span className="bg-emerald-900/40 text-emerald-100 rounded px-2 py-1">
                    {t("labelSanhe")}{info.sanhe.animals.filter(a => a !== info.sui).map(a => ta(a)).join("、")}
                  </span>
                )}
                {info.liuhe && (
                  <span className="bg-gold/20 text-gold-dim rounded px-2 py-1">
                    {t("labelLiuhe")}{ta(info.liuhe[0] === info.sui ? info.liuhe[1] : info.liuhe[0])}
                  </span>
                )}
                {info.liuchong && (
                  <span className="bg-red-900/40 text-red-100 rounded px-2 py-1">
                    {t("labelLiuchong")}{ta(info.liuchong[0] === info.sui ? info.liuchong[1] : info.liuchong[0])}
                  </span>
                )}
              </div>
            </div>
          )}
          {!hasValidNum && numStr !== "" && (
            <p className="text-red-400 text-sm">{t("invalidNumber")}</p>
          )}
        </section>
      </div>

      {/* Right: fortune info */}
      <div className="md:col-span-3">
        {(hasValidNum || selectedAnimal) ? (
          <section className="rounded-lg border border-surface-border bg-surface-card p-6 h-full">
            <div className="flex items-center gap-4 mb-4">
              <AnimalSvg animal={displayAnimal} size={64} />
              <div>
                <h2 className="text-xl text-gold font-bold"><AnimalLabel animal={displayAnimal} /></h2>
                <p className="text-xs text-text-muted">{t("ageMethod", { year: YEAR })}</p>
              </div>
            </div>

            {FORTUNE_DATA[displayAnimal] && (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gold mb-1">{t("charTraits")}</p>
                  <p className="text-text-muted">{tf(`${displayAnimal}.traits`)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gold mb-1">{t("luckyNums")}</p>
                    <div className="flex gap-1">
                      {FORTUNE_DATA[displayAnimal].luckyNums.map(x => <NumberBall key={x} n={x} size="sm" />)}
                    </div>
                  </div>
                  <div>
                    <p className="text-gold mb-1">{t("luckyColors")}</p>
                    <div className="flex flex-wrap gap-1">
                      {FORTUNE_DATA[displayAnimal].luckyColors.map(c => (
                        <span key={c} className="bg-surface-border rounded px-2 py-1 text-xs text-text-muted">{tc(c)}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-gold mb-1">{t("matchAnimals")}</p>
                  <div className="flex flex-wrap gap-2">
                    {FORTUNE_DATA[displayAnimal].match.map(a => (
                      <button key={a} type="button" onClick={() => setSelectedAnimal(a)}
                        className="flex flex-col items-center p-1 rounded bg-surface/50 hover:bg-surface-border transition">
                        <AnimalSvg animal={a} size={32} />
                        <span className="text-xs text-text-muted"><AnimalLabel animal={a} /></span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gold mb-1">{t("clashAnimal")}</p>
                  <button type="button" onClick={() => setSelectedAnimal(FORTUNE_DATA[displayAnimal].clash)}
                    className="flex items-center gap-2 p-2 rounded bg-red-900/40 hover:bg-red-900/60 transition">
                    <AnimalSvg animal={FORTUNE_DATA[displayAnimal].clash} size={32} />
                    <span className="text-red-400"><AnimalLabel animal={FORTUNE_DATA[displayAnimal].clash} /></span>
                  </button>
                </div>

                <div className="border-t border-surface-border pt-3">
                  <p className="text-gold mb-1">{t("yearFortune", { year: YEAR })}</p>
                  <p className="text-text-muted leading-relaxed">{tf(`${displayAnimal}.yearFortune`)}</p>
                </div>
              </div>
            )}

          </section>
        ) : (
          <section className="rounded-lg border border-dashed border-surface-border bg-surface-card/30 p-6 h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-text-muted/50 text-lg mb-2">🔍</p>
              <p className="text-text-muted/40 text-sm">{t("emptyPrompt")}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
