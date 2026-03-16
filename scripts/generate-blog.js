#!/usr/bin/env node
/**
 * Generate city guide blog pages using Anthropic API
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY — Anthropic API key
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-blog.js
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-blog.js --dry-run
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.ANTHROPIC_API_KEY;
const dryRun = process.argv.includes('--dry-run');

if (!API_KEY && !dryRun) {
  console.error('ERROR: ANTHROPIC_API_KEY not set');
  process.exit(1);
}

const CITIES = [
  { name: 'New York', slug: 'new-york', state: 'NY' },
  { name: 'Los Angeles', slug: 'los-angeles', state: 'CA' },
  { name: 'Chicago', slug: 'chicago', state: 'IL' },
  { name: 'Houston', slug: 'houston', state: 'TX' },
  { name: 'Phoenix', slug: 'phoenix', state: 'AZ' },
  { name: 'Philadelphia', slug: 'philadelphia', state: 'PA' },
  { name: 'San Antonio', slug: 'san-antonio', state: 'TX' },
  { name: 'San Diego', slug: 'san-diego', state: 'CA' },
  { name: 'Dallas', slug: 'dallas', state: 'TX' },
  { name: 'Miami', slug: 'miami', state: 'FL' },
];

const BLOG_DIR = path.join(__dirname, '..', 'data', 'blog');
const DELAY_MS = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateGuide(city) {
  const prompt = `Write a comprehensive guide about hair system salons in ${city.name}, ${city.state}. Include: what hair systems are, what to look for in a hair system specialist, typical pricing, maintenance tips, and why finding a local specialist matters. Write in a helpful, informative tone. No markdown headers with #, use plain text with clear paragraphs. Around 800-1000 words. End with a call to action to browse specialists on HairSystemFinder.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.content[0].text;
}

function buildPageContent(city, guide) {
  return `import Head from 'next/head';
import Link from 'next/link';

export default function ${city.slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')}Guide() {
  return (
    <>
      <Head>
        <title>Hair System Salons in ${city.name} — Complete Guide | HairSystemFinder</title>
        <meta name="description" content="Everything you need to know about hair system salons in ${city.name}. Find specialists, pricing, and maintenance tips." />
      </Head>

      <div className="bg-[#1a2332] text-white">
        <header className="py-4 px-4 border-b border-gray-700">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-lg font-bold hover:text-blue-400 transition-colors">
              HairSystemFinder
            </Link>
            <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
              Guides
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/blog" className="inline-block text-sm text-gray-400 hover:text-white transition-colors mb-4">
            &larr; All Guides
          </Link>

          <h1 className="text-3xl font-bold mb-6">
            Hair System Salons in ${city.name}: A Complete Guide
          </h1>

          <article className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4">
            {${JSON.stringify(guide)}.split('\\n\\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </article>

          <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700 text-center">
            <h2 className="text-xl font-bold mb-2">Find Specialists in ${city.name}</h2>
            <p className="text-gray-400 text-sm mb-4">Browse vetted hair system salons near you.</p>
            <Link
              href="/salons/${city.slug}"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              View ${city.name} Salons
            </Link>
          </div>
        </main>

        <footer className="py-8 px-4 border-t border-gray-700 text-center text-gray-500 text-sm">
          &copy; 2026 HairSystemFinder
        </footer>
      </div>
    </>
  );
}
`;
}

function buildIndexPage(cities) {
  const cityItems = cities
    .map(c => `    { name: '${c.name}', slug: '${c.slug}' }`)
    .join(',\n');

  return `import Head from 'next/head';
import Link from 'next/link';

const CITIES = [
${cityItems},
];

export default function BlogIndex() {
  return (
    <>
      <Head>
        <title>Hair System Guides by City | HairSystemFinder</title>
        <meta name="description" content="City-by-city guides to finding the best hair system salons. Pricing, tips, and specialist directories." />
      </Head>

      <div className="bg-[#1a2332] text-white">
        <header className="py-4 px-4 border-b border-gray-700">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-lg font-bold hover:text-blue-400 transition-colors">
              HairSystemFinder
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">City Guides</h1>
          <p className="text-gray-400 mb-8">Everything you need to know about hair system salons in your city.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CITIES.map((city) => (
              <Link
                key={city.slug}
                href={\`/blog/\${city.slug}\`}
                className="block bg-gray-800 rounded-lg p-5 hover:ring-1 hover:ring-blue-400 transition-all"
              >
                <h2 className="text-lg font-semibold mb-1">{city.name}</h2>
                <p className="text-gray-400 text-sm">Hair system guide &rarr;</p>
              </Link>
            ))}
          </div>
        </main>

        <footer className="py-8 px-4 border-t border-gray-700 text-center text-gray-500 text-sm">
          &copy; 2026 HairSystemFinder
        </footer>
      </div>
    </>
  );
}
`;
}

async function main() {
  console.log(`\n=== Blog Guide Generator ===`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Cities: ${CITIES.length}\n`);

  // Ensure directories exist
  const blogPagesDir = path.join(__dirname, '..', 'pages', 'blog');
  if (!fs.existsSync(blogPagesDir)) {
    fs.mkdirSync(blogPagesDir, { recursive: true });
  }
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  // Generate index page
  const indexContent = buildIndexPage(CITIES);
  const indexPath = path.join(blogPagesDir, 'index.tsx');
  fs.writeFileSync(indexPath, indexContent, 'utf-8');
  console.log(`Created: pages/blog/index.tsx`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < CITIES.length; i++) {
    const city = CITIES[i];
    const label = `[${i + 1}/${CITIES.length}] ${city.name}`;
    const pagePath = path.join(blogPagesDir, `${city.slug}.tsx`);
    const dataPath = path.join(BLOG_DIR, `${city.slug}.json`);

    // Skip if already generated
    if (fs.existsSync(pagePath) && fs.existsSync(dataPath)) {
      console.log(`  skip: ${label} — already exists`);
      success++;
      continue;
    }

    if (dryRun) {
      console.log(`  [DRY] Would generate: ${label}`);
      success++;
      continue;
    }

    try {
      console.log(`  generating: ${label}...`);
      const guide = await generateGuide(city);

      // Save raw content
      fs.writeFileSync(dataPath, JSON.stringify({ city: city.name, slug: city.slug, content: guide, generated_at: new Date().toISOString() }, null, 2), 'utf-8');

      // Save page
      const pageContent = buildPageContent(city, guide);
      fs.writeFileSync(pagePath, pageContent, 'utf-8');

      console.log(`  done: ${label} (${guide.length} chars)`);
      success++;
    } catch (err) {
      console.error(`  fail: ${label} — ${err.message}`);
      failed++;
    }

    if (i < CITIES.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  // Update sitemap
  updateSitemap();

  console.log(`\n=== Summary ===`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`Pages: pages/blog/index.tsx + ${success} city guides`);
}

function updateSitemap() {
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  try {
    let xml = fs.readFileSync(sitemapPath, 'utf-8');
    const BASE = 'https://hairsystemfinder.com';

    // Add blog URLs if not already present
    if (!xml.includes('/blog')) {
      const blogUrls = [`  <url><loc>${BASE}/blog</loc></url>`];
      CITIES.forEach(c => {
        blogUrls.push(`  <url><loc>${BASE}/blog/${c.slug}</loc></url>`);
      });

      xml = xml.replace('</urlset>', blogUrls.join('\n') + '\n</urlset>');
      fs.writeFileSync(sitemapPath, xml, 'utf-8');
      console.log(`\nUpdated sitemap.xml with ${blogUrls.length} blog URLs`);
    }
  } catch {
    console.log('\nWarning: Could not update sitemap.xml');
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
