'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function ActiveClaimCompleteForm({ token, email }: { token: string; email: string }) {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('submitting');
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (password !== confirmPassword) {
      setState('error');
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('/api/active/claim/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setState('error');
        setMessage(data.error || 'Unable to finish account setup.');
        return;
      }

      setState('success');
      setMessage(data.message || 'Password set successfully. You can sign in now.');
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Unable to finish account setup.');
    }
  }

  return (
    <div className="surface mx-auto max-w-2xl p-8 md:p-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
          Active access
        </p>
        <h1 className="mt-3 text-4xl">Finish setting your password</h1>
        <p className="mt-4 text-fraternity-slate">
          This setup link is tied to <strong>{email}</strong>. Create your password below to complete your active-member account.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field label="Create a password">
          <Input name="password" type="password" placeholder="At least 8 characters" minLength={8} required />
        </Field>

        <Field label="Confirm password">
          <Input name="confirmPassword" type="password" placeholder="Re-enter your password" minLength={8} required />
        </Field>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button className="min-w-40">
            {state === 'submitting' ? 'Saving password...' : 'Finish setup'}
          </Button>
          <Button href="/active/login" type="button" variant="secondary">
            Back to login
          </Button>
        </div>

        {state === 'success' ? (
          <div className="space-y-3 text-sm font-medium text-emerald-700">
            <p>{message}</p>
            <p>
              <a href="/active/login" className="text-fraternity-burgundy underline underline-offset-4">
                Continue to active login
              </a>
            </p>
          </div>
        ) : null}

        {state === 'error' ? (
          <p className="text-sm font-medium text-red-700">{message}</p>
        ) : null}
      </form>
    </div>
  );
}
