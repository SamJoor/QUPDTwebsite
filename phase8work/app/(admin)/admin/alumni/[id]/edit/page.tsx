import { notFound } from 'next/navigation';
import { ApiForm } from '@/components/forms/api-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { getAdminAlumniRecordById } from '@/lib/queries/admin';

export default async function EditAlumniPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getAdminAlumniRecordById(id);
  if (!record) notFound();

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Admin module</p>
        <h1 className="mt-3 text-4xl">Edit alumni profile</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">Phase 8 extends the edit flow with graduation metadata and alumni-access controls.</p>
      </div>
      <ApiForm title="Update alumni profile" description="Save changes to this alumni record." endpoint={`/api/admin/alumni?id=${id}`} method="PUT" successMessage="Alumni record updated successfully." submitLabel="Save changes">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full name"><Input name="fullName" defaultValue={record.fullName} required /></Field>
          <Field label="Graduation year"><Input name="graduationYear" type="number" data-number="true" defaultValue={record.graduationYear} required /></Field>
          <Field label="Graduation term">
            <Select name="graduationTerm" defaultValue={record.graduationTerm}>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
            </Select>
          </Field>
          <Field label="Member status">
            <Select name="memberStatus" defaultValue={record.memberStatus}>
              <option value="active">Active</option>
              <option value="graduating">Graduating</option>
              <option value="alumni">Alumni</option>
              <option value="inactive">Inactive</option>
            </Select>
          </Field>
          <Field label="Major"><Input name="major" defaultValue={record.major} required /></Field>
          <Field label="Company"><Input name="company" defaultValue={record.company} required /></Field>
          <Field label="Job title"><Input name="jobTitle" defaultValue={record.jobTitle} required /></Field>
          <Field label="Industry"><Input name="industry" defaultValue={record.industry} required /></Field>
          <Field label="Location"><Input name="location" defaultValue={record.location} required /></Field>
          <Field label="LinkedIn URL"><Input name="linkedinUrl" defaultValue={record.linkedinUrl} placeholder="https://linkedin.com/in/..." /></Field>
          <Field label="Private email"><Input name="email" type="email" defaultValue={record.email} /></Field>
          <Field label="Private phone"><Input name="phone" defaultValue={record.phone} /></Field>
        </div>
        <Field label="Short bio"><Textarea name="shortBio" rows={5} defaultValue={record.shortBio} required /></Field>
        <div className="grid gap-4 md:grid-cols-4">
          <Checkbox name="alumniAccessEnabled" label="Alumni access enabled" defaultChecked={record.alumniAccessEnabled} />
          <Checkbox name="willingToMentor" label="Willing to mentor" defaultChecked={record.willingToMentor} />
          <Checkbox name="isPublic" label="Visible in public directory" defaultChecked={record.isPublic} />
          <Checkbox name="isFeatured" label="Feature on homepage" defaultChecked={record.isFeatured} />
        </div>
      </ApiForm>
    </div>
  );
}
