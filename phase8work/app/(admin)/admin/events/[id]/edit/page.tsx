import { notFound } from 'next/navigation';
import { ApiForm } from '@/components/forms/api-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getAdminEventRecordById } from '@/lib/queries/admin';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getAdminEventRecordById(id);
  if (!record) notFound();

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Admin module</p>
        <h1 className="mt-3 text-4xl">Edit event</h1>
      </div>
      <ApiForm title="Update event" description="Adjust event details, publishing state, and featured status." endpoint={`/api/admin/events?id=${id}`} method="PUT" successMessage="Event updated successfully." submitLabel="Save changes">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title"><Input name="title" defaultValue={record.title} required /></Field>
          <Field label="Slug"><Input name="slug" defaultValue={record.slug} required /></Field>
          <Field label="Event date"><Input name="eventDate" type="date" defaultValue={record.eventDate.slice(0,10)} required /></Field>
          <Field label="Event time"><Input name="eventTime" defaultValue={record.eventTime} required /></Field>
          <Field label="Location"><Input name="location" defaultValue={record.location} required /></Field>
          <Field label="Audience"><Input name="audience" defaultValue={record.audience} required /></Field>
          <Field label="Status">
            <Select name="status" defaultValue={record.status}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </Select>
          </Field>
          <Field label="Tags"><Input name="tags" defaultValue={record.tags} /></Field>
        </div>
        <Field label="Short description"><Textarea name="description" rows={4} defaultValue={record.description} required /></Field>
        <Field label="Body content"><Textarea name="bodyContent" rows={6} defaultValue={record.bodyContent} required /></Field>
        <Checkbox name="isFeatured" label="Feature this event" defaultChecked={record.isFeatured} />
      </ApiForm>
    </div>
  );
}
