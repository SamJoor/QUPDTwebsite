'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function LoginForm({ scope, title, description, redirectTo }: { scope: 'admin' | 'alumni'; title: string; description: string; redirectTo: string }) {
  const [state, setState] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('submitting');
    setError('');

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
      scope
    };

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      setState('error');
      setError(data.error || 'Unable to sign in.');
      return;
    }

    window.location.href = redirectTo;
  }

  return (
    <div className="surface mx-auto max-w-xl p-8 md:p-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Secure access</p>
        <h1 className="mt-3 text-4xl">{title}</h1>
        <p className="mt-4 text-fraternity-slate">{description}</p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field label="Email">
          <Input name="email" type="email" placeholder="name@example.org" required />
        </Field>
        <Field label="Password">
          <Input name="password" type="password" placeholder="Enter shared access password" required />
        </Field>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button className="min-w-36">{state === 'submitting' ? 'Signing in…' : 'Sign in'}</Button>
          {state === 'error' ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
        </div>
      </form>
    </div>
  );
}
