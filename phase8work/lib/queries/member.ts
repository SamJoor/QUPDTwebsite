import { createServerSupabaseClient } from '@/lib/supabase/server';
import { readDemoStore } from '@/lib/demo-store';
import { getSessionUser } from '@/lib/auth/session';
import { MemberDirectoryProfile, MemberProfileRecord } from '@/types';

type DirectoryRow = {
  full_name: string;
  graduation_year: number | null;
  company: string | null;
  job_title: string | null;
  industry: string | null;
  location: string | null;
  short_bio: string | null;
  linkedin_url: string | null;
  willing_to_mentor: boolean | null;
  major: string | null;
  alumni_private_details?: { email: string | null; phone: string | null; email_visibility?: string | null; phone_visibility?: string | null }[] | { email: string | null; phone: string | null; email_visibility?: string | null; phone_visibility?: string | null } | null;
};

type ProfileRow = {
  id: string;
  full_name: string;
  graduation_year: number | null;
  graduation_term: string | null;
  member_status: string | null;
  alumni_access_enabled: boolean | null;
  major: string | null;
  company: string | null;
  job_title: string | null;
  industry: string | null;
  location: string | null;
  short_bio: string | null;
  linkedin_url: string | null;
  willing_to_mentor: boolean | null;
  is_public: boolean | null;
  alumni_private_details?: { email: string | null; phone: string | null; email_visibility?: string | null; phone_visibility?: string | null; linkedin_visibility?: string | null }[] | { email: string | null; phone: string | null; email_visibility?: string | null; phone_visibility?: string | null; linkedin_visibility?: string | null } | null;
};

const VIS = {
  private: 'private',
  members: 'members',
  public: 'public'
} as const;

function firstDetails<T>(value: T[] | T | null | undefined): T | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

async function getDemoMemberDirectory(): Promise<MemberDirectoryProfile[]> {
  const store = await readDemoStore();
  return store.alumni.map((row) => ({
    name: row.fullName,
    gradYear: String(row.graduationYear),
    company: row.company,
    title: row.jobTitle,
    industry: row.industry,
    location: row.location,
    bio: row.shortBio,
    linkedin: row.linkedinUrl,
    mentor: row.willingToMentor,
    major: row.major,
    featured: row.isFeatured,
    email: row.email,
    phone: row.phone,
    preferredContactMethod: row.email ? 'Email' : row.linkedinUrl ? 'LinkedIn' : 'Chapter introduction'
  }));
}

export async function getMemberDirectoryProfiles(): Promise<MemberDirectoryProfile[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return getDemoMemberDirectory();

  const { data, error } = await supabase
    .from('alumni_profiles')
    .select(`
      full_name,
      graduation_year,
      company,
      job_title,
      industry,
      location,
      short_bio,
      linkedin_url,
      willing_to_mentor,
      major,
      alumni_private_details(email, phone, email_visibility, phone_visibility)
    `)
    .eq('is_public', true)
    .order('graduation_year', { ascending: false })
    .order('full_name', { ascending: true });

  if (error || !data?.length) return getDemoMemberDirectory();

  return (data as unknown as DirectoryRow[]).map((row) => {
    const details = firstDetails(row.alumni_private_details);
    const emailVisible = details?.email_visibility === VIS.public || details?.email_visibility === VIS.members;
    const phoneVisible = details?.phone_visibility === VIS.public || details?.phone_visibility === VIS.members;
    return {
      name: row.full_name,
      gradYear: row.graduation_year ? String(row.graduation_year) : '—',
      company: row.company ?? '—',
      title: row.job_title ?? '—',
      industry: row.industry ?? '—',
      location: row.location ?? '—',
      bio: row.short_bio ?? 'Profile coming soon.',
      linkedin: row.linkedin_url ?? undefined,
      mentor: Boolean(row.willing_to_mentor),
      major: row.major ?? undefined,
      email: emailVisible ? details?.email ?? undefined : undefined,
      phone: phoneVisible ? details?.phone ?? undefined : undefined,
      preferredContactMethod: emailVisible && details?.email ? 'Email' : row.linkedin_url ? 'LinkedIn' : 'Chapter introduction'
    };
  });
}

export async function getCurrentMemberProfile(): Promise<MemberProfileRecord | null> {
  const session = await getSessionUser();
  if (!session || session.role !== 'alumni') return null;

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    const store = await readDemoStore();
    const row = store.alumni.find((item) => item.email?.toLowerCase() === session.email.toLowerCase()) ?? store.alumni[0];
    if (!row) return null;
    return {
      id: row.id,
      email: row.email || session.email,
      fullName: row.fullName,
      graduationYear: row.graduationYear,
      graduationTerm: row.graduationTerm,
      memberStatus: row.memberStatus,
      alumniAccessEnabled: row.alumniAccessEnabled,
      major: row.major,
      company: row.company,
      jobTitle: row.jobTitle,
      industry: row.industry,
      location: row.location,
      shortBio: row.shortBio,
      linkedinUrl: row.linkedinUrl,
      phone: row.phone,
      willingToMentor: row.willingToMentor,
      isPublic: row.isPublic,
      emailVisibility: 'members',
      phoneVisibility: 'private',
      linkedinVisibility: 'public'
    };
  }

  const member = await supabase.from('member_accounts').select('alumni_profile_id, auth_email').eq('auth_email', session.email).maybeSingle();
  let profileId = member.data?.alumni_profile_id as string | undefined;

  if (!profileId) {
    const privateLookup = await supabase.from('alumni_private_details').select('alumni_profile_id, email').eq('email', session.email).maybeSingle();
    profileId = privateLookup.data?.alumni_profile_id as string | undefined;
  }

  if (!profileId) return null;

  const { data } = await supabase
    .from('alumni_profiles')
    .select(`
      id,
      full_name,
      graduation_year,
      graduation_term,
      member_status,
      alumni_access_enabled,
      major,
      company,
      job_title,
      industry,
      location,
      short_bio,
      linkedin_url,
      willing_to_mentor,
      is_public,
      alumni_private_details(email, phone, email_visibility, phone_visibility, linkedin_visibility)
    `)
    .eq('id', profileId)
    .maybeSingle();

  if (!data) return null;
  const row = data as unknown as ProfileRow;
  const details = firstDetails(row.alumni_private_details);

  return {
    id: row.id,
    email: details?.email || session.email,
    fullName: row.full_name,
    graduationYear: row.graduation_year ?? 0,
    graduationTerm: (row.graduation_term as any) ?? 'spring',
    memberStatus: (row.member_status as any) ?? 'alumni',
    alumniAccessEnabled: Boolean(row.alumni_access_enabled ?? true),
    major: row.major ?? '',
    company: row.company ?? '',
    jobTitle: row.job_title ?? '',
    industry: row.industry ?? '',
    location: row.location ?? '',
    shortBio: row.short_bio ?? '',
    linkedinUrl: row.linkedin_url ?? undefined,
    phone: details?.phone ?? undefined,
    willingToMentor: Boolean(row.willing_to_mentor),
    isPublic: Boolean(row.is_public),
    emailVisibility: (details?.email_visibility as MemberProfileRecord['emailVisibility']) || 'members',
    phoneVisibility: (details?.phone_visibility as MemberProfileRecord['phoneVisibility']) || 'private',
    linkedinVisibility: (details?.linkedin_visibility as MemberProfileRecord['linkedinVisibility']) || 'public'
  };
}
