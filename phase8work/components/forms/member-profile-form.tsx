'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MemberProfileRecord } from '@/types';

export function MemberProfileForm({ profile }: { profile: MemberProfileRecord }) {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('submitting');
    setMessage('');
    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: String(formData.get('fullName') || ''),
      graduationYear: Number(formData.get('graduationYear') || 0),
      major: String(formData.get('major') || ''),
      company: String(formData.get('company') || ''),
      jobTitle: String(formData.get('jobTitle') || ''),
      industry: String(formData.get('industry') || ''),
      location: String(formData.get('location') || ''),
      shortBio: String(formData.get('shortBio') || ''),
      linkedinUrl: String(formData.get('linkedinUrl') || ''),
      phone: String(formData.get('phone') || ''),
      willingToMentor: formData.get('willingToMentor') === 'on',
      isPublic: formData.get('isPublic') === 'on',
      emailVisibility: String(formData.get('emailVisibility') || 'members'),
      phoneVisibility: String(formData.get('phoneVisibility') || 'private'),
      linkedinVisibility: String(formData.get('linkedinVisibility') || 'public')
    };

    const response = await fetch('/api/member/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setState('error');
      setMessage(data.error || 'Unable to save your profile.');
      return;
    }

    setState('success');
    setMessage('Profile updated successfully. Refresh the private directory to confirm your visibility choices.');
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.45fr_0.9fr]">
      <form className="surface space-y-5 p-8" onSubmit={handleSubmit}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Phase 7</p>
          <h2 className="mt-3 text-4xl">Manage your alumni profile</h2>
          <p className="mt-4 text-fraternity-slate">This is the first self-service member profile flow. Update your professional details, opt into mentorship, and control what appears publicly versus inside the member network.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full name"><Input name="fullName" defaultValue={profile.fullName} required /></Field>
          <Field label="Graduation year"><Input name="graduationYear" type="number" defaultValue={profile.graduationYear} required /></Field>
          <Field label="Major"><Input name="major" defaultValue={profile.major} required /></Field>
          <Field label="Industry"><Input name="industry" defaultValue={profile.industry} required /></Field>
          <Field label="Company"><Input name="company" defaultValue={profile.company} required /></Field>
          <Field label="Job title"><Input name="jobTitle" defaultValue={profile.jobTitle} required /></Field>
          <Field label="Location"><Input name="location" defaultValue={profile.location} required /></Field>
          <Field label="Phone"><Input name="phone" defaultValue={profile.phone || ''} /></Field>
        </div>
        <Field label="LinkedIn URL"><Input name="linkedinUrl" defaultValue={profile.linkedinUrl || ''} placeholder="https://www.linkedin.com/in/..." /></Field>
        <Field label="Short bio"><Textarea name="shortBio" defaultValue={profile.shortBio} required /></Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Checkbox name="willingToMentor" defaultChecked={profile.willingToMentor} label="I am open to mentoring active brothers" />
          <Checkbox name="isPublic" defaultChecked={profile.isPublic} label="Show my core profile in the public alumni directory" />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Email visibility"><Select name="emailVisibility" defaultValue={profile.emailVisibility}><option value="private">Private</option><option value="members">Members only</option><option value="public">Public</option></Select></Field>
          <Field label="Phone visibility"><Select name="phoneVisibility" defaultValue={profile.phoneVisibility}><option value="private">Private</option><option value="members">Members only</option><option value="public">Public</option></Select></Field>
          <Field label="LinkedIn visibility"><Select name="linkedinVisibility" defaultValue={profile.linkedinVisibility}><option value="private">Private</option><option value="members">Members only</option><option value="public">Public</option></Select></Field>
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button className="min-w-40">{state === 'submitting' ? 'Saving…' : 'Save profile'}</Button>
          <Button href="/member/directory" type="button" variant="secondary">View member directory</Button>
        </div>
        {state === 'success' ? <p className="text-sm font-medium text-emerald-700">{message}</p> : null}
        {state === 'error' ? <p className="text-sm font-medium text-red-700">{message}</p> : null}
      </form>
      <aside className="surface p-8">
        <h3 className="text-2xl">Current member account</h3>
        <dl className="mt-5 space-y-4 text-sm text-fraternity-slate">
          <div><dt className="font-semibold text-fraternity-charcoal">Linked email</dt><dd>{profile.email}</dd></div>
          <div><dt className="font-semibold text-fraternity-charcoal">Public profile</dt><dd>{profile.isPublic ? 'Visible publicly' : 'Hidden from public directory'}</dd></div>
          <div><dt className="font-semibold text-fraternity-charcoal">Mentorship</dt><dd>{profile.willingToMentor ? 'Available to mentor' : 'Not currently listed as a mentor'}</dd></div>
        </dl>
        <div className="mt-6 rounded-3xl bg-fraternity-parchment p-5 text-sm text-fraternity-slate">
          <p className="font-semibold text-fraternity-charcoal">Visibility guidance</p>
          <ul className="mt-3 space-y-2">
            <li>• Public means anyone on the website can see it.</li>
            <li>• Members means only signed-in alumni can see it.</li>
            <li>• Private keeps it hidden from both directories.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
