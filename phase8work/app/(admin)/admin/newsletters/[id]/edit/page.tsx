import { notFound } from 'next/navigation';
import { ApiForm } from '@/components/forms/api-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getAdminNewsletterRecordById } from '@/lib/queries/admin';

export default async function EditNewsletterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getAdminNewsletterRecordById(id);
  if (!record) notFound();

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Admin module</p>
        <h1 className="mt-3 text-4xl">Edit newsletter issue</h1>
      </div>
      <ApiForm title="Update newsletter" description="Refine the issue content before connecting email delivery." endpoint={`/api/admin/newsletters?id=${id}`} method="PUT" successMessage="Newsletter issue updated successfully." submitLabel="Save changes">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title"><Input name="title" defaultValue={record.title} required /></Field>
          <Field label="Slug"><Input name="slug" defaultValue={record.slug} required /></Field>
          <Field label="Category"><Input name="category" defaultValue={record.category} required /></Field>
          <Field label="Issue date"><Input name="issueDate" type="date" defaultValue={record.issueDate.slice(0,10)} required /></Field>
          <Field label="Subject line"><Input name="subjectLine" defaultValue={record.subjectLine} required /></Field>
          <Field label="Status">
            <Select name="status" defaultValue={record.status}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="sent">Sent</option>
            </Select>
          </Field>
        </div>
        <Field label="Summary"><Textarea name="summary" rows={4} defaultValue={record.summary} required /></Field>
        <Field label="Body content"><Textarea name="bodyContent" rows={7} defaultValue={record.bodyContent} required /></Field>
        <Checkbox name="isFeatured" label="Feature this issue on the homepage" defaultChecked={record.isFeatured} />
      </ApiForm>
    </div>
  );
}
