'use client';

import { ApiForm } from '@/components/forms/api-form';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function MentorSignupForm() {
  return (
    <ApiForm
      title="Volunteer as a Mentor"
      description="This form is fully wired to a validation-backed API route so you can later persist submissions with minimal changes."
      endpoint="/api/mentorship/mentor"
      submitLabel="Submit mentor interest"
      successMessage="Thank you for volunteering. Your mentor interest form is ready for officer review."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name"><Input name="name" required /></Field>
        <Field label="Email"><Input name="email" type="email" required /></Field>
        <Field label="Graduation year"><Input name="graduationYear" required /></Field>
        <Field label="Company and title"><Input name="companyTitle" required /></Field>
        <Field label="Industry"><Input name="industry" required /></Field>
        <Field label="Availability"><Input name="availability" required placeholder="Monthly call, one-time coffee chat, internship guidance…" /></Field>
      </div>
      <Field label="Preferred mentoring areas">
        <Textarea name="mentoringAreas" required placeholder="Finance recruiting, internships, networking, leadership, graduate school, entrepreneurship…" />
      </Field>
    </ApiForm>
  );
}
