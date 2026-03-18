import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type ResolvedAlumni =
  | { error: string }
  | {
      supabase: NonNullable<ReturnType<typeof createServerSupabaseClient>>;
      alumniProfileId: string;
    };

function normalizeOptional(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function isAllowedStatus(value: string) {
  return ["under_review", "accepted", "declined"].includes(value);
}

async function resolveLoggedInAlumniProfileId(
  email: string
): Promise<ResolvedAlumni> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return { error: "Database connection unavailable." };
  }

  const privateDetailsRes = await supabase
    .from("alumni_private_details")
    .select("alumni_profile_id")
    .eq("email", email)
    .maybeSingle();

  if (privateDetailsRes.error || !privateDetailsRes.data?.alumni_profile_id) {
    return {
      error:
        "We could not connect this session to an alumni record. Make sure your portal email matches the alumni database.",
    };
  }

  return {
    supabase,
    alumniProfileId: privateDetailsRes.data.alumni_profile_id as string,
  };
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to review applications." },
        { status: 401 }
      );
    }

    const { id: applicationId } = await context.params;
    const resolved = await resolveLoggedInAlumniProfileId(session.email);

    if ("error" in resolved) {
      return NextResponse.json({ error: resolved.error }, { status: 403 });
    }

    const { supabase, alumniProfileId } = resolved;

    const formData = (await request.formData()) as any;
    const status = String(formData.get("status") || "");
    const alumniNotes = normalizeOptional(formData.get("alumniNotes"));

    if (!isAllowedStatus(status)) {
      return NextResponse.json(
        { error: "Invalid application status." },
        { status: 400 }
      );
    }

    const applicationRes = await supabase
      .from("mentorship_opportunity_applications")
      .select("id, opportunity_id")
      .eq("id", applicationId)
      .maybeSingle();

    if (applicationRes.error || !applicationRes.data?.id) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    const opportunityRes = await supabase
      .from("mentorship_opportunities")
      .select("id, alumni_profile_id")
      .eq("id", applicationRes.data.opportunity_id)
      .maybeSingle();

    if (opportunityRes.error || !opportunityRes.data?.id) {
      return NextResponse.json(
        { error: "Associated opportunity not found." },
        { status: 404 }
      );
    }

    if (opportunityRes.data.alumni_profile_id !== alumniProfileId) {
      return NextResponse.json(
        { error: "You do not have permission to review this application." },
        { status: 403 }
      );
    }

    const updateRes = await supabase
      .from("mentorship_opportunity_applications")
      .update({
        status,
        alumni_notes: alumniNotes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", applicationId)
      .select("id")
      .single();

    if (updateRes.error) {
      return NextResponse.json(
        { error: updateRes.error.message || "Failed to update application." },
        { status: 500 }
      );
    }

    return NextResponse.redirect(
      new URL(
        `/member/mentorship/${applicationRes.data.opportunity_id}`,
        request.url
      ),
      { status: 303 }
    );
  } catch (error) {
    console.error("[POST /api/alumni/mentorship/applications/[id]]", error);

    return NextResponse.json(
      { error: "Unexpected server error while reviewing application." },
      { status: 500 }
    );
  }
}