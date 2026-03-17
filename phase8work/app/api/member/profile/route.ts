import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth/session';
import { memberProfileSchema } from '@/lib/validations/member';

export async function PUT(request: Request) {
  const session = await getSessionUser();
  if (!session || session.role !== 'alumni') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase connection is required for self-service profile editing in Phase 7.' }, { status: 500 });
  }

  const json = await request.json().catch(() => null);
  const parsed = memberProfileSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid profile submission.' }, { status: 400 });
  }

  const member = await supabase.from('member_accounts').select('alumni_profile_id').eq('auth_email', session.email).maybeSingle();
  let profileId = member.data?.alumni_profile_id as string | undefined;

  if (!profileId) {
    const fallback = await supabase.from('alumni_private_details').select('alumni_profile_id').eq('email', session.email).maybeSingle();
    profileId = fallback.data?.alumni_profile_id as string | undefined;
  }

  if (!profileId) {
    return NextResponse.json({ error: 'No linked alumni profile was found for this account.' }, { status: 404 });
  }

  const input = parsed.data;

  const profileRes = await supabase.from('alumni_profiles').update({
    full_name: input.fullName,
    graduation_year: input.graduationYear,
    major: input.major,
    company: input.company,
    job_title: input.jobTitle,
    industry: input.industry,
    location: input.location,
    short_bio: input.shortBio,
    linkedin_url: input.linkedinVisibility === 'private' ? null : input.linkedinUrl || null,
    willing_to_mentor: input.willingToMentor,
    is_public: input.isPublic
  }).eq('id', profileId);

  if (profileRes.error) {
    return NextResponse.json({ error: profileRes.error.message }, { status: 400 });
  }

  const detailsRes = await supabase.from('alumni_private_details').upsert({
    alumni_profile_id: profileId,
    email: session.email,
    phone: input.phone || null,
    email_visibility: input.emailVisibility,
    phone_visibility: input.phoneVisibility,
    linkedin_visibility: input.linkedinVisibility
  }, { onConflict: 'alumni_profile_id' });

  if (detailsRes.error) {
    return NextResponse.json({ error: detailsRes.error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
