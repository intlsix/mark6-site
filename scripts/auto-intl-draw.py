#!/usr/bin/env python3
"""Daily international auto-draw for intlsix.com.
Runs at 21:30 Beijing time (13:30 UTC) every day.
Generates a random draw, writes to draws.json, updates schedule-settings.json.
Then git commit + push triggers Netlify deployment.
"""
import json
import hashlib
import os
import random
from datetime import datetime, timezone

PROJECT_DIR = "/home/win-hermes/mark6-site"
DRAWS_FILE = "src/data/international/draws.json"
SETTINGS_FILE = "src/data/international/schedule-settings.json"


def sha256(s: str) -> str:
    return hashlib.sha256(s.encode()).hexdigest()


def generate_seed() -> str:
    return hashlib.sha256(os.urandom(32)).hexdigest()


def draw_numbers(seed: str) -> tuple:
    """Draw 6 numbers + 1 special from 1-49 using seed."""
    h = sha256(seed)
    pool = list(range(1, 50))
    picked = []
    offset = 0
    while len(picked) < 7 and offset < len(h):
        piece = h[offset:offset+4]
        offset += 4
        try:
            val = int(piece, 16)
        except ValueError:
            continue
        idx = val % len(pool)
        picked.append(pool.pop(idx))
    while len(picked) < 7:
        idx = random.randint(0, len(pool) - 1)
        picked.append(pool.pop(idx))
    numbers = sorted(picked[:6])
    special = picked[6]
    return numbers, special


def load_json(rel_path: str):
    path = os.path.join(PROJECT_DIR, rel_path)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(rel_path: str, data):
    path = os.path.join(PROJECT_DIR, rel_path)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def main():
    os.chdir(PROJECT_DIR)

    # Sync from GitHub first to avoid numbering conflicts
    os.system("git pull origin main 2>/dev/null")

    now = datetime.now(timezone.utc)
    today_str = now.strftime("%Y-%m-%d")
    draw_time_str = f"{today_str}T13:30:00.000Z"

    # Check if today's draw already exists
    draws = load_json(DRAWS_FILE)
    for d in draws:
        if d.get("drawAt", "").startswith(today_str):
            print(f"SKIP: draw for {today_str} already exists ({d['id']})")
            return

    # Get next period ID
    settings = load_json(SETTINGS_FILE)
    next_period = settings.get("nextPeriod", "").strip()
    if next_period:
        base_num = int(next_period)
        # Find max existing for current year
        year = now.year
        max_existing = 0
        for d in draws:
            if d["id"].startswith(f"{year}-"):
                try:
                    num = int(d["id"].split("-")[1])
                    max_existing = max(max_existing, num)
                except (ValueError, IndexError):
                    pass
        base_num = max(base_num, max_existing + 1)
        draw_id = f"{year}-{base_num:03d}"
        # Increment for next draw
        settings["nextPeriod"] = str(base_num + 1)
    else:
        # Auto-generate from existing draws
        year = now.year
        max_num = 0
        for d in draws:
            if d["id"].startswith(f"{year}-"):
                try:
                    num = int(d["id"].split("-")[1])
                    max_num = max(max_num, num)
                except (ValueError, IndexError):
                    pass
        draw_id = f"{year}-{max_num + 1:03d}"

    # Generate draw
    seed = generate_seed()
    numbers, special = draw_numbers(seed)

    draw_record = {
        "id": draw_id,
        "drawAt": draw_time_str,
        "numbers": numbers,
        "special": special,
        "seed": seed,
        "seedHash": sha256(seed),
        "source": "auto",
    }

    # Write draws
    draws.append(draw_record)
    draws.sort(key=lambda d: d["drawAt"], reverse=True)
    save_json(DRAWS_FILE, draws)

    # Write settings
    save_json(SETTINGS_FILE, settings)

    print(f"OK: generated {draw_id} | numbers={numbers} | special={special}")
    print(f"    drawAt={draw_time_str} | nextPeriod={settings.get('nextPeriod')}")

    # Git commit + push
    commit_msg = f"auto: international draw {draw_id}"
    os.system(f"git add {DRAWS_FILE} {SETTINGS_FILE}")
    os.system(f"git commit -m '{commit_msg}'")
    os.system("git push")
    print(f"PUSHED: {commit_msg}")


if __name__ == "__main__":
    main()
