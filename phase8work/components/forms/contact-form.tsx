'use client';

import Script from 'next/script';
import { ApiForm } from '@/components/forms/api-form';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm() {
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      <ApiForm
        title="General Contact"
        description="Use this for alumni outreach, story submissions, support interest, and chapter questions. The backend route already validates the request payload."
        endpoint="/api/contact"
        successMessage="Your message was received. This is ready to connect to Supabase storage or email notifications next."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Name">
            <Input name="name" required placeholder="Your full name" />
          </Field>
          <Field label="Email address">
            <Input name="email" type="email" required placeholder="you@example.com" />
          </Field>
        </div>
        <Field label="Topic">
          <Select name="topic" required defaultValue="">
            <option value="" disabled>Choose a topic</option>
            <option value="general">General contact</option>
            <option value="directory">Update alumni information</option>
            <option value="volunteer">Volunteer / mentor interest</option>
            <option value="event">Event planning support</option>
            <option value="legacy">Legacy vault contribution</option>
            <option value="donation">Donation or support interest</option>
          </Select>
        </Field>
        <Field label="Message">
          <Textarea name="message" required placeholder="How would you like to reconnect or support the chapter?" />
        </Field>
        {TURNSTILE_SITE_KEY && (
          <div
            className="cf-turnstile"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-theme="light"
          />
        )}
      </ApiForm>
    </>
  );
}
