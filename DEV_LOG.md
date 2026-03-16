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

## 2026-03-16 — Outreach & Analytics
- Created scripts/fetch-emails.js: scraped 19 salon emails from websites
- Created scripts/outreach.js: batch email sender via Resend API
- Generated data/outreach.json with 52 salon outreach drafts
- Added Umami analytics (cloud.umami.is) to all pages
- Resend domain verification pending for hello@hairsystemfinder.com

## Current Status
- **Live at**: https://hairsystemfinder.com
- **Salons**: 52 across 5 cities (NYC 9, LA 15, Houston 10, Dallas 12, Chicago 6)
- **Outreach**: 19 emails ready, pending Resend domain verification
- **Analytics**: Umami tracking active
- **Next**: Verify Resend domain → send outreach batch → monitor metrics
