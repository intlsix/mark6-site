#!/usr/bin/env python3
"""
香港开奖数据录入
用法: python3 add_hk_draw.py <期号> <日期YYYY-MM-DD> <n1> <n2> <n3> <n4> <n5> <n6> <特码>

例: python3 add_hk_draw.py 2026-057 2026-05-28 5 12 18 23 31 42 15
"""
import json, sys, os

DRAWS_PATH = os.path.expanduser("~/mark6-site/src/data/hongkong/draws.json")

def main():
    if len(sys.argv) < 10:
        print("用法: python3 add_hk_draw.py <期号> <日期> <6平码...> <特码>")
        print("例: python3 add_hk_draw.py 2026-057 2026-05-28 5 12 18 23 31 42 15")
        sys.exit(1)
    
    period = sys.argv[1]
    date = sys.argv[2]
    numbers = [int(x) for x in sys.argv[3:9]]
    special = int(sys.argv[9])
    
    if len(numbers) != 6:
        print("错误：需要6个平码")
        sys.exit(1)
    
    draw = {
        "id": period,
        "drawAt": date,
        "numbers": numbers,
        "special": special,
        "source": "manual"
    }
    
    try:
        with open(DRAWS_PATH, 'r') as f:
            draws = json.load(f)
    except:
        draws = []
    
    # 检查重复
    if any(d['id'] == period for d in draws):
        print(f"⚠️  {period} 已存在，跳过")
        sys.exit(0)
    
    draws.insert(0, draw)  # 最新在前
    draws.sort(key=lambda d: d['drawAt'], reverse=True)
    
    with open(DRAWS_PATH, 'w') as f:
        json.dump(draws, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 已录入: {period}")
    print(f"   日期: {date}")
    print(f"   平码: {' '.join(str(n).zfill(2) for n in numbers)}")
    print(f"   特码: {str(special).zfill(2)}")
    print(f"   香港开奖共 {len(draws)} 期")

if __name__ == "__main__":
    main()
