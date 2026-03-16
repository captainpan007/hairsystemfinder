#!/usr/bin/env node
/**
 * Fetch contact emails from salon websites
 *
 * Reads data/outreach.json, visits each salon's website,
 * extracts email addresses, and writes them back.
 *
 * Usage:
 *   node scripts/fetch-emails.js
 *   node scripts/fetch-emails.js --dry-run
 */

const fs = require('fs');
const path = require('path');

const OUTREACH_FILE = path.join(__dirname, '..', 'data', 'outreach.json');
const DELAY_MS = 500;
const TIMEOUT_MS = 4000;

const dryRun = process.argv.includes('--dry-run');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractEmails(html) {
  const emails = new Set();

  // mailto: links
  const mailtoRe = /mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/gi;
  let m;
  while ((m = mailtoRe.exec(html)) !== null) {
    emails.add(m[1].toLowerCase());
  }

  // Bare email patterns in text
  const bareRe = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  while ((m = bareRe.exec(html)) !== null) {
    const email = m[0].toLowerCase();
    // Filter out common false positives
    if (
      !email.endsWith('.png') &&
      !email.endsWith('.jpg') &&
      !email.endsWith('.svg') &&
      !email.endsWith('.css') &&
      !email.endsWith('.js') &&
      !email.includes('example.com') &&
      !email.includes('wixpress') &&
      !email.includes('sentry') &&
      !email.includes('googleapis') &&
      !email.includes('domain.com') &&
      !email.includes('email.com') &&
      !email.includes('yoursite') &&
      !email.startsWith('user@') &&
      !email.startsWith('name@') &&
      !email.startsWith('info@example')
    ) {
      emails.add(email);
    }
  }

  return [...emails];
}

async function fetchPage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Ensure URL has protocol
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HairSystemFinder/1.0)',
      },
      redirect: 'follow',
    });

    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  console.log(`\n=== Fetch Salon Emails ===`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}\n`);

  const outreach = JSON.parse(fs.readFileSync(OUTREACH_FILE, 'utf-8'));
  const needEmail = outreach.filter((e) => !e.email && e.website);
  const noWebsite = outreach.filter((e) => !e.email && !e.website);

  console.log(`Total: ${outreach.length}`);
  console.log(`Already have email: ${outreach.filter((e) => e.email).length}`);
  console.log(`Need email (has website): ${needEmail.length}`);
  console.log(`No email, no website (skip): ${noWebsite.length}\n`);

  let found = 0;
  let skipped = 0;

  for (let i = 0; i < needEmail.length; i++) {
    const entry = needEmail[i];
    const label = `[${i + 1}/${needEmail.length}] ${entry.name}`;

    const html = await fetchPage(entry.website);

    if (!html) {
      console.log(`  skip: ${label} — fetch failed`);
      skipped++;
      await sleep(DELAY_MS);
      continue;
    }

    const emails = extractEmails(html);

    if (emails.length === 0) {
      console.log(`  skip: ${label} — no email found`);
      skipped++;
    } else {
      const email = emails[0];
      if (dryRun) {
        console.log(`  [DRY] ${label} → ${email}`);
      } else {
        entry.email = email;
        console.log(`  found: ${label} → ${email}`);
      }
      found++;
    }

    await sleep(DELAY_MS);
  }

  if (!dryRun) {
    fs.writeFileSync(OUTREACH_FILE, JSON.stringify(outreach, null, 2), 'utf-8');
  }

  console.log(`\n=== Summary ===`);
  console.log(`Emails found: ${found}`);
  console.log(`Skipped: ${skipped}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
