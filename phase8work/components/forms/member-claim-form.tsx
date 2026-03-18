'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function MemberClaimForm() {
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
      const response = await fetch('/api/member/claim', {
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
      setMessage(data.message || 'Profile claimed. You can sign in now.');
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
          Phase 7
        </p>
        <h1 className="mt-3 text-4xl">Claim your alumni profile</h1>
        <p className="mt-4 text-fraternity-slate">
          Use the email already associated with your alumni record. This creates your alumni account and links it to the chapter directory record so you can manage your own profile.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field label="Full name">
          <Input name="fullName" placeholder="Michael Harrington" required />
        </Field>

        <Field label="Graduation year">
          <Input name="graduationYear" type="number" placeholder="2014" required />
        </Field>

        <Field label="Email used in alumni records">
          <Input name="email" type="email" placeholder="name@example.org" required />
        </Field>

        <Field
          label="Create a password"
          hint="Phase 7 uses Supabase email/password auth for member accounts."
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
            {state === 'submitting' ? 'Claiming…' : 'Claim profile'}
          </Button>
          <Button href="/member/login" type="button" variant="secondary">
            Back to login
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