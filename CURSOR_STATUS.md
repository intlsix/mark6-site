# ⚠️ Cursor 须知 — 项目状态清单

> 最后更新：2026-05-27 — 数据就绪，后台持久化待解决

---

## ⛔ 已完成 — 禁止修改

- **全站架构**：双轨制、岁数法、首页双卡片、国际卡动画
- **所有页面**：开奖结果/详情/LIVE、分析、走势、生肖、知识库、FAQ、术语
- **后台12模块**：控制台、录入开奖、导入导出、文章/页面/SEO/设置/管理员/日志
- **登录认证**：JWT（自包含 refresh token，Netlify 兼容）
- **双语+SEO**：简中/英语纯净化、每页独立 SEO
- **部署**：intlsix.com（GoDaddy NS→Netlify）、git push 自动部署
- **数据**：56 期香港开奖、147 期国际开奖
- **18 处 writeFileSync**：全部包了 try-catch（Netlify 不崩）

---

## 🚧 待办

### 1. Netlify 后台数据持久化（重要）

**问题**：Netlify Functions 文件系统只读。后台所有写入操作（录入开奖、导入、保存文章、修改设置等）在线上静默失败——API 返回成功但不实际写入。本地 `npx next dev` 一切正常。

**方案建议**：
- 方案A：改用 **Netlify Blobs** 存储所有可变数据（draws, knowledge-base, settings 等）
- 方案B：数据操作全在本地 → git push → Netlify 自动部署（当前临时方案）
- 方案C：接一个外部数据库（Supabase/PlanetScale 免费层）

**需要改的文件**：
- 所有 `src/lib/draw/*.ts`（香港/国际开奖读写）
- 所有 `src/lib/admin/*.ts`（articles, pages, seo, settings, analytics, backup, media, export, logs）
- `src/app/api/admin/import/route.ts`

**要求**：选一个方案统一实现，改完本地 `npx tsc --noEmit` 确认编译通过、本地 `npx next dev` 测试写入正常再 push。

### 2. 开奖结果列表 — 日期修正

**问题**：56 期香港数据日期是按 3.5 天间隔估算的（2026-001 = 2025-11-15），不是真实日期。

**文件**：`src/data/hongkong/draws.json`

**要求**：把 drawAt 改成真实香港六合彩开奖日期（周二/四/六）。

### 3. 国际开奖数据去重

**问题**：明天 cron 自动生成 148 期会跟现有数据冲突。nextPeriod 已设 148。

**文件**：`src/data/international/schedule-settings.json`

**确认**：`nextPeriod` 是否为 "148"，`src/data/international/draws.json` 是否有 001-147。

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
| 文章内容 | `src/data/knowledge-base.json` |
| 翻译 | `messages/zh.json` `messages/en.json` |
| SEO | `src/data/admin/seo.json` |
| 香港数据 | `src/data/hongkong/draws.json` |
| 国际数据 | `src/data/international/draws.json` |
| 系统设置 | `src/data/admin/settings.json` |
| 完整文档 | 桌面 `MARK6_SITE_FRAMEWORK_v6.md`（已删除，此文件替代） |
