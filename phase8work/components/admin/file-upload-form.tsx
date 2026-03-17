'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function FileUploadForm() {
  const router = useRouter();
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

    const title = String(formData.get('title') || '').trim();
    const mediaType = String(formData.get('mediaType') || 'photo').trim();
    const yearLabel = String(formData.get('yearLabel') || '').trim();
    const caption = String(formData.get('caption') || '').trim();

    try {
      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = (await uploadResponse.json()) as {
        error?: string;
        message?: string;
        fileUrl?: string;
        storagePath?: string;
        storageBucket?: string;
      };

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Upload failed.');
      }

      const mediaResponse = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          mediaType,
          yearLabel,
          caption,
          fileUrl: uploadData.fileUrl || '',
          storageBucket: uploadData.storageBucket || '',
          storagePath: uploadData.storagePath || '',
        }),
      });

      const mediaData = (await mediaResponse.json()) as {
        error?: string;
        message?: string;
      };

      if (!mediaResponse.ok) {
        throw new Error(mediaData.error || 'Upload succeeded, but media record could not be created.');
      }

      setState('success');
      setMessage('File uploaded and media record created successfully.');
      setResult({
        fileUrl: uploadData.fileUrl,
        storagePath: uploadData.storagePath,
        storageBucket: uploadData.storageBucket,
      });

      form.reset();
      router.refresh();
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Upload failed.');
    }
  }

  return (
    <div className="surface p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-2xl">Upload file and register media item</h3>
        <p className="mt-3 max-w-2xl text-fraternity-slate">
          Upload a file to Supabase Storage and create the media record in one step.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title">
            <Input name="title" required />
          </Field>

          <Field label="Media type">
            <Select name="mediaType" defaultValue="photo">
              <option value="photo">Photo</option>
              <option value="document">Document</option>
              <option value="video">Video</option>
              <option value="composite">Composite</option>
            </Select>
          </Field>

          <Field label="Year label">
            <Input name="yearLabel" placeholder="1990s / 2026" />
          </Field>

          <Field label="Storage bucket">
            <Input name="bucket" placeholder="legacy-vault" required />
          </Field>

          <Field label="Optional folder path">
            <Input name="folder" placeholder="founders-day/2026" />
          </Field>
        </div>

        <Field label="Caption">
          <Textarea name="caption" rows={4} />
        </Field>

        <Field label="Select file">
          <Input name="file" type="file" required />
        </Field>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button className="min-w-36" variant="primary">
            {state === 'uploading' ? 'Uploading…' : 'Upload media'}
          </Button>

          {message ? (
            <p className={`text-sm font-medium ${state === 'error' ? 'text-red-700' : 'text-emerald-700'}`}>
              {message}
            </p>
          ) : null}
        </div>

        {result ? (
          <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-black/5">
            <p className="text-sm text-fraternity-slate">
              <strong>Bucket:</strong> {result.storageBucket}
            </p>
            <p className="mt-1 break-all text-sm text-fraternity-slate">
              <strong>Path:</strong> {result.storagePath}
            </p>
            {result.fileUrl ? (
              <p className="mt-1 break-all text-sm text-fraternity-slate">
                <strong>URL:</strong> {result.fileUrl}
              </p>
            ) : null}
          </div>
        ) : null}
      </form>
    </div>
  );
}