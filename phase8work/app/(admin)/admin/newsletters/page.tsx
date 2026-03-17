import { ApiForm } from '@/components/forms/api-form';
import { AdminTable } from '@/components/admin/admin-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getAdminNewsletterRecords } from '@/lib/queries/admin';
import { NewsletterSendButton } from '@/components/admin/newsletter-send-button';

export default async function NewslettersAdminPage() {
  const rows = await getAdminNewsletterRecords();

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Admin module</p>
        <h1 className="mt-3 text-4xl">newsletter management</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">This phase makes newsletter records function locally even before email sending is connected.</p>
      </div>



      <div className="surface p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Send workflow</p>
            <h2 className="mt-2 text-2xl">Issue delivery controls</h2>
            <p className="mt-2 max-w-2xl text-sm text-fraternity-slate">Use preview mode until Resend is configured. Once RESEND_API_KEY and RESEND_FROM_EMAIL are present, this button will send to active subscribers and mark the issue as sent.</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {rows.slice(0, 5).map((row) => (
            <div key={row.id} className="rounded-2xl border border-black/10 bg-white px-4 py-4 md:flex md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-fraternity-charcoal">{row.primary}</p>
                <p className="text-sm text-fraternity-slate">{row.secondary}</p>
              </div>
              <div className="mt-3 md:mt-0">
                <NewsletterSendButton newsletterId={row.id} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
        <ApiForm
          title="Create newsletter issue"
          description="Draft or publish newsletter issues now, then wire Resend or Mailchimp later. In demo mode they persist locally."
          endpoint="/api/admin/newsletters"
          successMessage="Newsletter issue submitted successfully."
          submitLabel="Save issue"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Title"><Input name="title" required /></Field>
            <Field label="Slug"><Input name="slug" placeholder="spring-2026-brotherhood-update" required /></Field>
            <Field label="Category"><Input name="category" placeholder="Chapter Update" required /></Field>
            <Field label="Issue date"><Input name="issueDate" type="date" required /></Field>
            <Field label="Subject line"><Input name="subjectLine" required /></Field>
            <Field label="Status">
              <Select name="status" defaultValue="draft">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="sent">Sent</option>
              </Select>
            </Field>
          </div>
          <Field label="Summary"><Textarea name="summary" rows={4} required /></Field>
          <Field label="Body content"><Textarea name="bodyContent" rows={7} required /></Field>
          <Checkbox name="isFeatured" label="Feature this issue on the homepage" />
        </ApiForm>

        <AdminTable title="Newsletter records" rows={rows} deleteEndpoint="/api/admin/newsletters" exportHref="/api/admin/export/newsletters" editBaseHref="/admin/newsletters" />
      </div>
    </div>
  );
}
