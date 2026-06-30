import type { NextApiRequest, NextApiResponse } from 'next';

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { salonId } = req.query;
    if (!salonId || typeof salonId !== 'string') {
      return res.status(400).json({ error: 'salonId is required' });
    }
    return res.status(200).json([]);
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

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'xiongmaopan7@gmail.com';
    const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@hairsystemfinder.com';

    if (!RESEND_API_KEY) {
      console.log('[Review]', { salonId, ...review });
      return res.status(201).json(review);
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `[HairSystemFinder] Review signal: ${salonId}`,
          html: `
            <h2>New review signal</h2>
            <p><strong>Salon ID:</strong> ${escapeHtml(salonId)}</p>
            <p><strong>Rating:</strong> ${review.rating}</p>
            <p><strong>Visited:</strong> ${review.visited ? 'Yes' : 'No'}</p>
            <p><strong>Accepted outside system:</strong> ${review.accepts_outside ? 'Yes' : 'No'}</p>
            <p><strong>Comment:</strong> ${escapeHtml(review.comment || 'No comment')}</p>
          `,
        }),
      });

      if (!response.ok) {
        console.error('Resend review error:', await response.text());
        return res.status(500).json({ error: 'Failed to send notification' });
      }

      return res.status(201).json(review);
    } catch (error) {
      console.error('Review error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
