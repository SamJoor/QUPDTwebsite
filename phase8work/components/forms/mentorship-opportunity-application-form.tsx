"use client";

import { useMemo, useState } from "react";
import type { MentorshipOpportunityRecord } from "@/lib/queries/mentorship-opportunities";

type Props = {
  opportunity: MentorshipOpportunityRecord;
  defaults?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    graduationYear?: number;
    major?: string;
    linkedinUrl?: string;
    bondNumber?: string;
  };
};

type FormState = "idle" | "submitting" | "success" | "error";

const ACCEPTED_FILE_TYPES = ".pdf,.doc,.docx";

export function MentorshipOpportunityApplicationForm({
  opportunity,
  defaults,
}: Props) {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const endpoint = useMemo(
    () => `/api/mentorship/opportunities/${opportunity.id}/apply`,
    [opportunity.id]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setState("submitting");
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const fieldErrors = result?.issues?.fieldErrors
          ? Object.values(result.issues.fieldErrors)
              .flat()
              .filter(Boolean)
              .join(" ")
          : "";

        throw new Error(
          fieldErrors || result?.error || "Unable to submit application."
        );
      }

      setState("success");
      setSuccessMessage(
        result?.message ||
          "Application submitted successfully. The alumni poster and admin team can now review it."
      );
      form.reset();
    } catch (err) {
      setState("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting your application."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="surface p-8"
      encType="multipart/form-data"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
            Verified application
          </p>
          <h2 className="mt-3 text-2xl">Member application form</h2>
        </div>
      </div>

      <p className="mt-4 text-sm text-fraternity-slate">
        Your information has been prefilled from your active-member record where
        possible. Review it carefully before submitting.
      </p>

      <div className="mt-4 rounded-2xl border border-black/10 bg-white/70 p-4 text-sm text-fraternity-slate">
        <p className="font-semibold text-fraternity-charcoal">
          Before you submit
        </p>
        <ul className="mt-2 space-y-1">
          <li>
            • First name, last name, graduation year, bond number, and email
            should match fraternity records.
          </li>
          <li>• Introductory message is required.</li>
          <li>• Why interested is required.</li>
          <li>• Resume is required.</li>
          <li>• Accepted files: PDF, DOC, DOCX.</li>
          <li>• Cover letter is optional.</li>
        </ul>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            First name <span className="text-fraternity-slate">(must match records)</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            maxLength={80}
            defaultValue={defaults?.firstName || ""}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Last name <span className="text-fraternity-slate">(must match records)</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            maxLength={80}
            defaultValue={defaults?.lastName || ""}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div>
          <label
            htmlFor="bondNumber"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Bond number <span className="text-fraternity-slate">(must match records)</span>
          </label>
          <input
            id="bondNumber"
            name="bondNumber"
            required
            maxLength={50}
            defaultValue={defaults?.bondNumber || ""}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Email <span className="text-fraternity-slate">(must match records)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={160}
            defaultValue={defaults?.email || ""}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            maxLength={40}
            defaultValue={defaults?.phone || ""}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div>
          <label
            htmlFor="graduationYear"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Graduation year <span className="text-fraternity-slate">(must match records)</span>
          </label>
          <input
            id="graduationYear"
            name="graduationYear"
            type="number"
            required
            min={2000}
            max={2100}
            defaultValue={defaults?.graduationYear || ""}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div>
          <label
            htmlFor="major"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Major
          </label>
          <input
            id="major"
            name="major"
            required
            maxLength={120}
            defaultValue={defaults?.major || ""}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div>
          <label
            htmlFor="linkedinUrl"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            LinkedIn URL
          </label>
          <input
            id="linkedinUrl"
            name="linkedinUrl"
            type="url"
            maxLength={250}
            defaultValue={defaults?.linkedinUrl || ""}
            placeholder="https://linkedin.com/in/..."
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="preferredContactMethod"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Preferred contact method
          </label>
          <input
            id="preferredContactMethod"
            name="preferredContactMethod"
            maxLength={80}
            placeholder="Email, phone, LinkedIn, etc."
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Introductory message <span className="text-fraternity-slate">(required)</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            maxLength={3000}
            rows={4}
            placeholder="Introduce yourself and explain why you are reaching out."
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
          <p className="mt-2 text-xs text-fraternity-slate">
            Give a brief introduction and enough context for the alumnus to understand who you are.
          </p>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="whyInterested"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Why are you interested in this opportunity? <span className="text-fraternity-slate">(required)</span>
          </label>
          <textarea
            id="whyInterested"
            name="whyInterested"
            required
            minLength={10}
            maxLength={3000}
            rows={4}
            placeholder="Explain why this opportunity is a fit for your goals."
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="experienceSummary"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Experience summary <span className="text-fraternity-slate">(optional)</span>
          </label>
          <textarea
            id="experienceSummary"
            name="experienceSummary"
            maxLength={3000}
            rows={4}
            placeholder="Relevant classes, work experience, leadership, technical skills, etc."
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div>
          <label
            htmlFor="resume"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Resume <span className="text-fraternity-slate">(required)</span>
          </label>
          <input
            id="resume"
            name="resume"
            type="file"
            required
            accept={ACCEPTED_FILE_TYPES}
            className="mt-2 block w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
          />
          <p className="mt-2 text-xs text-fraternity-slate">
            Accepted: PDF, DOC, DOCX. Max size: 5 MB.
          </p>
        </div>

        <div>
          <label
            htmlFor="coverLetter"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Cover letter
          </label>
          <input
            id="coverLetter"
            name="coverLetter"
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            className="mt-2 block w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
          />
          <p className="mt-2 text-xs text-fraternity-slate">
            Optional. Accepted: PDF, DOC, DOCX. Max size: 5 MB.
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex items-center justify-center rounded-full bg-fraternity-burgundy px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "submitting" ? "Submitting..." : "Submit application"}
        </button>
      </div>
    </form>
  );
}