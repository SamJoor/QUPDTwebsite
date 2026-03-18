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
      </div>
    </main>
  );
}