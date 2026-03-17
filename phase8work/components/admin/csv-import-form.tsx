'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';

export function CsvImportForm() {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('submitting');
    setMessage('');
    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/admin/import/alumni', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setState('error');
      setMessage(data.error || 'Unable to import CSV.');
      return;
    }
    setState('success');
    setMessage(data.message || 'CSV imported successfully.');
  }

  return (
    <div className="surface p-8">
      <h2 className="text-2xl">Import alumni CSV</h2>
      <p className="mt-3 max-w-2xl text-sm text-fraternity-slate">Upload one CSV containing alumni/member data. This importer upserts on email first, then falls back to full name + graduation year.</p>
      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-fraternity-charcoal">CSV file</label>
          <input className="mt-2 block w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm" name="file" type="file" accept=".csv,text/csv" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-fraternity-charcoal">Or paste CSV text</label>
          <textarea className="mt-2 block min-h-56 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm" name="csvText" placeholder="full_name,email,graduation_year,..."></textarea>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button>{state === 'submitting' ? 'Importing…' : 'Run import'}</Button>
          {state === 'success' ? <p className="text-sm font-medium text-emerald-700">{message}</p> : null}
          {state === 'error' ? <p className="text-sm font-medium text-red-700">{message}</p> : null}
        </div>
      </form>
    </div>
  );
}
