'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function AdminDeleteButton({ endpoint, id }: { endpoint: string; id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm('Delete this record?');
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`${endpoint}?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error((data as { error?: string }).error || 'Delete failed.');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Delete failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="ghost" className="px-3 py-2 text-xs" onClick={handleDelete}>
      {loading ? 'Deleting…' : 'Delete'}
    </Button>
  );
}
