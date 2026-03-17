import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data: row, error: fetchError } = await supabase
    .from("legacy_submissions")
    .select("storage_bucket, storage_path")
    .eq("id", id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (row?.storage_bucket && row?.storage_path) {
    await supabase.storage.from(row.storage_bucket).remove([row.storage_path]);
  }

  const { error: deleteError } = await supabase
    .from("legacy_submissions")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/admin/legacy-review", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}