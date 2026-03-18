"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function MentorshipOpportunityForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      title: String(formData.get("title") || ""),
      opportunityType: String(formData.get("opportunityType") || ""),
      company: String(formData.get("company") || ""),
      location: String(formData.get("location") || ""),
      locationType: String(formData.get("locationType") || ""),
      industry: String(formData.get("industry") || ""),
      description: String(formData.get("description") || ""),
      responsibilities: String(formData.get("responsibilities") || ""),
      requirements: String(formData.get("requirements") || ""),
      preferredMajor: String(formData.get("preferredMajor") || ""),
      preferredYears: String(formData.get("preferredYears") || ""),
      preferredSkills: String(formData.get("preferredSkills") || ""),
      applicationInstructions: String(formData.get("applicationInstructions") || ""),
      contactMethod: String(formData.get("contactMethod") || ""),
      isPaid: formData.get("isPaid") === "on",
      compensation: String(formData.get("compensation") || ""),
      isPublic: formData.get("isPublic") !== null,
      expiresAt: String(formData.get("expiresAt") || ""),
    };

    setState("submitting");
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/alumni/mentorship/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
          fieldErrors || result?.error || "Failed to create opportunity."
        );
      }

      setState("success");
      setSuccessMessage(
        result?.message || "Opportunity created successfully."
      );
      form.reset();
      window.location.reload();
    } catch (err) {
      setState("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the opportunity."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
        Alumni posting
      </p>
      <h2 className="mt-3 text-2xl">Post a mentorship or internship opportunity</h2>
      <p className="mt-4 text-sm text-fraternity-slate">
        Create a real opportunity that active members can view and apply to
        through the mentorship page.
      </p>

      <div className="mt-4 rounded-2xl border border-black/10 bg-white/70 p-4 text-sm text-fraternity-slate">
        <p className="font-semibold text-fraternity-charcoal">Before you submit</p>
        <ul className="mt-2 space-y-1">
          <li>• Title is required and should be at least 3 characters.</li>
          <li>• Description is required and should be at least 20 characters.</li>
          <li>• Opportunity type is required.</li>
          <li>• Public opportunities appear on the website mentorship page.</li>
        </ul>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-semibold text-fraternity-charcoal">
            Title <span className="text-fraternity-slate">(required, 3+ characters)</span>
          </label>
          <input
            id="title"
            name="title"
            required
            minLength={3}
            maxLength={120}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
            placeholder="Summer finance mentorship opportunity"
          />
        </div>

        <div>
          <label
            htmlFor="opportunityType"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Opportunity type <span className="text-fraternity-slate">(required)</span>
          </label>
          <select
            id="opportunityType"
            name="opportunityType"
            required
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
            defaultValue="mentorship"
          >
            <option value="mentorship">Mentorship</option>
            <option value="internship">Internship</option>
            <option value="coffee_chat">Coffee Chat</option>
            <option value="job_shadow">Job Shadow</option>
            <option value="project">Project Collaboration</option>
            <option value="career_advice">Career Advice</option>
          </select>
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-semibold text-fraternity-charcoal">
            Industry
          </label>
          <input
            id="industry"
            name="industry"
            maxLength={120}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
            placeholder="Finance, Technology, Healthcare..."
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-fraternity-charcoal">
            Company
          </label>
          <input
            id="company"
            name="company"
            maxLength={120}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-fraternity-charcoal">
            Location
          </label>
          <input
            id="location"
            name="location"
            maxLength={120}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
            placeholder="New York, NY"
          />
        </div>

        <div>
          <label
            htmlFor="locationType"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Location type
          </label>
          <select
            id="locationType"
            name="locationType"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
            defaultValue=""
          >
            <option value="">Select one</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="in_person">In Person</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="preferredMajor"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Preferred major
          </label>
          <input
            id="preferredMajor"
            name="preferredMajor"
            maxLength={120}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div>
          <label
            htmlFor="preferredYears"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Preferred class years
          </label>
          <input
            id="preferredYears"
            name="preferredYears"
            maxLength={120}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
            placeholder="Sophomore, Junior, Senior"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Description <span className="text-fraternity-slate">(required, 20+ characters)</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            minLength={20}
            maxLength={5000}
            rows={5}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
            placeholder="Describe the opportunity, what the student would gain, and what kind of brother would be a strong fit."
          />
          <p className="mt-2 text-xs text-fraternity-slate">
            Give enough detail so members understand the role, expectations, and value of applying.
          </p>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="responsibilities"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Responsibilities <span className="text-fraternity-slate">(optional)</span>
          </label>
          <textarea
            id="responsibilities"
            name="responsibilities"
            maxLength={5000}
            rows={4}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="requirements"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Requirements <span className="text-fraternity-slate">(optional)</span>
          </label>
          <textarea
            id="requirements"
            name="requirements"
            maxLength={5000}
            rows={4}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="preferredSkills"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Preferred skills <span className="text-fraternity-slate">(optional)</span>
          </label>
          <textarea
            id="preferredSkills"
            name="preferredSkills"
            maxLength={1000}
            rows={3}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="applicationInstructions"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Application instructions <span className="text-fraternity-slate">(optional)</span>
          </label>
          <textarea
            id="applicationInstructions"
            name="applicationInstructions"
            maxLength={2000}
            rows={3}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
            placeholder="Submit a resume and short note explaining interest."
          />
        </div>

        <div>
          <label
            htmlFor="contactMethod"
            className="block text-sm font-semibold text-fraternity-charcoal"
          >
            Preferred contact method
          </label>
          <input
            id="contactMethod"
            name="contactMethod"
            maxLength={80}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
            placeholder="Platform, email, phone, LinkedIn..."
          />
        </div>

        <div>
          <label htmlFor="expiresAt" className="block text-sm font-semibold text-fraternity-charcoal">
            Expiration date
          </label>
          <input
            id="expiresAt"
            name="expiresAt"
            type="date"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
          />
        </div>

        <div>
          <label htmlFor="compensation" className="block text-sm font-semibold text-fraternity-charcoal">
            Compensation
          </label>
          <input
            id="compensation"
            name="compensation"
            maxLength={120}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-fraternity-burgundy"
            placeholder="Optional stipend / paid internship details"
          />
        </div>

        <div className="flex items-center gap-3 pt-8">
          <input
            id="isPaid"
            name="isPaid"
            type="checkbox"
            className="h-4 w-4 rounded border-black/20"
          />
          <label htmlFor="isPaid" className="text-sm font-semibold text-fraternity-charcoal">
            Paid opportunity
          </label>
        </div>

        <div className="flex items-center gap-3 pt-8">
          <input
            id="isPublic"
            name="isPublic"
            type="checkbox"
            defaultChecked
            className="h-4 w-4 rounded border-black/20"
          />
          <label htmlFor="isPublic" className="text-sm font-semibold text-fraternity-charcoal">
            Show publicly on mentorship page
          </label>
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

      <div className="mt-8">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex items-center justify-center rounded-full bg-fraternity-burgundy px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "submitting" ? "Creating..." : "Create opportunity"}
        </button>
      </div>
    </form>
  );
}