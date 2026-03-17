import { ApiForm } from '@/components/forms/api-form';
import { AdminDeleteButton } from '@/components/admin/admin-delete-button';
import { AdminEditLink } from '@/components/admin/admin-edit-link';
import { FileUploadForm } from '@/components/admin/file-upload-form';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getAdminMediaRecords } from '@/lib/queries/admin';

export default async function MediaAdminPage() {
  const items = await getAdminMediaRecords();

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Admin module</p>
        <h1 className="mt-3 text-4xl">media architecture</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          Phase 5 adds Supabase Storage upload support plus edit flows for media records. In local demo mode, metadata still persists locally.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
        <div className="space-y-6">
          <FileUploadForm />
          <ApiForm
            title="Register media item"
            description="Save a media record with a direct URL or a bucket/path combination. In local mode these records persist to the demo store."
            endpoint="/api/admin/media"
            successMessage="Media metadata submitted successfully."
            submitLabel="Save media record"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Title"><Input name="title" required /></Field>
              <Field label="Media type">
                <Select name="mediaType" defaultValue="photo">
                  <option value="photo">Photo</option>
                  <option value="document">Document</option>
                  <option value="video">Video</option>
                  <option value="composite">Composite</option>
                </Select>
              </Field>
              <Field label="Year label"><Input name="yearLabel" placeholder="1990s / 2026" /></Field>
              <Field label="Direct file URL"><Input name="fileUrl" placeholder="https://..." /></Field>
              <Field label="Storage bucket"><Input name="storageBucket" placeholder="legacy-vault" /></Field>
              <Field label="Storage path"><Input name="storagePath" placeholder="founders-day/gallery-cover.jpg" /></Field>
            </div>
            <Field label="Caption"><Textarea name="caption" rows={4} /></Field>
          </ApiForm>
        </div>

        <div className="surface p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl">Current media records</h2>
          </div>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white px-4 py-4 ring-1 ring-black/5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-fraternity-charcoal">{item.title}</p>
                    <p className="mt-1 text-sm text-fraternity-slate">{item.mediaType}{item.yearLabel ? ` • ${item.yearLabel}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <AdminEditLink href={`/admin/media/${item.id}/edit`} />
                    <AdminDeleteButton endpoint="/api/admin/media" id={item.id} />
                  </div>
                </div>
                {item.storageBucket || item.storagePath ? <p className="mt-2 text-xs text-fraternity-slate">{item.storageBucket || 'bucket'} / {item.storagePath || 'path pending'}</p> : null}
                {item.fileUrl ? <p className="mt-2 break-all text-xs text-fraternity-slate">{item.fileUrl}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
