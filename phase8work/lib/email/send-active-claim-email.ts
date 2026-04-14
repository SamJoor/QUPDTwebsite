const RESEND_API_URL = 'https://api.resend.com/emails';

export async function sendActiveClaimEmail(input: { to: string; claimUrl: string; expiresAt: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return { sent: false, mode: 'preview' as const, error: 'Missing RESEND_API_KEY or RESEND_FROM_EMAIL.' };
  }

  const expiry = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(input.expiresAt));

  const subject = 'Claim your active member account';
  const text = [
    'Phi Delta Theta active-member account setup',
    '',
    'Use the secure link below to finish setting your password:',
    input.claimUrl,
    '',
    `This link expires on ${expiry}.`,
    '',
    'If you did not request this, you can ignore this email.'
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <p style="font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #8a1c2f; font-weight: 700;">
        Phi Delta Theta
      </p>
      <h1 style="font-size: 24px; margin: 8px 0 16px;">Claim your active member account</h1>
      <p>Use the secure link below to finish setting your password for the active-member portal.</p>
      <p style="margin: 24px 0;">
        <a href="${input.claimUrl}" style="background: #8a1c2f; color: #ffffff; padding: 12px 20px; border-radius: 999px; text-decoration: none; font-weight: 700;">
          Finish account setup
        </a>
      </p>
      <p>If the button does not open, copy and paste this URL into your browser:</p>
      <p><a href="${input.claimUrl}">${input.claimUrl}</a></p>
      <p>This link expires on <strong>${expiry}</strong>.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
  `;

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject,
      html,
      text
    })
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { sent: false, mode: 'resend' as const, error: (body as { message?: string }).message || 'Email failed to send.' };
  }

  return { sent: true, mode: 'resend' as const };
}
