import { notFound } from 'next/navigation';
import { ApiForm } from '@/components/forms/api-form';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getAdminMediaRecordById } from '@/lib/queries/admin';

export default async function EditMediaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getAdminMediaRecordById(id);
  if (!record) notFound();

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Admin module</p>
        <h1 className="mt-3 text-4xl">Edit media record</h1>
      </div>
      <ApiForm title="Update media" description="Update metadata or swap a Storage path after uploading a new asset." endpoint={`/api/admin/media?id=${id}`} method="PUT" successMessage="Media record updated successfully." submitLabel="Save changes">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title"><Input name="title" defaultValue={record.title} required /></Field>
          <Field label="Media type">
            <Select name="mediaType" defaultValue={record.mediaType}>
              <option value="photo">Photo</option>
              <option value="document">Document</option>
              <option value="video">Video</option>
              <option value="composite">Composite</option>
            </Select>
          </Field>
          <Field label="Year label"><Input name="yearLabel" defaultValue={record.yearLabel} /></Field>
          <Field label="Direct file URL"><Input name="fileUrl" defaultValue={record.fileUrl} /></Field>
          <Field label="Storage bucket"><Input name="storageBucket" defaultValue={record.storageBucket} /></Field>
          <Field label="Storage path"><Input name="storagePath" defaultValue={record.storagePath} /></Field>
        </div>
        <Field label="Caption"><Textarea name="caption" rows={4} defaultValue={record.caption} /></Field>
      </ApiForm>
    </div>
  );
}
