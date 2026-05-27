#!/usr/bin/env python3
"""
新闻加工流水线
用法: python3 news_pipeline.py <标题> <来源> < <新闻正文>

大陆六合彩新闻 → 主人体系加工 → 知识库文章
"""
import json, sys, os
from datetime import datetime, timezone

KB_PATH = os.path.expanduser("~/mark6-site/src/data/knowledge-base.json")

TEMPLATE_ZH = """## {title}

*来源：{source} · 经本站分析加工*

{body}

---

### 解码视角

{analysis}

---

*本站对新闻事实进行独立分析解读，内容经深度加工。原始信息来自中国大陆六合彩资讯平台。*
"""

TEMPLATE_EN = """## {title_en}

*Source: {source} · Analyzed by our team*

{body_en}

---

### Decoding Perspective

{analysis_en}

---

*Our analysis is independently processed from mainland Chinese Mark Six information sources.*
"""

def main():
    title = sys.argv[1] if len(sys.argv) > 1 else "六合彩资讯"
    source = sys.argv[2] if len(sys.argv) > 2 else "综合来源"
    body = sys.stdin.read().strip()
    
    if not body:
        print("用法: echo '新闻正文' | python3 news_pipeline.py '标题' '来源'")
        sys.exit(1)
    
    article_id = f"news-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    now = datetime.now(timezone.utc).isoformat()
    
    # 加载现有文章
    try:
        with open(KB_PATH, 'r') as f:
            articles = json.load(f)
    except:
        articles = []
    
    article = {
        "id": article_id,
        "category": "news",
        "titleZh": title,
        "titleEn": f"Mark Six News: {title[:60]}",
        "excerptZh": body[:150].replace('\n', ' '),
        "excerptEn": f"Latest Mark Six news analysis. {body[:100]}",
        "contentZh": TEMPLATE_ZH.format(
            title=title,
            source=source,
            body=body,
            analysis="（分析待补充——请结合当期红字/暗码数据进一步加工）"
        ),
        "contentEn": TEMPLATE_EN.format(
            title_en=f"Mark Six: {title[:60]}",
            source=source,
            body_en=body[:500],
            analysis_en="(Analysis pending — to be supplemented with current issue data)"
        ),
        "published": False,  # 草稿，需人工审核后发布
        "updatedAt": now
    }
    
    articles.append(article)
    
    with open(KB_PATH, 'w') as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 新闻草稿已保存: {article_id}")
    print(f"   状态: 未发布（需后台审核）")
    print(f"   标题: {title}")
    print(f"   知识库现有 {len(articles)} 篇")

if __name__ == "__main__":
    main()
