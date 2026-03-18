import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  AdminAboutPageInput,
  AdminAlumniInput,
  AdminEventInput,
  AdminHomePageInput,
  AdminMediaInput,
  AdminNewsletterInput,
} from '@/lib/validations/admin';
import {
  createDemoAlumni,
  createDemoEvent,
  createDemoMedia,
  createDemoNewsletter,
  importDemoAlumni,
  updateDemoAboutContent,
  updateDemoAlumni,
  updateDemoEvent,
  updateDemoHomeContent,
  updateDemoMedia,
  updateDemoNewsletter,
} from '@/lib/demo-store';

type AdminPersistResult = {
  persisted: boolean;
  mode: 'supabase' | 'demo';
  error?: string;
};

export async function persistAdminAlumni(input: AdminAlumniInput): Promise<AdminPersistResult> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    await createDemoAlumni(input);
    return { persisted: true, mode: 'demo' };
  }

  const { data, error } = await supabase
    .from('alumni_profiles')
    .insert({
      full_name: input.fullName,
      graduation_year: input.graduationYear,
      graduation_term: input.graduationTerm,
      member_status: input.memberStatus,
      alumni_access_enabled: input.alumniAccessEnabled,
      major: input.major,
      company: input.company,
      job_title: input.jobTitle,
      industry: input.industry,
      location: input.location,
      short_bio: input.shortBio,
      linkedin_url: input.linkedinUrl || null,
      willing_to_mentor: input.willingToMentor,
      is_public: input.isPublic,
      is_featured: input.isFeatured
    })
    .select('id')
    .maybeSingle();

  if (error || !data?.id) {
    return {
      persisted: false,
      mode: 'supabase',
      error: error?.message || 'Unable to create alumni profile.'
    };
  }

  if (input.email || input.phone || input.bondNumber) {
    const { error: detailsError } = await supabase
      .from('alumni_private_details')
      .insert({
        alumni_profile_id: data.id,
        email: input.email || null,
        phone: input.phone || null,
        bond_number: input.bondNumber || null
      });

    if (detailsError) {
      return { persisted: false, mode: 'supabase', error: detailsError.message };
    }
  }

  return { persisted: true, mode: 'supabase' };
}

export async function updateAdminAlumni(id: string, input: AdminAlumniInput): Promise<AdminPersistResult> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    const updated = await updateDemoAlumni(id, input);
    return updated
      ? { persisted: true, mode: 'demo' }
      : { persisted: false, mode: 'demo', error: 'Record not found.' };
  }

  const { error } = await supabase
    .from('alumni_profiles')
    .update({
      full_name: input.fullName,
      graduation_year: input.graduationYear,
      graduation_term: input.graduationTerm,
      member_status: input.memberStatus,
      alumni_access_enabled: input.alumniAccessEnabled,
      major: input.major,
      company: input.company,
      job_title: input.jobTitle,
      industry: input.industry,
      location: input.location,
      short_bio: input.shortBio,
      linkedin_url: input.linkedinUrl || null,
      willing_to_mentor: input.willingToMentor,
      is_public: input.isPublic,
      is_featured: input.isFeatured,
    })
    .eq('id', id);

  if (error) return { persisted: false, mode: 'supabase', error: error.message };

  const privatePayload = {
    alumni_profile_id: id,
    email: input.email || null,
    phone: input.phone || null,
    bond_number: input.bondNumber || null,
  };

  const { error: detailsError } = await supabase
    .from('alumni_private_details')
    .upsert(privatePayload, {
      onConflict: 'alumni_profile_id'
    });

  return detailsError
    ? { persisted: false, mode: 'supabase', error: detailsError.message }
    : { persisted: true, mode: 'supabase' };
}

export async function persistAdminEvent(input: AdminEventInput): Promise<AdminPersistResult> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    await createDemoEvent(input);
    return { persisted: true, mode: 'demo' };
  }

  const { error } = await supabase.from('events').insert({
    title: input.title,
    slug: input.slug,
    event_date: input.eventDate,
    event_time: input.eventTime,
    location: input.location,
    audience: input.audience,
    description: input.description,
    body_content: input.bodyContent,
    tags: input.tags ? input.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
    is_featured: input.isFeatured,
    status: input.status
  });

  return error ? { persisted: false, mode: 'supabase', error: error.message } : { persisted: true, mode: 'supabase' };
}

export async function updateAdminEvent(id: string, input: AdminEventInput): Promise<AdminPersistResult> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    const updated = await updateDemoEvent(id, input);
    return updated ? { persisted: true, mode: 'demo' } : { persisted: false, mode: 'demo', error: 'Record not found.' };
  }

  const { error } = await supabase.from('events').update({
    title: input.title,
    slug: input.slug,
    event_date: input.eventDate,
    event_time: input.eventTime,
    location: input.location,
    audience: input.audience,
    description: input.description,
    body_content: input.bodyContent,
    tags: input.tags ? input.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
    is_featured: input.isFeatured,
    status: input.status
  }).eq('id', id);

  return error ? { persisted: false, mode: 'supabase', error: error.message } : { persisted: true, mode: 'supabase' };
}

