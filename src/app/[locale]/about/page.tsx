import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";
  return {
    title: isZh ? "关于我们 · 香港国际六合彩" : "About · Hong Kong International Mark Six",
    description: isZh ? "香港国际六合彩——面向全球华人的六合彩资讯门户。香港开奖与国际开奖双轨平级，专业解码教学。" : "HK International Mark Six — global Mark Six portal. Dual-track draws, expert decoding academy, bilingual content.",
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const isZh = locale === "zh";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold mb-6">
        {isZh ? "关于我们" : "About Us"}
      </h1>

      {/* Brand */}
      <section className="rounded-lg border border-surface-border bg-surface-card p-6 mb-6">
        <h2 className="text-xl text-gold mb-4">
          {isZh ? "品牌定位" : "Our Brand"}
        </h2>
        <p className="text-sm text-text-muted leading-relaxed mb-3">
          {isZh
            ? "香港国际六合彩是一个面向全球华人的六合彩资讯门户。香港开奖与国际开奖双轨平级——香港就是香港，不谈官方，只讲专业。"
            : "Hong Kong International Mark Six is a global Mark Six information portal for Chinese-speaking audiences worldwide. Hong Kong Draw and International Draw are equal tracks — we are Hong Kong Mark Six, period."}
        </p>
        <p className="text-sm text-text-muted leading-relaxed">
          {isZh
            ? "我们的使命：为海外华人提供最专业、最深度的六合彩资讯与分析。从玩法教学到红字解码，从暗码冲合到每期精读——这里是六合彩知识的终点站。"
            : "Our mission: to provide the most professional, in-depth Mark Six information and analysis for overseas Chinese communities. From gameplay guides to red character decoding, from dark code analysis to issue-by-issue deep reads — this is the destination for Mark Six knowledge."}
        </p>
      </section>

      {/* What makes us different */}
      <section className="rounded-lg border border-surface-border bg-surface-card p-6 mb-6">
        <h2 className="text-xl text-gold mb-4">
          {isZh ? "我们与普通开奖站有什么不同" : "What Makes Us Different"}
        </h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded border border-surface-border">
            <h3 className="text-gold font-semibold mb-2">
              {isZh ? "🔍 专业解码" : "🔍 Expert Decoding"}
            </h3>
            <p className="text-text-muted">
              {isZh
                ? "红字解码8+5法、暗码冲合体系——14年六合皇信箱传统，我们是唯一系统整理并公开教学的平台。"
                : "8+5 red character decoding methods, dark code clash system — 14 years of Liu He Huang Mailbox tradition, uniquely systematized and taught on our platform."}
            </p>
          </div>
          <div className="p-4 rounded border border-surface-border">
            <h3 className="text-gold font-semibold mb-2">
              {isZh ? "🌐 双轨开奖" : "🌐 Dual-Track Draws"}
            </h3>
            <p className="text-text-muted">
              {isZh
                ? "香港开奖（周二/四/六）+ 国际开奖（每日一期·可验证公平）双轨并行，一个站覆盖全部。"
                : "Hong Kong (Tue/Thu/Sat) + International (daily·verifiable fairness) — one site, both tracks."}
            </p>
          </div>
          <div className="p-4 rounded border border-surface-border">
            <h3 className="text-gold font-semibold mb-2">
              {isZh ? "📚 完整教学" : "📚 Complete Learning"}
            </h3>
            <p className="text-text-muted">
              {isZh
                ? "从零开始学六合彩——玩法教程、术语词典、解码学院，看完就能玩、就能自己分析。"
                : "Learn Mark Six from scratch — game rules, glossary, decoding academy. Read, play, analyze on your own."}
            </p>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="rounded-lg border border-surface-border bg-surface-card p-6 mb-6">
        <h2 className="text-xl text-gold mb-4">
          {isZh ? "公司信息" : "Company Information"}
        </h2>
        <dl className="space-y-3 text-sm">
          <div className="flex gap-2">
            <dt className="text-text-muted w-32 shrink-0">{isZh ? "运营主体" : "Operator"}:</dt>
            <dd className="text-text">{t("companyName")}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-text-muted w-32 shrink-0">{isZh ? "注册地" : "Jurisdiction"}:</dt>
            <dd className="text-text">{t("jurisdiction")}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-text-muted w-32 shrink-0">{isZh ? "注册号" : "Reg. Number"}:</dt>
            <dd className="text-text">{t("regNumber")}</dd>
          </div>
        </dl>
      </section>

      {/* Legal */}
      <section className="rounded-lg border border-gold/30 bg-surface-card p-6">
        <h2 className="text-xl text-gold mb-4">{t("noticeTitle")}</h2>
        <ul className="list-disc pl-5 text-sm text-text-muted space-y-2">
          <li>{isZh ? "本站仅供资讯参考，不提供投注或支付服务" : "Information only — no betting or payment services"}</li>
          <li>{isZh ? "请遵守当地法律。仅限18岁以上" : "Obey local laws. 18+ only"}</li>
          <li>{isZh ? "国际开奖采用可验证公平系统（SHA-256种子哈希）" : "International draws use verifiable fairness (SHA-256 seed hash)"}</li>
          <li>{isZh ? "香港开奖数据来自香港赛马会官方渠道" : "Hong Kong draw data sourced from HKJC official channels"}</li>
        </ul>
        <p className="text-xs text-text-muted/60 mt-4">
          {isZh
            ? "如有任何问题，请通过站点联系方式与我们取得联系。"
            : "For any inquiries, please contact us through the site's contact channels."}
        </p>
      </section>
    </div>
  );
}
