import { CsvImportForm } from '@/components/admin/csv-import-form';

export default function ImportPage() {
  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Admin module</p>
        <h1 className="mt-3 text-4xl">CSV import</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">Use a single alumni CSV to seed or update directory records. This keeps the project on one table model by extending <strong>alumni_profiles</strong> instead of introducing a separate member table.</p>
      </div>
      <CsvImportForm />
      <div className="surface p-8 text-sm text-fraternity-slate">
        <p className="font-semibold text-fraternity-charcoal">Recommended columns</p>
        <p className="mt-3">full_name, email, phone, major, graduation_year, graduation_term, member_status, alumni_access_enabled, company, job_title, industry, location, linkedin_url, short_bio, willing_to_mentor, is_public, is_featured</p>
      </div>
    </div>
  );
}
