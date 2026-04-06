const RESEND_API_URL = 'https://api.resend.com/emails';

const TOPIC_LABELS: Record<string, string> = {
  general: 'General Inquiry',
  directory: 'Directory / Profile Update',
  volunteer: 'Volunteer Interest',
  event: 'Event Question',
  legacy: 'Legacy Submission',
  donation: 'Donation',
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

type ContactInput = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return { sent: false, error: 'Missing RESEND_API_KEY or RESEND_FROM_EMAIL.' };
  }

  const payload: Record<string, unknown> = { from, to: [to], subject, html, text };
  if (replyTo) payload.reply_to = replyTo;

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { sent: false, error: body?.message || 'Email failed to send.' };
  }
  return { sent: true };
}

/** Sends a notification email to the chapter inbox and a confirmation to the submitter. */
export async function sendContactNotificationEmails(input: ContactInput) {
  const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL;
  const topicLabel = TOPIC_LABELS[input.topic] ?? input.topic;

  const results: Array<{ sent: boolean; error?: string }> = [];

  // ── 1. Notify the chapter ──────────────────────────────────────────────────
  if (notifyEmail) {
    const subject = `New Contact: ${topicLabel} from ${input.name}`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px;">
        <h2 style="color: #1e3a5f; margin-bottom: 4px;">New Contact Form Submission</h2>
        <p style="margin-top: 0; color: #6b7280; font-size: 14px;">Submitted via ctepsilonphidelts.org</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Name</td>
            <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${escapeHtml(input.name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e5e7eb; font-weight: bold;">Email</td>
            <td style="padding: 8px 12px; border: 1px solid #e5e7eb;"><a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e5e7eb; font-weight: bold;">Topic</td>
            <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${escapeHtml(topicLabel)}</td>
          </tr>
        </table>

        <div style="padding: 16px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 16px;">
          <p style="margin: 0 0 8px 0; font-weight: bold;">Message</p>
          <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(input.message)}</p>
        </div>

        <p style="margin-top: 24px; font-size: 13px; color: #6b7280;">
          Reply directly to this email to respond to ${escapeHtml(input.name)}.
        </p>
      </div>
    `;

    const text = [
      'New Contact Form Submission',
      '─────────────────────────',
      `Name:  ${input.name}`,
      `Email: ${input.email}`,
      `Topic: ${topicLabel}`,
      '',
      'Message:',
      input.message,
      '',
      `Reply to this email to respond to ${input.name}.`,
    ].join('\n');

    const result = await sendEmail({ to: notifyEmail, subject, html, text, replyTo: input.email });
    results.push(result);
  }

  // ── 2. Confirmation to submitter ───────────────────────────────────────────
  const confirmSubject = `We received your message — Phi Delta Theta CT Epsilon`;

  const confirmHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px;">
      <h2 style="color: #1e3a5f;">Thanks for reaching out, ${escapeHtml(input.name)}!</h2>

      <p>
        We received your message and will get back to you as soon as possible.
        Here's a copy of what you submitted:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e5e7eb; font-weight: bold; width: 80px;">Topic</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${escapeHtml(topicLabel)}</td>
        </tr>
      </table>

      <div style="padding: 16px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px;">
        <p style="margin: 0 0 8px 0; font-weight: bold;">Your message</p>
        <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(input.message)}</p>
      </div>

      <p style="margin-top: 24px;">
        Thank you,<br/>
        <strong>Phi Delta Theta CT Epsilon Alumni Network</strong>
      </p>
    </div>
  `;

  const confirmText = [
    `Thanks for reaching out, ${input.name}!`,
    '',
    'We received your message and will get back to you as soon as possible.',
    '',
    `Topic: ${topicLabel}`,
    '',
    'Your message:',
    input.message,
    '',
    'Thank you,',
    'Phi Delta Theta CT Epsilon Alumni Network',
  ].join('\n');

  const confirmResult = await sendEmail({
    to: input.email,
    subject: confirmSubject,
    html: confirmHtml,
    text: confirmText,
  });
  results.push(confirmResult);

  return results;
}
