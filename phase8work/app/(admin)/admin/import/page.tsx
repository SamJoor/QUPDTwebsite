import { CsvImportForm } from '@/components/admin/csv-import-form';

export default function ImportPage() {
  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Admin module</p>
        <h1 className="mt-3 text-4xl">CSV import</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          Use a single member CSV to seed or update directory records. The importer now derives <strong>active</strong> versus <strong>alumni</strong> status from <strong>graduation_year</strong> and <strong>graduation_term</strong>, so future uploads stay aligned with the chapter roster without relying on manual status labels.
        </p>
      </div>

      <CsvImportForm />

      <div className="surface p-8 text-sm text-fraternity-slate">
        <p className="font-semibold text-fraternity-charcoal">Recommended columns</p>
        <p className="mt-3">
          full_name, email, phone, bond_number, major, graduation_year, graduation_term,
          alumni_access_enabled, company, job_title, industry, location, linkedin_url, short_bio,
          willing_to_mentor, is_public, is_featured
        </p>
        <p className="mt-4">
          <strong>Note:</strong> <code>member_status</code> is no longer required for imports. If <code>alumni_access_enabled</code> is omitted, it will default based on the derived status.
        </p>
      </div>
    </div>
  );
}
