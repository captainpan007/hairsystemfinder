# DEV_LOG

## 2026-03-13 — Project Initialization
- Initialized Next.js 14 project with TypeScript + TailwindCSS
- Installed fuse.js, resend, dotenv
- Created page structure: index, [city], [city]/[slug]
- Created data/salons.json (empty)
- Created scripts/scrape-gmaps.js (Google Maps Places API v1)
- Created .env.local and .env.example
- Set up .gitignore

## 2026-03-13 — Data Scraping
- Enabled Places API (New) in Google Cloud Console
- Ran scraper across 5 cities: NYC, LA, Houston, Dallas, Chicago
- Scraped **188 salons** total with name, address, phone, rating, hours, website
- Added proxy support (hpagent + node-fetch) for scraper

## 2026-03-13 — Pages & API Routes
- **Homepage** (pages/index.tsx): Hero, search, 3-step how-it-works, city shortcuts, email subscribe form (connected to API)
- **City listing** (pages/salons/[city].tsx): Salon card grid, 3 filters (service type, outside systems, price range)
- **Salon detail** (pages/salons/[city]/[slug].tsx): Full info display, accepts-outside-systems badge, click-to-call, claim form
- **API /api/claim**: Receives claim form, sends email via Resend to admin
- **API /api/subscribe**: Saves subscriber emails to data/subscribers.json
- npm run build: 194 static pages generated successfully

## 2026-03-15 — SEO & Data Quality
- Filtered salons by hair system keywords: 188 → **52 quality listings**
- Updated SEO titles on all pages
- Generated sitemap.xml (58 URLs) and robots.txt
- Fixed cross-platform build for Railway (removed @next/swc-win32-x64-msvc)
- First deploy to Railway

## 2026-03-15 — UX Fixes
- Fixed hero spacing (min-h-[70vh] → py-24)
- Fixed city routing (NYC/LA aliases in search)
- Fixed bottom whitespace (body/html/#__next background → #1a2332)
- Replaced Google Maps embed with plain "View on Google Maps" link button
- Added "← Back to [City] salons" link on detail page
- Added info tooltips for outside/in-house system labels

## 2026-03-16 — Launch Day

### 上线完成
- 域名购买 hairsystemfinder.com，Namecheap NS → Cloudflare
- Railway 绑定自定义域名，HTTPS 正常
- Google Search Console 验证 + Sitemap 提交
- Reddit r/HairLoss + r/malepatternbaldness 发帖
- IndieHackers 发帖

### Bug 修复
- Hero 空白、NYC/LA 路由、详情页 error page 修复
- Google Maps embed 改为 "View on Google Maps" 纯链接（build-time env var 无法注入）
- 底部白色空白：html/body/#__next 强制 background: #1a2332

### 邮件系统搭建
- Cloudflare Email Routing: hello@hairsystemfinder.com → Gmail ✅
- Resend 域名验证: hairsystemfinder.com ✅（Auto configure via Cloudflare OAuth）
- RESEND_FROM_EMAIL 更新为 hello@hairsystemfinder.com
- 冷推邮件首批发送: 19/52 封，0 失败 ✅

### 数据收集
- outreach.json: 52 家沙龙（Google Places 抓取）
- fetch-emails.js 跑完: 19 家有邮箱，33 家网站不公开邮箱

### Analytics 接入
- Umami Cloud 注册，添加 hairsystemfinder.com
- tracking script 加入 pages/_document.tsx，全站生效
- 本地 dashboard.html 制作完成

### 待办
- [ ] 手动补充 33 家无邮箱沙龙的联系方式（从网站 Contact 页或 Google Maps）
- [ ] 监控 Umami 看 Reddit/IH 带来的流量
- [ ] 监控 hello@hairsystemfinder.com 等待沙龙回复
- [ ] 下一批冷推（补充邮箱后）

## Current Status
- **Live at**: https://hairsystemfinder.com
- **Salons**: 52 across 5 cities (NYC 9, LA 15, Houston 10, Dallas 12, Chicago 6)
- **Outreach**: 19 封已发送 ✅
- **Analytics**: Umami tracking active
- **Next**: 监控流量 + 沙龙回复 → 补充邮箱 → 第二批冷推
