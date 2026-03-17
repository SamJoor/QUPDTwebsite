'use client';

import { Button } from '@/components/ui/button';

export function LogoutButton({ redirectTo = '/' }: { redirectTo?: string }) {
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = redirectTo;
  }

  return (
    <Button type="button" variant="secondary" onClick={handleLogout}>
      Sign out
    </Button>
  );
}
