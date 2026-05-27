#!/usr/bin/env python3
"""
香港开奖自动采集脚本
数据源: https://tbjl.sxhwqc.com:2025/hk.html
用法: python3 fetch_hk_draws.py

自动从采集页抓取最新香港开奖数据，写入 draws.json。
同时保留手动录入功能——如果采集失败，手动录入不受影响。
"""
import json, os, re, sys
from datetime import datetime
from urllib.request import urlopen, Request
import ssl

SOURCE_URL = None  # will be read from settings
SETTINGS_PATH = os.path.expanduser("~/mark6-site/src/data/admin/settings.json")
DRAWS_PATH = os.path.expanduser("~/mark6-site/src/data/hongkong/draws.json")

def get_scrape_url():
    """从 settings.json 读取采集源URL"""
    try:
        with open(SETTINGS_PATH, 'r') as f:
            settings = json.load(f)
        return settings.get("hkScrapeUrl", "")
    except:
        return ""

def fetch_page():
    """绕过SSL验证获取页面"""
    url = get_scrape_url()
    if not url:
        print("  ❌ 未配置采集源URL（settings.json 中 hkScrapeUrl 为空）")
        sys.exit(1)
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    })
    with urlopen(req, context=ctx, timeout=15) as resp:
        return resp.read().decode("utf-8", errors="replace")

def parse_draws(html):
    """从HTML中解析开奖数据"""
    draws = []
    
    # 解码HTML实体
    html = html.replace("&#26399;", "期").replace("&#24320;", "开")
    html = html.replace("&#22870;", "奖").replace("&#35760;", "记")
    html = html.replace("&#24405;", "录").replace("&#26085;", "日")
    
    # 找所有数字球 (ball-N 类)
    # 模式: <... class="...ball-N...">N<... 
    # N范围: 1-49
    ball_pattern = re.findall(r'class="[^"]*ball-(\d{1,2})[^"]*"[^>]*>[\s]*(\d{1,2})', html)
    
    if not ball_pattern:
        # 尝试另一种模式
        ball_pattern = re.findall(r'ball-(\d{1,2})[^"]*"[^>]*>(\d{1,2})', html)
    
    if not ball_pattern:
        return []
    
    # 查找期号和日期
    period_match = re.search(r'(\d{4}[-_]\d{2,3})\s*期', html)
    date_match = re.search(r'(\d{4}[-/]\d{2}[-/]\d{2})', html)
    
    period = period_match.group(1) if period_match else None
    date_str = date_match.group(1).replace("/", "-") if date_match else datetime.now().strftime("%Y-%m-%d")
    
    # 收集号码
    numbers = []
    special = None
    
    for cls, num in ball_pattern:
        n = int(num)
        if 1 <= n <= 49:
            if "ball-0" not in cls:  # ball-0 是占位符
                numbers.append(n)
    
    # 去重并排序
    numbers = sorted(set(numbers))
    
    # 通常最后一个是特码,第一个7个是开奖号
    if len(numbers) >= 7:
        main_nums = numbers[:6]
        special = numbers[6]
    elif len(numbers) >= 6:
        main_nums = numbers[:6]
    else:
        return []
    
    if period:
        return [{
            "id": period,
            "drawAt": date_str,
            "numbers": main_nums,
            "special": special,
            "source": "auto"
        }]
    
    return []

def main():
    print(f"[{datetime.now().strftime('%H:%M:%S')}] 采集香港开奖数据...")
    
    try:
        html = fetch_page()
    except Exception as e:
        print(f"  ❌ 网络错误: {e}")
        sys.exit(1)
    
    new_draws = parse_draws(html)
    
    if not new_draws:
        print("  ℹ️  未检测到新开奖数据（可能非开奖日）")
        sys.exit(0)
    
    # 加载现有数据
    try:
        with open(DRAWS_PATH, 'r') as f:
            existing = json.load(f)
    except:
        existing = []
    
    existing_ids = {d['id'] for d in existing}
    added = 0
    
    for draw in new_draws:
        if draw['id'] not in existing_ids:
            existing.insert(0, draw)
            existing_ids.add(draw['id'])
            added += 1
            print(f"  ✅ 新增: {draw['id']} | {draw['drawAt']} | {' '.join(str(n).zfill(2) for n in draw['numbers'])} + {str(draw['special']).zfill(2)}")
    
    if added == 0:
        print(f"  ℹ️  {new_draws[0]['id']} 已存在，跳过")
        sys.exit(0)
    
    # 按日期倒序
    existing.sort(key=lambda d: d['drawAt'], reverse=True)
    
    with open(DRAWS_PATH, 'w') as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)
    
    print(f"  📊 香港开奖共 {len(existing)} 期")
    sys.exit(0)

if __name__ == "__main__":
    main()
