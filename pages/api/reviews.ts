import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const REVIEWS_FILE = path.join(process.cwd(), 'data', 'reviews.json');

function readReviews(): Record<string, any[]> {
  try {
    if (!fs.existsSync(REVIEWS_FILE)) {
      return {};
    }
    const raw = fs.readFileSync(REVIEWS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeReviews(data: Record<string, any[]>) {
  const dir = path.dirname(REVIEWS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { salonId } = req.query;
    if (!salonId || typeof salonId !== 'string') {
      return res.status(400).json({ error: 'salonId is required' });
    }
    const reviews = readReviews();
    return res.status(200).json(reviews[salonId] || []);
  }

  if (req.method === 'POST') {
    const { salonId, visited, accepts_outside, rating, comment } = req.body;

    if (!salonId || typeof salonId !== 'string') {
      return res.status(400).json({ error: 'salonId is required' });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'rating must be 1-5' });
    }

    const review = {
      id: crypto.randomUUID(),
      visited: !!visited,
      accepts_outside: !!accepts_outside,
      rating,
      comment: typeof comment === 'string' ? comment.trim().slice(0, 500) : '',
      created_at: new Date().toISOString().split('T')[0],
    };

    try {
      const reviews = readReviews();
      if (!reviews[salonId]) {
        reviews[salonId] = [];
      }
      reviews[salonId].push(review);
      writeReviews(reviews);
      return res.status(201).json(review);
    } catch {
      return res.status(500).json({ error: 'Failed to save review' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
