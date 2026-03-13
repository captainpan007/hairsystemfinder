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
- **Salon detail** (pages/salons/[city]/[slug].tsx): Full info display, accepts-outside-systems badge, click-to-call, Google Maps embed, claim form
- **API /api/claim**: Receives claim form, sends email via Resend to admin
- **API /api/subscribe**: Saves subscriber emails to data/subscribers.json
- npm run build: 194 static pages generated successfully
