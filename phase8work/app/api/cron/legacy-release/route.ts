import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendReleaseEmail(input: {
  to: string;
  title: string;
  memoryBody: string;
  releaseAt: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) return;

  const releaseDateLabel = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(input.releaseAt));
  const safeTitle = escapeHtml(input.title);
  const safeMemoryBody = escapeHtml(input.memoryBody);

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: "Your Legacy Vault memory has been released",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #1f2937;">
          <p style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #8a1c2f; font-weight: 700;">
            Legacy Vault Release
          </p>
          <h1 style="font-size: 28px; margin: 8px 0 16px;">${safeTitle}</h1>
          <p>Your memory reached its selected release date of <strong>${releaseDateLabel}</strong>.</p>
          <div style="margin: 24px 0; padding: 20px; background: #f7f2ee; border-radius: 16px; white-space: pre-wrap;">${safeMemoryBody}</div>
          <p>This copy was sent automatically from the chapter Legacy Vault so your memory returns to you on the date you chose.</p>
        </div>
      `,
    }),
  });
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  const { data: dueItems, error } = await supabase
    .from("legacy_submissions")
    .select("*")
    .eq("status", "approved_scheduled")
    .lte("release_at", new Date().toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  for (const item of dueItems || []) {
    const publishedAt = new Date().toISOString();

    const { error: publishError } = await supabase.from("legacy_vault_items").insert({
      source_submission_id: item.id,
      title: item.title,
      item_type: item.media_type,
      year_label: `${item.graduation_term} ${item.graduation_year}`,
      description: item.memory_body,
      file_url: item.file_url,
      contributor_name: item.full_name,
      status: "approved",
      published_at: publishedAt,
    });

    if (publishError) {
      return NextResponse.json({ error: publishError.message }, { status: 500 });
    }

    await supabase
      .from("legacy_submissions")
      .update({
        status: "published",
        published_at: publishedAt,
        release_email_sent_at: publishedAt,
      })
      .eq("id", item.id);

    if (item.email) {
      await sendReleaseEmail({
        to: item.email,
        title: item.title,
        memoryBody: item.memory_body,
        releaseAt: item.release_at,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    publishedCount: dueItems?.length || 0,
  });
}
