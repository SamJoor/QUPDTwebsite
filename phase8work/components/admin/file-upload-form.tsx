'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function FileUploadForm() {
  const [state, setState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<{ fileUrl?: string; storagePath?: string; storageBucket?: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('uploading');
    setMessage('');
    setResult(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
        fileUrl?: string;
        storagePath?: string;
        storageBucket?: string;
      };

      if (!response.ok) throw new Error(data.error || 'Upload failed.');

      setState('success');
      setMessage(data.message || 'Upload complete.');
      setResult({
        fileUrl: data.fileUrl,
        storagePath: data.storagePath,
        storageBucket: data.storageBucket,
      });
      form.reset();
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Upload failed.');
    }
  }

  return (
    <div className="surface p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-2xl">Upload file to Supabase Storage</h3>
        <p className="mt-3 max-w-2xl text-fraternity-slate">
          This requires Supabase to be connected. Upload a file to a bucket first, then use the returned bucket and path in the media record below.
        </p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Storage bucket">
            <Input name="bucket" placeholder="legacy-vault" required />
          </Field>
          <Field label="Optional folder path">
            <Input name="folder" placeholder="founders-day/2026" />
          </Field>
        </div>
        <Field label="Select file">
          <Input name="file" type="file" required />
        </Field>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button className="min-w-36" variant="primary">
            {state === 'uploading' ? 'Uploading…' : 'Upload file'}
          </Button>
          {message ? (
            <p className={`text-sm font-medium ${state === 'error' ? 'text-red-700' : 'text-emerald-700'}`}>{message}</p>
          ) : null}
        </div>
        {result ? (
          <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-black/5">
            <p className="text-sm text-fraternity-slate"><strong>Bucket:</strong> {result.storageBucket}</p>
            <p className="mt-1 break-all text-sm text-fraternity-slate"><strong>Path:</strong> {result.storagePath}</p>
            {result.fileUrl ? <p className="mt-1 break-all text-sm text-fraternity-slate"><strong>URL:</strong> {result.fileUrl}</p> : null}
          </div>
        ) : null}
      </form>
    </div>
  );
}
