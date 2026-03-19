import { NextResponse } from "next/server";
import { Resend } from "resend";
import { requireSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type NewsletterRecord = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  subject_line: string | null;
  summary: string | null;
  body_content: string | null;
  status: string | null;
};

type SubscriberRecord = {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://ctepsilonphidelts.org"
  ).replace(/\/+$/, "");
}

async function getActiveSubscribers(
  supabase: NonNullable<ReturnType<typeof createServerSupabaseClient>>
): Promise<{ subscribers: SubscriberRecord[]; mode: string }> {
  const firstAttempt = await supabase
    .from("newsletter_subscribers")
    .select("email, first_name, last_name")
    .eq("is_active", true);

  if (!firstAttempt.error && Array.isArray(firstAttempt.data)) {
    const subscribers = firstAttempt.data.filter(
      (row: any) => typeof row.email === "string" && row.email.trim().length > 0
    ) as SubscriberRecord[];

    return {
      subscribers,
      mode: "resolved",
    };
  }

  const secondAttempt = await supabase
    .from("newsletter_subscribers")
    .select("email, first_name, last_name")
    .eq("status", "active");

  if (!secondAttempt.error && Array.isArray(secondAttempt.data)) {
    const subscribers = secondAttempt.data.filter(
      (row: any) => typeof row.email === "string" && row.email.trim().length > 0
    ) as SubscriberRecord[];

    return {
      subscribers,
      mode: "resolved",
    };
  }

  const thirdAttempt = await supabase
    .from("newsletter_subscribers")
    .select("email, first_name, last_name");

  if (!thirdAttempt.error && Array.isArray(thirdAttempt.data)) {
    const subscribers = thirdAttempt.data.filter(
      (row: any) => typeof row.email === "string" && row.email.trim().length > 0
    ) as SubscriberRecord[];

    return {
      subscribers,
      mode: "resolved",
    };
  }

  return {
    subscribers: [],
    mode: "unavailable",
  };
}

export async function POST(_request: Request, context: RouteContext) {
  try {
    const session = await requireSession();

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to send newsletters." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Newsletter id is required." },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Database connection unavailable." },
        { status: 500 }
      );
    }

    const newsletterRes = await supabase
      .from("newsletters")
      .select(
        "id, title, slug, category, subject_line, summary, body_content, status"
      )
      .eq("id", id)
      .maybeSingle();

    if (newsletterRes.error || !newsletterRes.data) {
      return NextResponse.json(
        { error: "Newsletter not found." },
        { status: 404 }
      );
    }

    const newsletter = newsletterRes.data as NewsletterRecord;

    if (!newsletter.slug) {
      return NextResponse.json(
        { error: "Newsletter slug is missing. This issue cannot be sent yet." },
        { status: 400 }
      );
    }

    const siteUrl = getSiteUrl();
    const issueUrl = `${siteUrl}/newsletter/${newsletter.slug}`;

    const { subscribers, mode } = await getActiveSubscribers(supabase);

    if (!subscribers.length) {
      return NextResponse.json(
        {
          error:
            mode === "unavailable"
              ? "Subscriber records could not be loaded."
              : "No active newsletter subscribers were found.",
        },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFromEmail = process.env.RESEND_FROM_EMAIL;

    // Keep your old preview-mode behavior if env vars are not set.
    if (!resendApiKey || !resendFromEmail) {
      return NextResponse.json({
        success: true,
        preview: true,
        newsletterId: newsletter.id,
        subscriberCount: subscribers.length,
        issueUrl,
        message:
          "Preview mode: RESEND_API_KEY or RESEND_FROM_EMAIL is missing, so no emails were sent.",
      });
    }

    const resend = new Resend(resendApiKey);

    const subject =
      newsletter.subject_line?.trim() || newsletter.title || "Phi Delta Theta Newsletter";

    const summary = newsletter.summary?.trim() || "";
    const bodyContent = newsletter.body_content?.trim() || "";

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <p style="margin: 0 0 16px 0; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #64748b;">
          ${escapeHtml(newsletter.category || "Newsletter")}
        </p>

        <h1 style="margin: 0 0 16px 0; font-size: 28px; line-height: 1.2;">
          ${escapeHtml(newsletter.title)}
        </h1>

        ${
          summary
            ? `<p style="margin: 0 0 20px 0; font-size: 16px; color: #475569;">${escapeHtml(
                summary
              )}</p>`
            : ""
        }

        ${
          bodyContent
            ? `<div style="margin: 0 0 24px 0; white-space: pre-wrap; color: #334155;">${escapeHtml(
                bodyContent
              )}</div>`
            : ""
        }

        <p style="margin: 24px 0;">
          <a
            href="${issueUrl}"
            style="display: inline-block; padding: 12px 18px; border-radius: 9999px; background: #7c3aed; color: #ffffff; text-decoration: none; font-weight: 600;"
          >
            Read the full issue
          </a>
        </p>

        <p style="margin: 16px 0 0 0; font-size: 14px; color: #64748b;">
          Direct link: <a href="${issueUrl}">${issueUrl}</a>
        </p>
      </div>
    `;

    const text = [
      newsletter.title,
      "",
      summary,
      "",
      bodyContent,
      "",
      `Read the full issue: ${issueUrl}`,
    ]
      .filter(Boolean)
      .join("\n");

    const recipientList = subscribers.map((subscriber) => subscriber.email);

    const sendResult = await resend.emails.send({
      from: resendFromEmail,
      to: recipientList,
      subject,
      html,
      text,
    });

    const updateRes = await supabase
      .from("newsletters")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", newsletter.id);

    if (updateRes.error) {
      return NextResponse.json(
        {
          error:
            updateRes.error.message ||
            "Emails were sent, but the newsletter status could not be updated.",
          sendResult,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      newsletterId: newsletter.id,
      subscriberCount: recipientList.length,
      issueUrl,
      sendResult,
    });
  } catch (error) {
    console.error("[POST /api/admin/newsletters/[id]/send]", error);

    return NextResponse.json(
      { error: "Unexpected server error while sending newsletter." },
      { status: 500 }
    );
  }
}