import { getAdminMentorshipDashboard } from "@/lib/queries/admin-mentorship";
import { AdminMentorshipMatchButton } from "@/components/admin/admin-mentorship-match-button";

export const dynamic = "force-dynamic";

export default async function AdminMentorshipPage() {
  const { mentors, mentees, matches, suggestionsByMentee } =
    await getAdminMentorshipDashboard();

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
          Admin module
        </p>
        <h1 className="mt-3 text-4xl">Mentorship matching</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          Review mentors, mentee requests, and suggested pairings. Admins can confirm matches manually while using algorithmic suggestions for speed.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="surface p-8">
          <h2 className="text-2xl">Approved mentors</h2>
          <div className="mt-6 space-y-4">
            {mentors.length ? (
              mentors.map((mentor: any) => (
                <div key={mentor.id} className="rounded-2xl border border-black/10 bg-white/70 p-4">
                  <p className="font-semibold">{mentor.full_name}</p>
                  <p className="mt-1 text-sm text-fraternity-slate">
                    {mentor.job_title || "Mentor"} · {mentor.company || "—"}
                  </p>
                  <p className="mt-1 text-sm text-fraternity-slate">
                    {mentor.industry || "—"} · {mentor.location || "—"}
                  </p>
                  <p className="mt-1 text-sm text-fraternity-slate">
                    Major: {mentor.major || "—"} · Experience: {mentor.years_experience ?? "—"} yrs
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-fraternity-slate">No mentors yet.</p>
            )}
          </div>
        </div>

        <div className="surface p-8">
          <h2 className="text-2xl">Open mentee requests</h2>
          <div className="mt-6 space-y-6">
            {mentees.length ? (
              mentees.map((mentee: any) => {
                const suggestions = suggestionsByMentee[mentee.id] || [];
                return (
                  <div key={mentee.id} className="rounded-2xl border border-black/10 bg-white/70 p-5">
                    <p className="font-semibold">{mentee.full_name}</p>
                    <p className="mt-1 text-sm text-fraternity-slate">
                      Major: {mentee.major || "—"} · Desired industry: {mentee.desired_industry || mentee.industry || "—"}
                    </p>
                    <p className="mt-1 text-sm text-fraternity-slate">
                      Location preference: {mentee.location_preference || mentee.location || "—"}
                    </p>
                    <p className="mt-2 text-sm text-fraternity-slate">
                      Goals: {mentee.goals || "No goals provided."}
                    </p>

                    <div className="mt-4 space-y-3">
                      <p className="text-sm font-semibold text-fraternity-charcoal">Suggested mentors</p>

                      {suggestions.length ? (
                        suggestions.map((suggestion: any) => {
                          const mentor = mentors.find((m: any) => m.id === suggestion.mentorId);
                          if (!mentor) return null;

                          return (
                            <div
                              key={`${mentee.id}-${mentor.id}`}
                              className="rounded-2xl border border-fraternity-charcoal/10 bg-fraternity-cream p-4"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <p className="font-semibold">{mentor.full_name}</p>
                                  <p className="mt-1 text-sm text-fraternity-slate">
                                    {mentor.job_title || "Mentor"} · {mentor.company || "—"}
                                  </p>
                                  <p className="mt-1 text-sm text-fraternity-slate">
                                    Score: {suggestion.score}
                                  </p>
                                  <p className="mt-1 text-sm text-fraternity-slate">
                                    Reasons: {suggestion.reasons.join(", ") || "No reasons"}
                                  </p>
                                </div>

                                <AdminMentorshipMatchButton
                                  mentorId={mentor.id}
                                  menteeRequestId={mentee.id}
                                />
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-fraternity-slate">
                          No suggested mentors yet.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-fraternity-slate">No mentee requests yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="surface p-8">
        <h2 className="text-2xl">Existing matches</h2>
        <div className="mt-6 space-y-4">
          {matches.length ? (
            matches.map((match: any) => (
              <div key={match.id} className="rounded-2xl border border-black/10 bg-white/70 p-4">
                <p className="font-semibold">Match score: {match.match_score ?? "—"}</p>
                <p className="mt-1 text-sm text-fraternity-slate">
                  Status: {match.match_status}
                </p>
                <p className="mt-1 text-sm text-fraternity-slate">
                  Created by: {match.created_by || "admin"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-fraternity-slate">No matches yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}