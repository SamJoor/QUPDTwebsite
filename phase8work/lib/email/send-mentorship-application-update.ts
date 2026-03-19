import { Resend } from "resend";

type SendMentorshipApplicationUpdateInput = {
  to: string;
  applicantName?: string | null;
  opportunityTitle: string;
  company?: string | null;
  status: "accepted";
  alumniMessage?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendMentorshipApplicationAcceptedEmail({
  to,
  applicantName,
  opportunityTitle,
  company,
  alumniMessage,
}: SendMentorshipApplicationUpdateInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "Phi Delta Theta <noreply@yourdomain.com>";

  if (!apiKey) {
    console.warn(
      "[sendMentorshipApplicationAcceptedEmail] RESEND_API_KEY is missing. Skipping email send."
    );
    return { skipped: true };
  }

  const resend = new Resend(apiKey);
  const safeName = applicantName?.trim() || "Applicant";
  const safeMessage = alumniMessage?.trim() || "";

  const subject = `Application Accepted: ${opportunityTitle}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <p>Hello ${escapeHtml(safeName)},</p>

      <p>
        Good news — your application for the mentorship opportunity below has been accepted.
      </p>

      <p>
        <strong>Opportunity:</strong> ${escapeHtml(opportunityTitle)}<br/>
        <strong>Company:</strong> ${escapeHtml(company || "—")}<br/>
        <strong>Status:</strong> Accepted
      </p>

      ${
        safeMessage
          ? `
        <div style="margin: 24px 0; padding: 16px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 12px;">
          <p style="margin: 0 0 8px 0;"><strong>Message from the reviewer</strong></p>
          <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(safeMessage)}</p>
        </div>
      `
          : ""
      }

      <p>
        Thank you,<br/>
        Phi Delta Theta Alumni Network
      </p>
    </div>
  `;

  const text = [
    `Hello ${safeName},`,
    "",
    "Good news — your application has been accepted.",
    "",
    `Opportunity: ${opportunityTitle}`,
    `Company: ${company || "—"}`,
    "Status: Accepted",
    safeMessage ? "" : null,
    safeMessage ? "Message from the reviewer:" : null,
    safeMessage || null,
    "",
    "Thank you,",
    "Phi Delta Theta Alumni Network",
  ]
    .filter(Boolean)
    .join("\n");

  return await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    html,
    text,
  });
}