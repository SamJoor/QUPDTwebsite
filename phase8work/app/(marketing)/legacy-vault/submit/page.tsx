import { LegacySubmissionForm } from "@/components/legacy/legacy-submission-form";

export default function LegacyVaultSubmitPage() {
  return (
    <main className="min-h-screen bg-fraternity-cream px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="surface p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
            Legacy Vault Submission
          </p>
          <h1 className="mt-4 text-4xl">Share a memory for the chapter archive</h1>
          <p className="mt-4 max-w-2xl text-fraternity-slate">
            Submissions are limited to people whose identity can be verified against chapter records.
            Approved memories are scheduled for release ten years after graduation.
          </p>

          <div className="mt-10">
            <LegacySubmissionForm />
          </div>
        </div>
      </div>
    </main>
  );
}