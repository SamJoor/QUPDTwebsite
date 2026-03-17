'use client';

import { FormEvent, ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type ApiFormProps = {
  title: string;
  description: string;
  endpoint: string;
  successMessage: string;
  submitLabel?: string;
  method?: 'POST' | 'PUT';
  children: ReactNode;
};

export function ApiForm({ title, description, endpoint, successMessage, submitLabel = 'Submit', method = 'POST', children }: ApiFormProps) {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('submitting');
    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, unknown> = {};

    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        payload[key] = value;
      }
    });

    const checkboxes = form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      payload[checkbox.name] = checkbox.checked;
    });

    const numberInputs = form.querySelectorAll<HTMLInputElement>('input[data-number="true"]');
    numberInputs.forEach((input) => {
      payload[input.name] = input.value === '' ? 0 : Number(input.value);
    });

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setState('success');
      if (method === 'POST') {
        form.reset();
      }
      router.refresh();
    } catch (submissionError) {
      setState('error');
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to submit form.');
    }
  }

  return (
    <div className="surface p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-2xl">{title}</h3>
        <p className="mt-3 max-w-2xl">{description}</p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        {children}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button className="min-w-36" variant="primary">
            {state === 'submitting' ? 'Submitting…' : submitLabel}
          </Button>
          {state === 'success' ? <p className="text-sm font-medium text-emerald-700">{successMessage}</p> : null}
          {state === 'error' ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
        </div>
      </form>
    </div>
  );
}
