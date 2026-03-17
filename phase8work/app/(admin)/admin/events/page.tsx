import { ApiForm } from '@/components/forms/api-form';
import { AdminTable } from '@/components/admin/admin-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getAdminEventRecords } from '@/lib/queries/admin';

export default async function EventsAdminPage() {
  const rows = await getAdminEventRecords();

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Admin module</p>
        <h1 className="mt-3 text-4xl">events management</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">This phase adds local event persistence, delete controls, and CSV export so officers can test the site before the database is ready.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
        <ApiForm
          title="Create event"
          description="This now saves to Supabase when connected, or to the local demo store when you are still building offline."
          endpoint="/api/admin/events"
          successMessage="Event submitted successfully."
          submitLabel="Create event"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Title"><Input name="title" required /></Field>
            <Field label="Slug"><Input name="slug" placeholder="founders-day-banquet" required /></Field>
            <Field label="Event date"><Input name="eventDate" type="date" required /></Field>
            <Field label="Event time"><Input name="eventTime" placeholder="6:30 PM" required /></Field>
            <Field label="Location"><Input name="location" required /></Field>
            <Field label="Audience"><Input name="audience" required /></Field>
            <Field label="Status">
              <Select name="status" defaultValue="published">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
            </Field>
            <Field label="Tags"><Input name="tags" placeholder="Founders Day, Tradition, Flagship" /></Field>
          </div>
          <Field label="Short description"><Textarea name="description" rows={4} required /></Field>
          <Field label="Body content"><Textarea name="bodyContent" rows={6} required /></Field>
          <Checkbox name="isFeatured" label="Feature this event" />
        </ApiForm>

        <AdminTable title="Event records" rows={rows} deleteEndpoint="/api/admin/events" exportHref="/api/admin/export/events" editBaseHref="/admin/events" />
      </div>
    </div>
  );
}
