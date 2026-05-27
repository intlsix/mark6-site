# Hong Kong International Mark Six (HKIMS)

Bilingual Mark Six information site — Next.js 14 + next-intl + Recharts.

## URLs

- English: http://localhost:3000/en
- 中文: http://localhost:3000/zh

## Start

```bash
cd mark6-site
npm install
npm run dev
```

## v2 core rules

1. **波色** — each number 1–49 has fixed red/blue/green (`WAVE_COLORS` / `WAVE_HEX`)
2. **岁数法** — backward cycle `(tsIndex - i + 12) % 12`, not forward `+i`
3. **暗码冲合** — uses age-method zodiac only
4. **i18n** — `/en` and `/zh` via next-intl

## Data

Edit JSON under `src/data/` (results, idiom library, knowledge base).
