import { LoginForm } from '@/components/auth/login-form';

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-fraternity-cream px-6 py-16">
      <LoginForm
        scope="admin"
        title="Officer & administrator access"
        description="Use the shared admin password and an approved email to enter the chapter operations workspace. In production, replace this with Supabase Auth or magic-link sign-in."
        redirectTo="/admin"
      />
    </main>
  );
}
