const RESEND_API_URL = 'https://api.resend.com/emails';

export type SendNewsletterArgs = {
  to: string[];
  subject: string;
  html: string;
  text: string;
};

export function hasResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export async function sendNewsletterEmail({ to, subject, html, text }: SendNewsletterArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return { sent: false, mode: 'preview' as const, error: 'Missing RESEND_API_KEY or RESEND_FROM_EMAIL.' };
  }

  const responses = await Promise.all(
    to.map(async (recipient) => {
      const response = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to: [recipient], subject, html, text }),
      });

      const body = await response.json().catch(() => ({}));
      return { ok: response.ok, body };
    })
  );

  const failures = responses.filter((entry) => !entry.ok);
  if (failures.length > 0) {
    return {
      sent: false,
      mode: 'resend' as const,
      error: failures[0]?.body?.message || 'One or more emails failed to send.',
    };
  }

  return { sent: true, mode: 'resend' as const, count: to.length };
}
