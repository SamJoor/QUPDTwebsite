"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Props = {
  applicantEmail: string;
  applicantName: string | null;
  opportunityId: string;
  opportunityTitle: string;
  company: string | null;
  alumniNotes: string | null;
  reviewerName: string | null;
  reviewerEmail: string;
};

function buildMailtoLink({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const params = new URLSearchParams({
    subject,
    body,
  });

  return `mailto:${encodeURIComponent(to)}?${params.toString()}`;
}

export function MentorshipEmailComposer({
  applicantEmail,
  applicantName,
  opportunityId,
  opportunityTitle,
  company,
  alumniNotes,
  reviewerName,
  reviewerEmail,
}: Props) {
  const safeApplicantName = applicantName?.trim() || "there";
  const safeReviewerName = reviewerName?.trim() || "An alumnus";

  const defaultSubject =
    "Phi Delta Theta Mentorship Opportunity — Application Accepted";

  const defaultBody = `Hi ${safeApplicantName},

Thank you for applying for the ${opportunityTitle}${
    company ? ` at ${company}` : ""
  } mentorship opportunity.

I’d like to move forward with your application.

${alumniNotes?.trim() || ""}

Best,
${safeReviewerName}
${reviewerEmail}`;

  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [copied, setCopied] = useState(false);

  const mailtoHref = useMemo(() => {
    return buildMailtoLink({
      to: applicantEmail,
      subject,
      body,
    });
  }, [applicantEmail, subject, body]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        `To: ${applicantEmail}\nSubject: ${subject}\n\n${body}`
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="surface space-y-6 p-8">
      <div className="space-y-2 text-sm text-fraternity-slate">
        <p>
          <span className="font-semibold text-fraternity-charcoal">To:</span>{" "}
          {applicantEmail}
        </p>
        <p>
          <span className="font-semibold text-fraternity-charcoal">
            Opportunity:
          </span>{" "}
          {opportunityTitle}
        </p>
        <p>
          <span className="font-semibold text-fraternity-charcoal">
            Company:
          </span>{" "}
          {company || "—"}
        </p>
      </div>

      <div>
        <label className="text-sm font-semibold text-fraternity-charcoal">
          Subject
        </label>
        <input
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-fraternity-charcoal">
          Email body
        </label>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={16}
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={mailtoHref}
          className="inline-flex items-center justify-center rounded-full bg-fraternity-burgundy px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Open in my email app
        </a>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-fraternity-charcoal transition hover:bg-fraternity-cream"
        >
          {copied ? "Copied" : "Copy message"}
        </button>

        <Link
          href={`/member/mentorship/${opportunityId}`}
          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-fraternity-charcoal transition hover:bg-fraternity-cream"
        >
          Back to applications
        </Link>
      </div>

      <p className="text-xs text-fraternity-slate">
        This uses your device’s default email handler. The copy button gives you
        a fallback in case mailto is not configured the way you want.
      </p>
    </div>
  );
}