# MARK6 SITE FRAMEWORK v5

## 香港国际六合彩 / Hong Kong International Mark Six

---

## 1. TECH STACK

- **Framework**: Next.js 14.2.28 (App Router)
- **Language**: TypeScript
- **i18n**: next-intl (zh + en)
- **Styling**: Tailwind CSS (custom theme in tailwind.config.ts)
- **Data**: JSON files (no database)
- **Charts**: Recharts (用于走势页面)
- **Auth**: Simple JWT-based admin auth (no OAuth)

## 2. PROJECT STRUCTURE

```
mark6-site/
├── messages/
│   ├── zh.json          # 中文翻译
│   └── en.json          # English translations
├── src/
│   ├── app/
│   │   ├── [locale]/    # 前台页面 (zh/en)
│   │   │   ├── page.tsx          # 首页
│   │   │   ├── results/
│   │   │   │   ├── hongkong/     # 香港开奖列表+详情
│   │   │   │   └── international/ # 国际开奖列表+详情
│   │   │   ├── trends/           # 走势分析
│   │   │   ├── zodiac/           # 生肖工具+查询
│   │   │   ├── rules/            # 玩法规则
│   │   │   ├── knowledge/        # 知识库/论坛帖子
│   │   │   └── analysis/         # 已废弃(页面保留但导航已移除)
│   │   ├── admin/         # 后台管理
│   │   ├── api/           # API routes
│   │   └── layout.tsx     # 全局 layout
│   ├── components/
│   │   ├── layout/        # Header, Footer, LangSwitcher, etc.
│   │   ├── mark6/         # DrawBalls, ZodiacGrid, NumberBall, etc.
│   │   ├── results/       # ResultsList
│   │   └── admin/         # DrawForm, ArticleEditor, PageEditor, etc.
│   ├── lib/
│   │   ├── draw/          # HK & International draw data CRUD
│   │   ├── admin/         # Admin auth, logs, articles CRUD, pages CRUD
│   │   └── mark6/         # Core: zodiac, suishufa, waves, constants
│   └── i18n/              # next-intl routing config
├── public/                # Static assets
└── src/data/              # JSON data files
    ├── hongkong/draws.json
    ├── international/draws.json
    └── admin/ (articles.json, pages.json, etc.)
```

## 3. KEY PAGES & FEATURES

### 首页 (/)
- 双语标题 + 香港/国际开奖卡片
- 显示最新一期号码 (波色球)
- "精选文章"已移除

### 香港开奖 (/results/hongkong)
- 列表页: 显示筛选控件(10/50/100期/按年份)
- 详情页: `/results/hongkong/[id]` - 号码+波色
- 数据来源: src/data/hongkong/draws.json (后台手动录入)
- 默认排期: 周二/四/六 (可后台修改日期)
- 波色显示: 通过 DrawBalls 组件渲染

### 国际开奖 (/results/international)
- 同香港开奖结构
- 定时自动开奖: UTC 12:00 / 北京 20:00
- 岁数法显示生肖
- SHA-256 种子可验证公平机制

### 走势分析 (/trends)
- 柱状图 (Top 20 频率)
- 热力图 (1-49 冷热号)
- ⚠️ **只统计当年(2026年001期起)的数据**

### 生肖工具 (/zodiac)
- 固定生肖表
- 岁数法网格 (动物名+号码平齐显示)
- 三合/六合/六冲关系图
- 生肖查询 (/zodiac/lookup):
  - 输入号码查生肖+太岁关系+化解方法+运势
  - 支持中英文切换

### 生肖查询 - 核心逻辑
- **岁数法**: 号码÷12取余=岁数，太岁为余1，按地支反向排列
- **2026马年**: 1马2蛇3龙4兔5虎6牛7鼠8猪9狗10鸡11猴12羊
- **太岁关系**: 值太岁(马)、冲太岁(鼠)、害太岁(牛)、破太岁(兔)、刑太岁(马自刑)
- **化解方法**: 每条太岁关系有对应英文翻译的化解建议
- **运势数据**: traits/luckyNums/luckyColors/match/clash/yearFortune

### 玩法规则 (/rules)
- 香港规则: 基本规则+玩法一览 (已移除生肖/波色对照表)
- 国际规则: 同上 + LegalNotice + 民间特色玩法
- 样式: 卡片装饰 (rounded-lg border bg-surface-card p-6)

### 知识库/论坛帖子 (/knowledge)
- 列表: 帖子标题+日期 (简洁论坛样式)
- 详情: `/knowledge/[id]` - 独立页面+SEO metadata
- 后台 admin/articles 发帖
- **自动翻译**: 文章编辑器有"🔄 自动翻译成英文"按钮 (调 Google Translate API)

## 4. TRANSLATION SYSTEM

### 文件
- `messages/zh.json` - 中文
- `messages/en.json` - English

