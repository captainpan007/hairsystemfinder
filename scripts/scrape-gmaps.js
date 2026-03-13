#!/usr/bin/env node
/**
 * Google Maps Places API scraper for hair system salons
 * Usage: node scripts/scrape-gmaps.js [--city="New York"] [--dry-run]
 */

require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
if (!API_KEY) {
  console.error('ERROR: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not set in .env.local');
  process.exit(1);
}

const fs = require('fs');
const path = require('path');

const SEARCH_QUERIES = [
  'hair system salon',
  'hair replacement studio',
  'hair prosthesis specialist',
];

const TARGET_CITIES = [
  { name: 'New York', state: 'NY', slug: 'new-york' },
  { name: 'Los Angeles', state: 'CA', slug: 'los-angeles' },
  { name: 'Houston', state: 'TX', slug: 'houston' },
  { name: 'Dallas', state: 'TX', slug: 'dallas' },
  { name: 'Chicago', state: 'IL', slug: 'chicago' },
];

const SALONS_FILE = path.join(__dirname, '..', 'data', 'salons.json');

// Parse CLI args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const cityArg = args.find((a) => a.startsWith('--city='));
const targetCityName = cityArg ? cityArg.split('=')[1].replace(/"/g, '') : null;

const cities = targetCityName
  ? TARGET_CITIES.filter(
      (c) => c.name.toLowerCase() === targetCityName.toLowerCase()
    )
  : TARGET_CITIES;

if (targetCityName && cities.length === 0) {
  console.error(`City "${targetCityName}" not found. Available: ${TARGET_CITIES.map((c) => c.name).join(', ')}`);
  process.exit(1);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function textSearch(query, city) {
  const url = 'https://places.googleapis.com/v1/places:searchText';
  const body = {
    textQuery: `${query} in ${city.name}, ${city.state}`,
    languageCode: 'en',
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`  Text Search error (${res.status}): ${errText}`);
    return [];
  }

  const data = await res.json();
  return data.places || [];
}

async function getPlaceDetails(placeId) {
  const url = `https://places.googleapis.com/v1/places/${placeId}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask':
        'id,displayName,formattedAddress,location,internationalPhoneNumber,websiteUri,regularOpeningHours,rating,userRatingCount,googleMapsUri',
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`  Details error for ${placeId} (${res.status}): ${errText}`);
    return null;
  }

  return await res.json();
}

function formatHours(openingHours) {
  if (!openingHours || !openingHours.weekdayDescriptions) return '';
  return openingHours.weekdayDescriptions.join(', ');
}

function mapToSalon(details, city) {
  const name = details.displayName?.text || 'Unknown';
  const slug = slugify(name);

  return {
    id: `${slug}-${city.slug}`,
    name,
    slug,
    city: city.slug,
    city_display: city.name,
    state: city.state,
    address: details.formattedAddress || '',
    lat: details.location?.latitude || 0,
    lng: details.location?.longitude || 0,
    phone: details.internationalPhoneNumber || '',
    website: details.websiteUri || '',
    booking_url: '',
    hours: formatHours(details.regularOpeningHours),
    price_range: '',
    services: [],
    accepts_outside_systems: false,
    system_types: [],
    private_room: false,
    claimed: false,
    verified: false,
    google_place_id: details.id || '',
    google_rating: details.rating || 0,
    google_reviews_count: details.userRatingCount || 0,
    description: '',
    created_at: new Date().toISOString().split('T')[0],
  };
}

async function main() {
  console.log(`\n=== Hair System Salon Scraper ===`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Cities: ${cities.map((c) => c.name).join(', ')}\n`);

  // Load existing salons
  let existingSalons = [];
  try {
    const raw = fs.readFileSync(SALONS_FILE, 'utf-8');
    existingSalons = JSON.parse(raw);
  } catch {
    existingSalons = [];
  }

  const existingPlaceIds = new Set(existingSalons.map((s) => s.google_place_id));
  const newSalons = [];
  const seenPlaceIds = new Set();

  for (const city of cities) {
    console.log(`\n--- ${city.name}, ${city.state} ---`);

    for (let i = 0; i < SEARCH_QUERIES.length; i++) {
      const query = SEARCH_QUERIES[i];
      console.log(`  Fetching ${city.name} - query ${i + 1}/${SEARCH_QUERIES.length}: "${query}"...`);

      const places = await textSearch(query, city);
      console.log(`  Found ${places.length} results`);

      for (const place of places) {
        const placeId = place.id;

        // Dedupe
        if (existingPlaceIds.has(placeId) || seenPlaceIds.has(placeId)) {
          continue;
        }
        seenPlaceIds.add(placeId);

        await sleep(300);

        console.log(`    Getting details for: ${place.displayName?.text || placeId}`);
        const details = await getPlaceDetails(placeId);

        if (details) {
          const salon = mapToSalon(details, city);
          newSalons.push(salon);

          if (dryRun) {
            console.log(`    [DRY RUN] Would add: ${salon.name} (${salon.address})`);
          }
        }
      }

      await sleep(300);
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`New salons found: ${newSalons.length}`);
  console.log(`Existing salons: ${existingSalons.length}`);

  if (!dryRun && newSalons.length > 0) {
    const allSalons = [...existingSalons, ...newSalons];
    fs.writeFileSync(SALONS_FILE, JSON.stringify(allSalons, null, 2), 'utf-8');
    console.log(`Total salons written to ${SALONS_FILE}: ${allSalons.length}`);
  } else if (dryRun) {
    console.log(`[DRY RUN] No files modified.`);
  } else {
    console.log(`No new salons to add.`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
