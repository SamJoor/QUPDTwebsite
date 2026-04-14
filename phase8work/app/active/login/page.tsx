import Link from 'next/link';
import { LoginForm } from "@/components/auth/login-form";

export default function ActiveLoginPage() {
  return (
    <main className="min-h-screen bg-fraternity-cream px-6 py-16">
      <div className="mx-auto max-w-xl space-y-6">
        <LoginForm
          scope="active"
          title="Active member access"
          description="Current brothers can sign in here to apply for opportunities, track application status, and access protected member resources."
          redirectTo="/active"
        />
        <div className="surface p-6 text-sm text-fraternity-slate">
          <p className="font-semibold text-fraternity-charcoal">Need an account first?</p>
          <p className="mt-2">Request a secure setup link sent to the email already tied to your chapter record, then finish creating your own password from that link.</p>
          <Link href="/active/claim" className="mt-4 inline-flex rounded-full bg-fraternity-burgundy px-4 py-2 font-medium text-white">Request setup link</Link>
        </div>
      </div>
    </main>
  );
}
