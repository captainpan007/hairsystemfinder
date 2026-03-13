import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, salonName, salonId } = req.body;

  if (!name || !email || !salonName) {
    return res.status(400).json({ error: 'Missing required fields: name, email, salonName' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'xiongmaopan7@gmail.com';
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@hairsystemfinder.com';

  // If Resend not configured, log and return success
  if (!RESEND_API_KEY) {
    console.log('[Claim Request]', { name, email, phone, salonName, salonId });
    return res.status(200).json({ success: true, message: 'Claim received (email not configured)' });
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
        subject: `[HairSystemFinder] Claim Request: ${salonName}`,
        html: `
          <h2>New Claim Request</h2>
          <p><strong>Salon:</strong> ${salonName} (${salonId})</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p>Review and update salons.json if verified.</p>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Failed to send notification' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Claim error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
