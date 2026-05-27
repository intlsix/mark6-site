#!/usr/bin/env python3
"""
每期精读 → 知识库自动发布
用法: python3 publish_analysis.py <分析文件.md> <期号>

将主人的精读分析自动转换为知识库文章，追加到 knowledge-base.json。
"""
import json, sys, os, re
from datetime import datetime, timezone

KB_PATH = os.path.expanduser("~/mark6-site/src/data/knowledge-base.json")

def extract_meta(content, issue_num):
    """从精读分析中提取标题和摘要"""
    lines = content.strip().split("\n")
    
    # 找红字
    red_char = ""
    for line in lines[:20]:
        m = re.search(r'红字[：:]\s*(\S+)', line)
        if m:
            red_char = m.group(1)
            break
    
    # 找结论
    conclusion = ""
    for line in lines:
        m = re.search(r'(?:结论|特肖)[：:]\s*(.+)', line)
        if m:
            conclusion = m.group(1).strip()
            break
    
    # 构建标题
    if red_char and conclusion:
        title_zh = f"{issue_num}期精读：{red_char} → {conclusion}"
    else:
        title_zh = f"{issue_num}期精读分析"
    
    title_en = f"Issue {issue_num} Deep Read Analysis"
    
    # 摘要：取前200字有意义内容
    excerpt_lines = []
    for line in lines[2:]:
        line = line.strip().lstrip('#').strip()
        if line and not line.startswith('**') and len(line) > 10:
            excerpt_lines.append(line)
        if len(''.join(excerpt_lines)) > 150:
            break
    excerpt_zh = ''.join(excerpt_lines)[:200]
    
    return {
        "title_zh": title_zh,
        "title_en": title_en,
        "excerpt_zh": excerpt_zh,
        "excerpt_en": f"Issue {issue_num} deep read analysis with red character decoding and dark code analysis."
    }

def main():
    if len(sys.argv) < 2:
        print("用法: python3 publish_analysis.py <分析文件.md> [期号]")
        sys.exit(1)
    
    filepath = sys.argv[1]
    issue_num = sys.argv[2] if len(sys.argv) > 2 else re.search(r'(\d+)期', os.path.basename(filepath))
    if issue_num and hasattr(issue_num, 'group'):
        issue_num = issue_num.group(1)
    elif isinstance(issue_num, str):
        pass
    else:
        issue_num = "000"
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    meta = extract_meta(content, issue_num)
    article_id = f"issue-{issue_num}-analysis"
    
    # Load existing articles
    try:
        with open(KB_PATH, 'r') as f:
            articles = json.load(f)
    except:
        articles = []
    
    # Remove existing same-id article if any
    articles = [a for a in articles if a['id'] != article_id]
    
    # Create new article
    article = {
        "id": article_id,
        "category": "analysis",
        "titleZh": meta['title_zh'],
        "titleEn": meta['title_en'],
        "excerptZh": meta['excerpt_zh'],
        "excerptEn": meta['excerpt_en'],
        "contentZh": content,
        "contentEn": f"## Issue {issue_num} Analysis\n\nFull Chinese analysis available in 中文 mode.",
        "published": True,
        "updatedAt": datetime.now(timezone.utc).isoformat()
    }
    
    articles.append(article)
    
    with open(KB_PATH, 'w') as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 已发布: {article_id}")
    print(f"   标题: {meta['title_zh']}")
    print(f"   知识库现有 {len(articles)} 篇文章")

if __name__ == "__main__":
    main()
