# hairsystemfinder.com — CLAUDE.md

## 项目概述

**产品**：男士发片沙龙垂直目录 — 全球首个专门收录 hair system 专业沙龙的目录站  
**域名**：hairsystemfinder.com  
**阶段**：方向A 极简验证 MVP，2周上线  
**核心假设**：发片沙龙愿意被收录；用户会主动搜索专门目录

---

## 基础设施

- **URL**：https://hairsystemfinder.com
- **GitHub**：captainpan007/hairsystemfinder
- **Railway**：hairsystemfinder-production.up.railway.app
- **本地路径**：F:\claude开发项目\hairsystemfinder
- **Cloudflare**：hairsystemfinder.com DNS 管理，Email Routing 已开启
- **Email Routing**：hello@hairsystemfinder.com → xiongmaopan7@gmail.com
- **Google Cloud Project**：aqueous-cabinet-410309

## 技术栈

- **框架**：Next.js SSG（`getStaticProps` + `getStaticPaths`）
- **数据**：`data/salons.json`（无数据库，无后端）
- **搜索**：fuse.js（客户端模糊搜索）
- **地图**：Google Maps 链接跳转（无 embed，无 API key 依赖）
- **邮件**：Resend（认领通知 + 用户订阅 + outreach）
- **部署**：Railway（Nixpacks，不用 Dockerfile）
- **域名**：hairsystemfinder.com（Cloudflare DNS）
- **分析**：Umami Cloud（替代 GA4 + Hotjar）
- **样式**：TailwindCSS

---

## 页面结构（仅3页）

```
pages/
├── index.js                    # 首页：Hero + 搜索框 + 城市快捷入口
├── salons/
│   ├── [city].js               # 城市列表：筛选 + 沙龙卡片网格
│   └── [city]/[slug].js        # 沙龙详情：完整信息 + 联系 + 认领入口
data/
└── salons.json                 # 所有沙龙数据（目标 100 条）
scripts/
└── scrape-gmaps.js             # Google Maps API 抓取脚本
```

---

## salons.json 数据结构

每条记录包含以下字段：

```json
{
  "id": "unique-slug-city-name",
  "name": "Studio Name",
  "slug": "studio-name",
  "city": "new-york",
  "city_display": "New York",
  "state": "NY",
  "address": "123 Main St, New York, NY 10001",
  "lat": 40.7128,
  "lng": -74.0060,
  "phone": "+1-212-555-0100",
  "website": "https://example.com",
  "booking_url": "https://example.com/book",
  "hours": "Mon-Fri 9am-6pm, Sat 10am-4pm",
  "price_range": "$100-200",
  "services": ["full-attach", "cut-in", "maintenance"],
  "accepts_outside_systems": true,
  "system_types": ["lace", "skin", "mono"],
  "private_room": true,
  "claimed": false,
  "verified": false,
  "google_place_id": "ChIJ...",
  "google_rating": 4.8,
  "google_reviews_count": 47,
  "description": "Specialist studio focused on hair replacement systems.",
  "created_at": "2026-03-13"
}
```

---

## 首页设计规范

**Hero 文案（不可改动）：**
```
Find Your Studio
50 vetted specialists. Wearers only.
```

**搜索框**：城市 / 邮编输入，Google Places Autocomplete  
**CTA 副按钮**：Browse All · Add Your Studio

**首页 below-the-fold（极简）：**
1. 3步说明：Search → Find → Book
2. 热门城市快捷入口（NYC · LA · Houston · Dallas · Chicago）
3. 邮件订阅（"Get notified when we add salons in your city"）

**设计风格**：深色系（navy #1a2332）· 无假发图片 · 无 toupee/wig 字眼 · 匿名化证言

---

## 城市列表页（/salons/[city]）

**筛选（MVP 只做 3 个）：**
1. 服务类型（full-attach / cut-in / maintenance）
2. 接受外购发片（accepts_outside_systems: true/false）
3. 价格区间（$50-100 / $100-200 / $200+）

**卡片显示字段**：名称 · 地址 · 评分 · 是否接受外购 · 服务类型标签 · 电话

---

## 沙龙详情页（/salons/[city]/[slug]）

