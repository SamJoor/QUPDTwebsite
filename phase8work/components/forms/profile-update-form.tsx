'use client';

import { FormEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field } from '@/components/ui/field';

export function ProfileUpdateForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/member/profile-request', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData.entries())),
        headers: { 'Content-Type': 'application/json' },
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus('error');
        setMessage(payload.error || 'Unable to submit your profile request.');
        return;
      }

      form.reset();
      setStatus('success');
      setMessage(payload.message || 'Profile update request submitted.');
    } catch {
      setStatus('error');
      setMessage('Unexpected network error.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface space-y-5 p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Member request</p>
        <h2 className="mt-3 text-3xl">Request a profile update</h2>
        <p className="mt-3 max-w-2xl text-sm text-fraternity-slate">Use this before self-service profile editing is live. Officers can review and apply your changes from the admin queue.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full name"><Input name="fullName" required /></Field>
        <Field label="Email"><Input name="email" type="email" required /></Field>
        <Field label="Graduation year"><Input name="graduationYear" placeholder="2018" /></Field>
        <Field label="LinkedIn URL"><Input name="linkedinUrl" placeholder="https://linkedin.com/in/..." /></Field>
      </div>
      <Field label="What should be updated?"><Textarea name="requestedChanges" rows={6} placeholder="Company, title, location, mentorship interest, bio, contact preferences..." required /></Field>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === 'submitting'} className="rounded-full bg-fraternity-burgundy px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60">
          {status === 'submitting' ? 'Submitting…' : 'Submit request'}
        </button>
        {message ? <p className={`text-sm ${status === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message}</p> : null}
      </div>
    </form>
  );
}
