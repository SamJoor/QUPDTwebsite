import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("legacy_submissions")
    .update({
      status: "approved_scheduled",
      reviewed_at: new Date().toISOString(),
      reviewed_by: "admin",
    })
    .eq("id", id)
    .eq("status", "submitted");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/admin/legacy-review", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}