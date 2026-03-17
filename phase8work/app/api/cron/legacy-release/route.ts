import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

async function sendReleaseEmail(to: string, title: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "Your Legacy Vault memory has been released",
      html: `<p>Your submission "<strong>${title}</strong>" has now been published in the chapter Legacy Vault.</p>`,
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
    await supabase.from("legacy_vault_items").insert({
      source_submission_id: item.id,
      title: item.title,
      item_type: item.media_type,
      year_label: `${item.graduation_term} ${item.graduation_year}`,
      description: item.memory_body,
      file_url: item.file_url,
      published_at: new Date().toISOString(),
    });

    await supabase
      .from("legacy_submissions")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        release_email_sent_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    await sendReleaseEmail(item.email, item.title);
  }

  return NextResponse.json({
    ok: true,
    publishedCount: dueItems?.length || 0,
  });
}