'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function ActiveClaimRequestForm() {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('submitting');
    setMessage('');
    setPreviewUrl(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/active/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: String(formData.get('email') || '') })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setState('error');
        setMessage(data.error || 'Unable to start account setup.');
        return;
      }

      setState('success');
      setMessage(data.message || 'If that email matches an active-member record, we sent a secure setup link.');
      setPreviewUrl(typeof data.previewUrl === 'string' ? data.previewUrl : null);
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Unable to start account setup.');
    }
  }

  return (
    <div className="surface mx-auto max-w-2xl p-8 md:p-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
          Active access
        </p>
        <h1 className="mt-3 text-4xl">Request your account setup link</h1>
        <p className="mt-4 text-fraternity-slate">
          Enter the email already tied to your chapter record. If it matches an eligible active-member profile, we&apos;ll send a secure link so you can finish setting your password.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field label="Email used in chapter records">
          <Input name="email" type="email" placeholder="name@example.org" required />
        </Field>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button className="min-w-40">
            {state === 'submitting' ? 'Sending link...' : 'Send setup link'}
          </Button>
          <Button href="/active/login" type="button" variant="secondary">
            Back to login
          </Button>
        </div>

        {state === 'success' ? (
          <div className="space-y-3 text-sm font-medium text-emerald-700">
            <p>{message}</p>
            {previewUrl ? (
              <p className="text-fraternity-charcoal">
                Dev preview link: <a href={previewUrl} className="text-fraternity-burgundy underline underline-offset-4">{previewUrl}</a>
              </p>
            ) : null}
          </div>
        ) : null}

        {state === 'error' ? (
          <p className="text-sm font-medium text-red-700">{message}</p>
        ) : null}
      </form>
    </div>
  );
}
