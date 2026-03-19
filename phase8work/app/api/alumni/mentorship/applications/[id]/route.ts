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
      .select(`
        id,
        opportunity_id,
        applicant_email,
        resume_path,
        cover_letter_path,
        alumni_notes,
        alumni_profile_id,
        alumni_profiles (
          full_name
        )
      `)
      .eq("id", applicationId)
      .maybeSingle();

    if (applicationRes.error || !applicationRes.data?.id) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    const application = applicationRes.data as {
      id: string;
      opportunity_id: string;
      applicant_email: string;
      resume_path: string | null;
      cover_letter_path: string | null;
      alumni_notes: string | null;
      alumni_profile_id: string;
      alumni_profiles?: {
        full_name?: string | null;
      } | null;
    };

    const opportunityRes = await supabase
      .from("mentorship_opportunities")
      .select("id, alumni_profile_id, title, company")
      .eq("id", application.opportunity_id)
      .maybeSingle();

    if (opportunityRes.error || !opportunityRes.data?.id) {
      return NextResponse.json(
        { error: "Associated opportunity not found." },
        { status: 404 }
      );
    }

    const opportunity = opportunityRes.data as {
      id: string;
      alumni_profile_id: string;
      title: string;
      company: string | null;
    };

    if (opportunity.alumni_profile_id !== alumniProfileId) {
      return NextResponse.json(
        { error: "You do not have permission to review this application." },
        { status: 403 }
      );
    }

    if (status === "declined") {
      if (application.resume_path) {
        const removeResumeRes = await supabase.storage
          .from("mentorship-applications")
          .remove([application.resume_path]);

        if (removeResumeRes.error) {
          console.error(
            "[decline application] failed to delete resume",
            removeResumeRes.error
          );
        }
      }

      if (application.cover_letter_path) {
        const removeCoverRes = await supabase.storage
          .from("mentorship-applications")
          .remove([application.cover_letter_path]);

        if (removeCoverRes.error) {
          console.error(
            "[decline application] failed to delete cover letter",
            removeCoverRes.error
          );
        }
      }

      const deleteRes = await supabase
        .from("mentorship_opportunity_applications")
        .delete()
        .eq("id", applicationId);

      if (deleteRes.error) {
        return NextResponse.json(
          {
            error:
              deleteRes.error.message || "Failed to delete declined application.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        deleted: true,
        applicationId,
        opportunityId: opportunity.id,
        redirectTo: `/member/mentorship/${opportunity.id}`,
      });
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

    if (status === "accepted") {
      return NextResponse.json({
        success: true,
        applicationId,
        opportunityId: opportunity.id,
        redirectTo: `/member/mentorship/${opportunity.id}/applications/${applicationId}/email`,
      });
    }

    return NextResponse.json({
      success: true,
      applicationId,
      opportunityId: opportunity.id,
      redirectTo: `/member/mentorship/${opportunity.id}`,
    });
  } catch (error) {
    console.error("[POST /api/alumni/mentorship/applications/[id]]", error);

    return NextResponse.json(
      { error: "Unexpected server error while reviewing application." },
      { status: 500 }
    );
  }
}