'use client';

import { useState } from 'react';

export function NewsletterSendButton({ newsletterId }: { newsletterId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSend() {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/newsletters/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsletterId }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(payload.error || 'Unable to send newsletter.');
      } else {
        setMessage(payload.message || 'Newsletter processed.');
      }
    } catch {
      setMessage('Unexpected network error while sending newsletter.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleSend}
        disabled={loading}
        className="rounded-full bg-fraternity-burgundy px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Sending…' : 'Send issue'}
      </button>
      {message ? <p className="text-xs text-fraternity-slate">{message}</p> : null}
    </div>
  );
}
