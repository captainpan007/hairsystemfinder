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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'xiongmaopan7@gmail.com';
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@hairsystemfinder.com';

  if (!RESEND_API_KEY) {
    console.log('[Subscriber]', { email });
    return res.status(200).json({ success: true, message: 'Subscribed' });
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
        subject: '[HairSystemFinder] New subscriber',
        html: `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
      }),
    });

    if (!response.ok) {
      console.error('Resend subscriber error:', await response.text());
      return res.status(500).json({ error: 'Failed to send notification' });
    }

    return res.status(200).json({ success: true, message: 'Subscribed' });
  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
