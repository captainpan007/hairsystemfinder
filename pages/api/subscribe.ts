import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

function getSubscribers(): string[] {
  try {
    const raw = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveSubscribers(subscribers: string[]) {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const subscribers = getSubscribers();

  if (subscribers.includes(email)) {
    return res.status(200).json({ success: true, message: 'Already subscribed' });
  }

  subscribers.push(email);
  saveSubscribers(subscribers);

  return res.status(200).json({ success: true, message: 'Subscribed' });
}
