import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getTopMentorSuggestions,
  type MentorRecord,
  type MenteeRequestRecord,
} from "@/lib/mentorship/matching";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await requireSession("admin");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const mentorId = body?.mentorId as string | undefined;
  const menteeRequestId = body?.menteeRequestId as string | undefined;
  const adminNotes = body?.adminNotes as string | undefined;

  if (!mentorId || !menteeRequestId) {
    return NextResponse.json(
      { error: "mentorId and menteeRequestId are required." },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase must be connected for match creation." },
      { status: 500 }
    );
  }

  const [mentorRes, menteeRes] = await Promise.all([
    supabase.from("mentors").select("*").eq("id", mentorId).maybeSingle(),
    supabase.from("mentee_requests").select("*").eq("id", menteeRequestId).maybeSingle(),
  ]);

  if (mentorRes.error || !mentorRes.data) {
    return NextResponse.json({ error: "Mentor not found." }, { status: 404 });
  }

  if (menteeRes.error || !menteeRes.data) {
    return NextResponse.json({ error: "Mentee request not found." }, { status: 404 });
  }

  const suggestion = getTopMentorSuggestions(
    [mentorRes.data as MentorRecord],
    menteeRes.data as MenteeRequestRecord,
    1
  )[0];

  const { error } = await supabase.from("mentorship_matches").upsert(
    {
      mentor_id: mentorId,
      mentee_request_id: menteeRequestId,
      match_status: "proposed",
      match_score: suggestion?.score ?? null,
      match_reason: suggestion?.reasons ?? [],
      admin_notes: adminNotes || null,
      created_by: session.email,
    },
    { onConflict: "mentor_id,mentee_request_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase
    .from("mentee_requests")
    .update({ status: "matched" })
    .eq("id", menteeRequestId);

  return NextResponse.json({ ok: true });
}