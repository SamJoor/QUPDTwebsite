"use client";

import { useState } from "react";

export function AdminMentorshipMatchButton({
  mentorId,
  menteeRequestId,
}: {
  mentorId: string;
  menteeRequestId: string;
}) {
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function handleClick() {
    setState("saving");

    try {
      const response = await fetch("/api/admin/mentorship/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mentorId, menteeRequestId }),
      });

      if (!response.ok) {
        throw new Error("Unable to create match.");
      }

      setState("done");
      window.location.reload();
    } catch {
      setState("error");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === "saving"}
      className="rounded-full bg-fraternity-burgundy px-4 py-2 text-sm font-medium text-white"
    >
      {state === "saving"
        ? "Matching..."
        : state === "done"
        ? "Matched"
        : state === "error"
        ? "Try again"
        : "Create match"}
    </button>
  );
}