### 命名空间
| Namespace | 用途 |
|-----------|------|
| nav | 导航栏 |
| brand | 品牌名 |
| home | 首页 |
| results | 开奖结果页 |
| zodiac | 生肖工具页 |
| lookup | 生肖查询 |
| trends | 走势 |
| rules | 玩法规则 |
| knowledge | 知识库 |
| fortune | 12生肖运势 (traits + yearFortune) |
| colors | 幸运颜色英文名 |
| waves | 波色 (红波/蓝波/绿波) |
| animals | 12生肖英文名 |
| common | 通用 (breadcrumb, readMore, back) |
| relations | 冲合关系 |
| legal | 法律声明 |
| usage | 页面说明 (已不显示但仍保留) |

### 关键翻译规则
- 动物名: 通过 `<AnimalLabel animal={...} />` 或 `ta()` 翻译
- 波色: 通过 `tw(numToWave(n))` 或 `useTranslations("waves")`
- 幸运颜色: 通过 `tc(colorKey)` 或 `useTranslations("colors")`
- FORTUNE 数据(traits/yearFortune): 通过 `tf(key)` 或 `useTranslations("fortune")`

## 5. DATA FILES

```
src/data/
├── hongkong/
│   └── draws.json        # 香港开奖数据 [DrawRecord[]]
├── international/
│   └── draws.json        # 国际开奖数据 [DrawRecord[]]
└── admin/
    ├── articles.json     # 文章/帖子 [KnowledgeArticle[]]
    ├── pages.json        # 静态页面 (about, terms, etc.)
    ├── admins.json       # 管理员账号
    ├── logs.json         # 操作日志
    └── settings.json     # 站点设置
```

### DrawRecord 类型
```typescript
interface DrawRecord {
  id: string;        // "2026-001"
  drawAt: string;    // ISO date
  numbers: number[]; // 6平码
  special: number;   // 特码
  seedHash?: string;  // 国际开奖种子哈希
  seed?: string;      // 国际开奖公布种子
  source?: "auto" | "manual";
}
```

### KnowledgeArticle 类型
```typescript
interface KnowledgeArticle {
  id: string;
  category: string;
  titleZh: string;
  titleEn: string;
  excerptZh: string;
  excerptEn: string;
  contentZh: string;
  contentEn: string;
  published: boolean;
  updatedAt: string;
}
```

## 6. API ROUTES

| 路由 | 方法 | 说明 |
|------|------|------|
| /api/public/draws | GET | 获取所有开奖数据 |
| /api/translate | POST | 中译英 (Google Translate) |
| /api/admin/hk-draws | GET/POST/PUT/DELETE | 香港开奖CRUD (需auth) |
| /api/admin/intl-draws | GET/POST/PUT/DELETE | 国际开奖CRUD (需auth) |
| /api/admin/articles | GET/POST/DELETE | 文章CRUD (需auth) |
| /api/admin/pages | GET/POST | 静态页面CRUD (需auth) |
| /api/admin/login | POST | 管理员登录 |
| /api/admin/scrape | POST | 触发自动采集 |
| /api/cron/international-draw | GET | 国际开奖定时任务 |

## 7. BUILD & DEPLOYMENT NOTES ⚠️

### 开发模式 (推荐本地测试)
```bash
npx next dev -p 3000
```
- 无缓存，改代码即生效
- 端口建议用 3000

### 生产构建
```bash
npx next build
npx next start
```

### ⚠️ 已知问题: 旧进程占端口
每次 `next build` + `next start`，如果旧进程还活着，新进程起不来。
**解决方法**: 先 kill 旧进程再启动:
```bash
fuser -k 3000/tcp
npx next start
```

### 构建缓存问题
多次 `next build` 可能导致 HTML 引用的 JS 文件名和实际文件 hash 不匹配。
解决方法: 清 `.next/cache` 后重新构建:
```bash
rm -rf .next/cache && npx next build
```

## 8. ADMIN PANEL

- 访问: /zh/admin 或 /en/admin
- 默认登录: 需先在 admins.json 配置
- 功能:
  - Hong Kong Draws: 手动录入/编辑/删除开奖数据
  - International Draws: 管理国际开奖
  - Articles: 发帖 (支持自动翻译英文)
  - Pages: 静态页面管理
  - Media: 媒体上传
  - Settings: 站点设置
  - Backup: 数据备份
  - Logs: 操作日志

## 9. NAVIGATION (当前)

首页 → 香港开奖 → 国际开奖 → 走势 → 生肖工具 → 玩法规则 → 知识库

"分析" 已从导航移除。

## 10. SPECIAL NOTES

### 走势只统计当年
TrendsClient 通过 `filterByYear(draws, CURRENT_YEAR)` 过滤
从当前年份的 001 期开始统计，跨年重置。

### 岁数法 vs 固定生肖
- 香港开奖: 固定生肖 (01=鼠, 02=牛...)
- 国际开奖: 岁数法 (2026年马=余1)
- 生肖查询: 两种都展示

### 文章/帖子上传流程
1. admin/articles → 新建
2. 填写中文标题/摘要/内容
3. 点击 "🔄 自动翻译成英文"
4. 检查英文版，手动调整
5. 点击"发布"
6. 前台 knowledge 页面显示

### 后台文章编辑器
- 支持自动翻译 (Google Translate API)
- 翻译按钮: "🔄 自动翻译成英文"
- 可保存草稿或直接发布