**字段展示顺序（按用户决策重要性）：**
1. 是否接受外购发片 ← 最关键，首屏显示
2. 服务类型
3. 电话 + 预约链接（click-to-call，GA 追踪事件）
4. 地址 + Google Maps Embed
5. 价格区间
6. 营业时间
7. 发片类型专长
8. 是否有私密空间
9. 认领状态（已认领徽章 or "Claim this listing" CTA）

**认领流程（极简版）：**
- 点击 "Claim this listing" → 弹出表单（姓名 + 邮箱 + 电话 + 验证：你是这家店的老板吗？）
- 表单提交 → Resend 发邮件给 `xiongmaopan7@gmail.com`
- Pan 手动审核，在 salons.json 更新 `claimed: true`
- 无自助后台，v1 手动操作

---

## 数据抓取策略

**目标城市（按优先级）：**
NYC → LA → Houston → Dallas → Chicago

**搜索词（每城市 3 组）：**
- "hair system salon"
- "hair replacement studio"  
- "hair prosthesis specialist"

**工具**：Google Maps Places API（Text Search + Place Details）  
**免费额度**：Text Search $0.032/次，Details $0.017/次；100 条约 $5，新账号有 $200 免费额度  
**输出**：清洗后写入 `data/salons.json`

---

## 认领邮件模板

发给沙龙老板的冷推邮件（Pan 出门后手动发，Resend 辅助）：

```
Subject: [Studio Name] is listed on HairSystemFinder — claim your free profile

Hi [Owner Name],

I found [Studio Name] while building a directory specifically for 
hair system specialists — the first of its kind.

Your studio is already listed at hairsystemfinder.com/salons/[city]/[slug]. 
I wanted to reach out so you can claim it and update your info 
(services, pricing, booking link) for free.

I'm a hair system wearer myself and built this because finding qualified 
specialists is genuinely hard. No charge, no catch.

Alex
hairsystemfinder.com
```

---

## 开发规范

1. **每次执行前先 `/plan`**，规划后再执行
2. **每完成一个功能模块立即 commit + push**
3. **用 `/compact` 压缩 context**（超过 50% 时）
4. **所有提示结尾加**："Be concise, no acknowledgment"
5. **环境变量**：全部写入 `.env.local`，不硬编码
6. **不做**：用户登录、数据库、付费功能（v1 全部免费）

---

## 服务状态

- Resend domain: hairsystemfinder.com 已验证 ✅
- Umami Analytics: script 已加入 pages/_document.tsx ✅
- Google Maps: 改为 "View on Google Maps" 纯链接方案（无 API 依赖）

---

## Data Files

- `data/outreach.json`: 52 家沙龙，19 有邮箱，33 无邮箱
- `data/outreach_sent.json`: 记录已发送邮箱（防重复）
- `scripts/outreach.js`: 冷推邮件脚本，`--dry-run` 预览，正式发送去掉参数
- `scripts/fetch-emails.js`: 从沙龙网站抓取邮箱
- `scripts/scrape-gmaps.js`: 从 Google Places API 抓取沙龙数据

---

## Dashboard

- 本地看板: `dashboard.html`（双击打开，调 Umami API 显示实时数据）

---

## 环境变量清单

```env
# Google Maps（当前未使用，地图改为链接跳转）
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Resend（邮件）— domain verified ✅
RESEND_API_KEY=
RESEND_FROM_EMAIL=hello@hairsystemfinder.com
ADMIN_EMAIL=xiongmaopan7@gmail.com

# Umami Analytics
# Website ID: cbd08d15-4ade-4819-a0d9-65a2718f190d（已硬编码在 _document.tsx）
```

---

## 验证指标（上线后 30 天）

| 指标 | 目标 | 含义 |
|------|------|------|
| 城市搜索次数 | >100 | 有真实需求 |
| Click-to-call 次数 | >20 | 用户想联系沙龙 |
| 沙龙主动认领 | >5 | 沙龙认可价值 |
| 沙龙要求修改/删除 | >3 | 沙龙知道我们存在 |

---

## Kill Criteria

- 冷推 20 家沙龙，60%+ 拒绝被收录 → 放弃目录模式
- 上线 30 天，城市搜索次数 <50 → 重新评估
- Lordhair 大幅升级自己的 Salon Finder → 监控后决定

---

## 代理设置（Claude Code 启动必须）

```powershell
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
$env:HTTP_PROXY = "http://127.0.0.1:7890"
claude --dangerously-skip-permissions
```
