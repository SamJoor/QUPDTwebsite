import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { adminAlumniSchema } from '@/lib/validations/admin';
import { importAdminAlumni } from '@/lib/actions/admin-persist';
import { parseBoolean, parseCsv } from '@/lib/utils/csv';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  let csvText = String(formData.get('csvText') || '');
  const file = formData.get('file');
  if (!csvText && file instanceof File) {
    csvText = await file.text();
  }

  if (!csvText.trim()) {
    return NextResponse.json({ error: 'Provide a CSV file or pasted CSV text.' }, { status: 400 });
  }

  const records = parseCsv(csvText);
  if (!records.length) {
    return NextResponse.json({ error: 'No CSV rows were found.' }, { status: 400 });
  }

  const normalized = [];
  for (const record of records) {
    const parsed = adminAlumniSchema.safeParse({
      fullName: record.full_name || record.fullName,
      graduationYear: record.graduation_year || record.graduationYear,
      graduationTerm: (record.graduation_term || record.graduationTerm || 'spring').toLowerCase(),
      memberStatus: (record.member_status || record.memberStatus || 'alumni').toLowerCase(),
      alumniAccessEnabled: parseBoolean(record.alumni_access_enabled || record.alumniAccessEnabled, true),
      major: record.major,
      company: record.company || 'Chapter Network',
      jobTitle: record.job_title || record.jobTitle || 'Brother',
      industry: record.industry || 'General',
      location: record.location || 'TBD',
      shortBio: record.short_bio || record.shortBio || 'Imported alumni profile awaiting a fuller chapter biography.',
      linkedinUrl: record.linkedin_url || record.linkedinUrl || '',
      email: record.email || '',
      phone: record.phone || '',
      willingToMentor: parseBoolean(record.willing_to_mentor || record.willingToMentor, false),
      isPublic: parseBoolean(record.is_public || record.isPublic, true),
      isFeatured: parseBoolean(record.is_featured || record.isFeatured, false),
    });

    if (!parsed.success) {
      return NextResponse.json({ error: `Invalid CSV row for ${record.full_name || record.fullName || 'unknown record'}.` }, { status: 400 });
    }
    normalized.push(parsed.data);
  }

  const result = await importAdminAlumni(normalized);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ message: `Imported ${result.count ?? normalized.length} alumni records successfully.` });
}