export async function persistAdminNewsletter(input: AdminNewsletterInput): Promise<AdminPersistResult> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    await createDemoNewsletter(input);
    return { persisted: true, mode: 'demo' };
  }

  const { error } = await supabase.from('newsletters').insert({
    title: input.title,
    slug: input.slug,
    category: input.category,
    issue_date: input.issueDate,
    subject_line: input.subjectLine,
    summary: input.summary,
    body_content: input.bodyContent,
    status: input.status,
    is_featured: input.isFeatured
  });

  return error ? { persisted: false, mode: 'supabase', error: error.message } : { persisted: true, mode: 'supabase' };
}

export async function updateAdminNewsletter(id: string, input: AdminNewsletterInput): Promise<AdminPersistResult> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    const updated = await updateDemoNewsletter(id, input);
    return updated ? { persisted: true, mode: 'demo' } : { persisted: false, mode: 'demo', error: 'Record not found.' };
  }

  const { error } = await supabase.from('newsletters').update({
    title: input.title,
    slug: input.slug,
    category: input.category,
    issue_date: input.issueDate,
    subject_line: input.subjectLine,
    summary: input.summary,
    body_content: input.bodyContent,
    status: input.status,
    is_featured: input.isFeatured
  }).eq('id', id);

  return error ? { persisted: false, mode: 'supabase', error: error.message } : { persisted: true, mode: 'supabase' };
}

export async function persistAdminMedia(input: AdminMediaInput): Promise<AdminPersistResult> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    await createDemoMedia(input);
    return { persisted: true, mode: 'demo' };
  }

  const { error } = await supabase.from('media_items').insert({
    title: input.title,
    media_type: input.mediaType,
    file_url: input.fileUrl || null,
    year_label: input.yearLabel || null,
    caption: input.caption || null,
    storage_bucket: input.storageBucket || null,
    storage_path: input.storagePath || null
  });

  return error ? { persisted: false, mode: 'supabase', error: error.message } : { persisted: true, mode: 'supabase' };
}

export async function updateAdminMedia(id: string, input: AdminMediaInput): Promise<AdminPersistResult> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    const updated = await updateDemoMedia(id, input);
    return updated ? { persisted: true, mode: 'demo' } : { persisted: false, mode: 'demo', error: 'Record not found.' };
  }

  const { error } = await supabase.from('media_items').update({
    title: input.title,
    media_type: input.mediaType,
    file_url: input.fileUrl || null,
    year_label: input.yearLabel || null,
    caption: input.caption || null,
    storage_bucket: input.storageBucket || null,
    storage_path: input.storagePath || null
  }).eq('id', id);

  return error ? { persisted: false, mode: 'supabase', error: error.message } : { persisted: true, mode: 'supabase' };
}

export async function updateHomePageContent(input: AdminHomePageInput): Promise<AdminPersistResult> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    await updateDemoHomeContent(input);
    return { persisted: true, mode: 'demo' };
  }

  const rows = Object.entries(input).map(([content_key, content_value]) => ({
    page_slug: 'home',
    content_key,
    content_value
  }));

  const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'page_slug,content_key' });
  return error ? { persisted: false, mode: 'supabase', error: error.message } : { persisted: true, mode: 'supabase' };
}

export async function updateAboutPageContent(input: AdminAboutPageInput): Promise<AdminPersistResult> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    await updateDemoAboutContent(input);
    return { persisted: true, mode: 'demo' };
  }

  const rows = Object.entries(input).map(([content_key, content_value]) => ({
    page_slug: 'about',
    content_key,
    content_value
  }));

  const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'page_slug,content_key' });
  return error ? { persisted: false, mode: 'supabase', error: error.message } : { persisted: true, mode: 'supabase' };
}

export async function importAdminAlumni(records: AdminAlumniInput[]): Promise<AdminPersistResult & { count?: number }> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    const result = await importDemoAlumni(records);
    return { persisted: true, mode: 'demo', count: result.count };
  }

  for (const input of records) {
    const normalizedEmail = input.email?.trim().toLowerCase() || null;
    let profileId: string | null = null;

    if (normalizedEmail) {
      const privateLookup = await supabase
        .from('alumni_private_details')
        .select('alumni_profile_id')
        .eq('email', normalizedEmail)
        .maybeSingle();

      profileId = (privateLookup.data?.alumni_profile_id as string | undefined) ?? null;
    }

    if (!profileId) {
      const profileLookup = await supabase
        .from('alumni_profiles')
        .select('id')
        .eq('full_name', input.fullName)
        .eq('graduation_year', input.graduationYear)
        .maybeSingle();

      profileId = (profileLookup.data?.id as string | undefined) ?? null;
    }

    if (profileId) {
      const updated = await updateAdminAlumni(profileId, input);
      if (!updated.persisted) return { ...updated, count: undefined };
      continue;
    }

    const created = await persistAdminAlumni(input);
    if (!created.persisted) return { ...created, count: undefined };
  }

  return { persisted: true, mode: 'supabase', count: records.length };
}