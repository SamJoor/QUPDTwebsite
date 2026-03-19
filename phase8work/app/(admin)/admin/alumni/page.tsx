import { ApiForm } from '@/components/forms/api-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { AdminRecordCard } from '@/components/admin/admin-record-card';
import { AdminTable } from '@/components/admin/admin-table';
import { getAdminAlumniRecords, getAdminOverview } from '@/lib/queries/admin';

export default async function AlumniAdminPage() {
  const [overview, rows] = await Promise.all([getAdminOverview(), getAdminAlumniRecords()]);

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Admin module</p>
        <h1 className="mt-3 text-4xl capitalize">alumni management</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          Current data source: <strong>{overview.dataSource}</strong>. Phase 8 extends the single alumni record model with graduation term, member status, and alumni-access controls.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
        <ApiForm
          title="Create alumni profile"
          description="Add a public and safe alumni directory profile, including the graduation metadata that controls alumni-access eligibility."
          endpoint="/api/admin/alumni"
          successMessage="Alumni record submitted successfully."
          submitLabel="Create record"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full name"><Input name="fullName" required /></Field>
            <Field label="Graduation year"><Input name="graduationYear" type="number" required data-number="true" /></Field>
            <Field label="Graduation term">
              <Select name="graduationTerm" defaultValue="spring">
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
                <option value="winter">Winter</option>
              </Select>
            </Field>
            <Field label="Member status">
              <Select name="memberStatus" defaultValue="alumni">
                <option value="active">Active</option>
                <option value="graduating">Graduating</option>
                <option value="alumni">Alumni</option>
                <option value="inactive">Inactive</option>
              </Select>
            </Field>
            <Field label="Major"><Input name="major" required /></Field>
            <Field label="Company"><Input name="company" required /></Field>
            <Field label="Job title"><Input name="jobTitle" required /></Field>
            <Field label="Industry"><Input name="industry" required /></Field>
            <Field label="Location"><Input name="location" required /></Field>
            <Field label="LinkedIn URL"><Input name="linkedinUrl" placeholder="https://linkedin.com/in/..." /></Field>
            <Field label="Private email"><Input name="email" type="email" /></Field>
            <Field label="Private phone"><Input name="phone" /></Field>
          </div>
          <Field label="Short bio"><Textarea name="shortBio" rows={5} required /></Field>
          <div className="grid gap-4 md:grid-cols-4">
            <Checkbox name="alumniAccessEnabled" label="Alumni access enabled" defaultChecked />
            <Checkbox name="willingToMentor" label="Willing to mentor" />
            <Checkbox name="isPublic" label="Visible in public directory" defaultChecked />
            <Checkbox name="isFeatured" label="Feature on homepage" />
          </div>
        </ApiForm>

        <AdminRecordCard title="Operational note" description="What Phase 8 adds">
          <ul className="space-y-3 text-sm text-fraternity-slate">
            <li>• CSV import for alumni/member data</li>
            <li>• graduation term + status support on the same table</li>
            <li>• alumni-access flag used by claim/login flows</li>
            <li>• continued public/private contact separation</li>
          </ul>
        </AdminRecordCard>
      </div>

      <AdminTable title="Recent alumni records" rows={rows} deleteEndpoint="/api/admin/alumni" exportHref="/api/admin/export/alumni" editBaseHref="/admin/alumni" />
    </div>
  );
}
