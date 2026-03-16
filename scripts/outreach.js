#!/usr/bin/env node
/**
 * Outreach email sender for HairSystemFinder
 *
 * Required env vars:
 *   RESEND_API_KEY       — Resend API key
 *   RESEND_FROM_EMAIL    — sender address (e.g. hello@hairsystemfinder.com)
 *
 * Usage:
 *   node scripts/outreach.js              # send up to 20 emails
 *   node scripts/outreach.js --dry-run    # preview without sending
 *
 * Data files:
 *   data/outreach.json       — salon list (must have "email" field populated)
 *   data/outreach_sent.json  — tracks sent emails (auto-created)
 */

const fs = require('fs');
const path = require('path');

const OUTREACH_FILE = path.join(__dirname, '..', 'data', 'outreach.json');
const SENT_FILE = path.join(__dirname, '..', 'data', 'outreach_sent.json');
const MAX_PER_RUN = 20;
const DELAY_MS = 2000;

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@hairsystemfinder.com';

const dryRun = process.argv.includes('--dry-run');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadJson(filepath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  } catch {
    return fallback;
  }
}

function saveJson(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

function buildEmailBody(entry) {
  const name = entry.name || 'there';
  const salonName = entry.salonName || entry.name || 'your studio';

  return [
    `Hi ${name},`,
    '',
    `I just added ${salonName} to HairSystemFinder.com — a free directory specifically for hair system salons across the US.`,
    '',
    'Your listing is live at: hairsystemfinder.com',
    '',
    "If you'd like to update your info or add photos, just reply to this email.",
    '',
    'Best,',
    'Alex',
    'HairSystemFinder.com',
  ].join('\n');
}

async function sendEmail(entry) {
  const subject = `Listed ${entry.salonName || entry.name} on HairSystemFinder.com — free`;
  const body = buildEmailBody(entry);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: entry.email,
      reply_to: 'hello@hairsystemfinder.com',
      subject,
      text: body,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend ${res.status}: ${errText}`);
  }

  return await res.json();
}

async function main() {
  console.log(`\n=== HairSystemFinder Outreach ===`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}\n`);

  if (!dryRun && !RESEND_API_KEY) {
    console.error('ERROR: RESEND_API_KEY not set');
    process.exit(1);
  }

  const outreach = loadJson(OUTREACH_FILE, []);
  const sent = loadJson(SENT_FILE, []);
  const sentSet = new Set(sent);

  // Filter to entries with email, not yet sent
  const pending = outreach.filter((e) => e.email && !sentSet.has(e.email));
  const noEmail = outreach.filter((e) => !e.email);
  const alreadySent = outreach.filter((e) => e.email && sentSet.has(e.email));
  const batch = pending.slice(0, MAX_PER_RUN);

  console.log(`Total entries: ${outreach.length}`);
  console.log(`Without email (skipped): ${noEmail.length}`);
  console.log(`Already sent (skipped): ${alreadySent.length}`);
  console.log(`Pending with email: ${pending.length}`);
  console.log(`This batch: ${batch.length}\n`);

  if (batch.length === 0) {
    console.log('Nothing to send. Add "email" field to outreach.json entries.');
    return;
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < batch.length; i++) {
    const entry = batch[i];
    const label = `[${i + 1}/${batch.length}] ${entry.name} <${entry.email}>`;

    if (dryRun) {
      console.log(`  [DRY RUN] Would send to: ${label}`);
      success++;
      continue;
    }

    try {
      await sendEmail(entry);
      console.log(`  ✓ Sent: ${label}`);
      sent.push(entry.email);
      saveJson(SENT_FILE, sent);
      success++;
    } catch (err) {
      console.error(`  ✗ Failed: ${label} — ${err.message}`);
      failed++;
    }

    if (i < batch.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Sent: ${success}`);
  console.log(`Skipped (no email): ${noEmail.length}`);
  console.log(`Skipped (already sent): ${alreadySent.length}`);
  console.log(`Failed: ${failed}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
