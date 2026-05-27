# ⚠️ Cursor 须知 — 项目状态清单

> 最后更新：2026-05-27 — 域名上线，后台登录打通，剩余写文件操作待兼容 Netlify

---

## ⛔ 已完成 — 禁止修改（除非主人明确要求）

### 🏗️ 核心架构
- [x] **双轨制**：香港开奖 + 国际开奖，全站统一岁数法，无固定生肖
- [x] **岁数法**：号码÷12=余数→生肖，每年以太岁轮转（2026马年）
- [x] **首页双卡片**：HkCardLive（5s轮询）+ IntlCardLive（7字圈动画）
- [x] **国际卡状态切换**：准备中→就绪中→LIVE广播→已发布，四段动画

### 🎥 实时开奖系统
- [x] 预置开奖号码 + Cron 自动广播（每天21:30北京）+ 90秒后发布
- [x] 号码逐个蹦出动画（700ms/球）

### 🔧 后台管理（12模块全部就绪）
- [x] 控制台 / 香港开奖 / 国际开奖 / 批量导入 / 数据导出
- [x] 文章管理（知识库 Markdown 编辑器）
- [x] 页面管理 / SEO管理 / 系统设置 / 管理员 / 数据备份 / 操作日志

### 🌐 页面
- [x] 首页 / 香港开奖结果 + 详情 / 国际开奖结果 + 详情 + LIVE
- [x] 分析：红字解码入门 / 暗码冲合指南 / 成语解码
- [x] 走势统计 / 生肖一览 / 玩法规则 / FAQ / 术语词典 / 关于
- [x] 知识库列表 + 文章详情页

### 🌍 双语 & SEO
- [x] 简体中文 + 英语，全站纯语言显示（不混杂）
- [x] 每页独立 SEO metadata（title/description）
- [x] sitemap / robots 自动生成

### 🔐 后台登录
- [x] JWT 认证 + 登录页（admin / admin）
- [x] Refresh token 改成自包含 JWT（不写文件，Netlify 兼容）
- [x] appendLog、ensureAdminsFile、saveAdmins 已加 try-catch（Netlify 只读 FS 降级）

### 🚀 部署
- [x] GitHub: intlsix/mark6-site
- [x] Netlify: silly-paprenjak-79940e.netlify.app
- [x] 域名: intlsix.com（GoDaddy NS→Netlify，DNS已通）
- [x] CI/CD: git push → Netlify 自动部署

---

## 🚧 待办 — Netlify 只读文件系统兼容（紧急）

**背景**：Netlify Functions 运行在只读文件系统上，任何 `fs.writeFileSync` 都会抛 EROFS。已修复的有 auth.ts 和 logs.ts。但后台其他模块还有 18 处写操作未处理。

**修复方式**：每个 `fs.writeFileSync(...)` 包上 try-catch，失败了 console.error 然后静默跳过。

### 需要改的文件和行号（共 6 个文件，18 处）：

#### 1. `src/lib/draw/scheduled-draws.ts`（2处）
- 第 33 行：`fs.writeFileSync(SCHED_PATH, ...)`
- 第 46 行：`fs.writeFileSync(SETTINGS_PATH, ...)`

#### 2. `src/lib/draw/live-draw.ts`（1处）
- 第 32 行：`fs.writeFileSync(LIVE_PATH, ...)`

#### 3. `src/lib/draw/hongkong.ts`（1处）
- 第 25 行：`fs.writeFileSync(DATA_PATH, ...)`

#### 4. `src/lib/draw/international.ts`（1处）
- 第 25 行：`fs.writeFileSync(DATA_PATH, ...)`

#### 5. `src/lib/admin/` 以下文件（共 9 处）
- `media.ts` 第 27 行、第 39 行
- `analytics.ts` 第 26 行
- `seo.ts` 第 28 行、第 39 行
- `articles.ts` 第 20 行
- `backup.ts` 第 48 行、第 93 行、第 111 行
- `pages.ts` 第 28 行、第 48 行
- `export.ts` 第 28 行

#### 6. `src/app/api/admin/import/route.ts`（1处）
- 第 21 行：`fs.writeFileSync(INTL_PATH, ...)`

### 改法示例
```typescript
// 改前
fs.writeFileSync(PATH, JSON.stringify(data, null, 2) + "\n", "utf8");

// 改后
try { fs.writeFileSync(PATH, JSON.stringify(data, null, 2) + "\n", "utf8"); } catch { /* read-only FS */ }
```

**规则**：
- 只包 `writeFileSync`，不动 `readFileSync` 和 `existsSync`
- 改完跑 `npx tsc --noEmit` 确认编译通过
- git commit，push，Netlify 自动部署

---

## 📋 规则（遵守，别问为什么）

1. **生肖只认岁数法**：全站没有固定生肖表，严禁写 01=鼠 02=牛 这种
2. **岁数法公式**：号码÷12=余数，太岁=余1，反向排列
3. **双语纯净化**：中文页不能有英文残留，英文页不能有中文残留
4. **首页双卡片不动**：布局、动画、轮询逻辑全部完成
5. **国际卡 7 字圈动画**：一字一圈，21:20→21:28→21:30 三段切换
6. **日期可编辑、数字输入去箭头、本页说明全删**
7. **修改范围**：只改主人说的，别顺手"优化"已完成的东西

---

## 🔗 关键路径

| 什么 | 在哪 |
|------|------|
| 文章内容 | `src/data/knowledge-base.json` |
| 翻译文件 | `messages/zh.json`, `messages/en.json` |
| SEO配置 | `src/data/admin/seo.json` |
| 香港开奖数据 | `src/data/hongkong/draws.json` |
| 国际开奖数据 | `src/data/international/draws.json` |
| 系统设置 | `src/data/admin/settings.json` |
| 实时广播状态 | `src/data/international/live-draw.json` |
| 预置开奖 | `src/data/international/scheduled-draws.json` |
| 完整框架文档 | 桌面 `MARK6_SITE_FRAMEWORK_v6.md` |
