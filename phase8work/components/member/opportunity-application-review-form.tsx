"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  applicationId: string;
  initialNotes?: string | null;
};

export function OpportunityApplicationReviewForm({
  applicationId,
  initialNotes,
}: Props) {
  const router = useRouter();
  const [alumniNotes, setAlumniNotes] = useState(initialNotes ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitReview(
    status: "accepted" | "declined" | "under_review"
  ) {
    try {
      setIsSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append("status", status);
      formData.append("alumniNotes", alumniNotes);

      const response = await fetch(
        `/api/alumni/mentorship/applications/${applicationId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update application.");
      }

      if (data.redirectTo) {
        router.push(data.redirectTo);
        router.refresh();
        return;
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <label className="block text-sm font-semibold text-fraternity-charcoal">
        Message to applicant
      </label>

      <textarea
        value={alumniNotes}
        onChange={(event) => setAlumniNotes(event.target.value)}
        rows={4}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
        placeholder="Add next steps for an accepted applicant, or explain why they were declined."
      />

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => submitReview("accepted")}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-fraternity-burgundy px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Accept"}
        </button>

        <button
          type="button"
          onClick={() => submitReview("declined")}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-fraternity-charcoal transition hover:bg-fraternity-cream disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Decline"}
        </button>

        <button
          type="button"
          onClick={() => submitReview("under_review")}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-fraternity-charcoal transition hover:bg-fraternity-cream disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Mark under review"}
        </button>
      </div>
    </div>
  );
}