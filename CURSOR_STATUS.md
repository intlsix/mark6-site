# ⚠️ Cursor 须知 — 项目状态清单

> 最后更新：2026-05-27 — Netlify Blobs 持久化已接入

---

## ⛔ 已完成 — 禁止修改

- **全站架构**：双轨制、岁数法、首页双卡片、国际卡动画
- **所有页面**：开奖结果/详情/LIVE、分析、走势、生肖、知识库、FAQ、术语
- **后台12模块**：控制台、录入开奖、导入导出、文章/页面/SEO/设置/管理员/日志
- **登录认证**：JWT（自包含 refresh token，Netlify 兼容）
- **双语+SEO**：简中/英语纯净化、每页独立 SEO
- **部署**：intlsix.com（GoDaddy NS→Netlify）、git push 自动部署
- **数据**：56 期香港开奖、147 期国际开奖
- **Netlify 持久化**：`@netlify/blobs` + `src/lib/storage/json-store.ts`（线上写 blob，本地写 `src/data/`）
- **香港开奖日期**：`draws.json` 已按周二/四/六真实开奖日回溯修正（056 = 2026-05-26）
- **首页知识板块**：最新分析（analysis×3）+ 热门文章（guide×3），`getPublishedByCategory`

---

## 🚧 待办

### 媒体上传（次要）

Netlify 上 `public/uploads/` 仍不可写；后台媒体库元数据可存 blob，但**图片二进制上传**需后续改为 Blob 二进制或外部 CDN。

### 首次部署后 blob 为空时

线上读不到 git 里的 `src/data/*` 时，会从磁盘 fallback；后台第一次保存后写入 blob。如需把 git 数据种子进 blob，可在 Netlify 后台跑一次备份创建或写一次性迁移脚本。

---

## ✅ 已确认 — 国际 cron

- `schedule-settings.json` → `nextPeriod: "148"`
- `draws.json` → **147** 条，`2026-001` … `2026-147`
- `runCronInternationalDraw`：当日已有记录则跳过；`nextIntlDrawId` 用 148 生成 `2026-148` 后把 `nextPeriod` 递增为 `149`
- **明天 cron 不会与 147 重复**，将正常新增 148 期

---

## 📋 铁律

1. **全站岁数法**，无固定生肖
2. **双语纯净化**：中文页无英文，英文页无中文
3. **首页双卡片不动**
4. **号码公式**：号码÷12=余数→岁数→生肖
5. **只改任务清单里的**，别顺手优化已完成的东西
6. **改完必须**：`npx tsc --noEmit` 通过 + git push

---

## 🔗 关键路径

| 什么 | 在哪 |
|------|------|
| 存储抽象 | `src/lib/storage/json-store.ts` |
| 文章内容 | blob key `knowledge-base.json` / `src/data/knowledge-base.json` |
| 翻译 | `messages/zh.json` `messages/en.json` |
| SEO | `admin/seo.json` |
| 香港数据 | `hongkong/draws.json` |
| 国际数据 | `international/draws.json` |
| 系统设置 | `admin/settings.json` |
| 期号设置 | `international/schedule-settings.json` |
