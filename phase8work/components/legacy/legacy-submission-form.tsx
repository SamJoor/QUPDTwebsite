"use client";

import { FormEvent, useState } from "react";

type State = "idle" | "submitting" | "success" | "error";

export function LegacySubmissionForm() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/legacy/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed.");
      }

      setState("success");
      setMessage("Your memory was submitted successfully and is now awaiting admin review.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Submission failed.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">First name</label>
          <input
            name="firstName"
            required
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Last name</label>
          <input
            name="lastName"
            required
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Graduation year</label>
          <input
            type="number"
            name="graduationYear"
            required
            min={1900}
            max={2100}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
          />
        </div>


        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">Title</label>
          <input
            name="title"
            required
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            placeholder="A title for your memory or artifact"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">Memory or description</label>
          <textarea
            name="memoryBody"
            required
            rows={7}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            placeholder="Share the story, context, or meaning of this memory."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Release date</label>
          <input
            type="date"
            name="releaseDate"
            required
            min={today}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
          />
          <p className="mt-2 text-sm text-fraternity-slate">
            Choose when this memory should be released back to you by email after admin approval.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Submission type</label>
          <select
            name="mediaType"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            defaultValue="memory"
          >
            <option value="memory">Memory</option>
            <option value="photo">Photo</option>
            <option value="document">Document</option>
            <option value="video">Video</option>
            <option value="artifact">Artifact</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Optional file upload</label>
          <input
            type="file"
            name="file"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
          />
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white/70 p-4">
        <input type="checkbox" name="consentToPublish" value="true" required className="mt-1" />
        <span className="text-sm text-fraternity-slate">
          I confirm that I am submitting this memory voluntarily and give permission for the chapter to review,
          store, and release it according to the Legacy Vault process.
        </span>
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="rounded-full bg-fraternity-burgundy px-6 py-3 font-medium text-white"
          disabled={state === "submitting"}
        >
          {state === "submitting" ? "Submitting..." : "Submit memory"}
        </button>

        {message ? (
          <p className={`text-sm ${state === "error" ? "text-red-700" : "text-emerald-700"}`}>
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
