'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type MemberClaimFormProps = {
  audience?: 'alumni' | 'active';
  apiEndpoint?: string;
  title?: string;
  description?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  backHref?: string;
  backLabel?: string;
  successMessage?: string;
  submitLabel?: string;
};

export function MemberClaimForm({
  audience = 'alumni',
  apiEndpoint = '/api/member/claim',
  title = 'Claim your alumni profile',
  description = 'Use the email already associated with your alumni record. This creates your alumni account and links it to the chapter directory record so you can manage your own profile.',
  emailLabel = 'Email used in alumni records',
  emailPlaceholder = 'name@example.org',
  backHref = '/member/login',
  backLabel = 'Back to login',
  successMessage = 'Profile claimed. You can sign in now.',
  submitLabel = 'Claim profile'
}: MemberClaimFormProps) {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    setState('submitting');
    setMessage('');

    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get('fullName') || ''),
      graduationYear: Number(formData.get('graduationYear') || 0),
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || '')
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setState('error');
        setMessage(data.error || 'Unable to claim your profile.');
        return;
      }

      setState('success');
      setMessage(data.message || successMessage);
      form.reset();
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Unable to claim your profile.');
    }
  }

  return (
    <div className="surface mx-auto max-w-2xl p-8 md:p-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
          {audience === 'active' ? 'Active access' : 'Phase 7'}
        </p>
        <h1 className="mt-3 text-4xl">{title}</h1>
        <p className="mt-4 text-fraternity-slate">{description}</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field label="Full name">
          <Input name="fullName" placeholder="Michael Harrington" required />
        </Field>

        <Field label="Graduation year">
          <Input name="graduationYear" type="number" placeholder="2014" required />
        </Field>

        <Field label={emailLabel}>
          <Input name="email" type="email" placeholder={emailPlaceholder} required />
        </Field>

        <Field
          label="Create a password"
          hint="This uses Supabase email/password auth for member accounts."
        >
          <Input
            name="password"
            type="password"
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
        </Field>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button className="min-w-40">
            {state === 'submitting' ? 'Claiming...' : submitLabel}
          </Button>
          <Button href={backHref} type="button" variant="secondary">
            {backLabel}
          </Button>
        </div>

        {state === 'success' ? (
          <p className="text-sm font-medium text-emerald-700">{message}</p>
        ) : null}

        {state === 'error' ? (
          <p className="text-sm font-medium text-red-700">{message}</p>
        ) : null}
      </form>
    </div>
  );
}
