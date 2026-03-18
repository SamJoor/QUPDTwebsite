import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { LegacySubmissionForm } from "@/components/legacy/legacy-submission-form";

export default async function LegacyVaultSubmitPage() {
  const session = await requireSession("active");

  if (!session) {
    redirect("/active/login");
  }

  return (
    <main className="min-h-screen bg-fraternity-cream px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="surface p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
            Legacy Vault Submission
          </p>
          <h1 className="mt-4 text-4xl">Share a memory for the chapter archive</h1>
          <p className="mt-4 max-w-2xl text-fraternity-slate">
            This submission form is limited to verified active members. Approved
            memories are scheduled for release ten years after graduation.
          </p>

          <div className="mt-10">
            <LegacySubmissionForm />
          </div>
        </div>
      </div>
    </main>
  );
}