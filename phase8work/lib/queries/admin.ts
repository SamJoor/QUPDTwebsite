import { createServerSupabaseClient, hasSupabaseServerAccess } from '@/lib/supabase/server';
import { MediaItem } from '@/types';
import { readDemoStore } from '@/lib/demo-store';

type TableRow = {
  id: string;
  primary: string;
  secondary: string;
  tertiary?: string;
  badge?: string;
};

export async function getAdminOverview() {
  const supabase = createServerSupabaseClient();

  if (!supabase || !hasSupabaseServerAccess()) {
    const store = await readDemoStore();
    return {
      dataSource: 'demo',
      stats: {
        alumniCount: store.alumni.length,
        mentorsCount: store.alumni.filter((profile) => profile.willingToMentor).length,
        upcomingEvents: store.events.length,
        newsletterCount: store.newsletters.length,
        pendingLegacySubmissions: store.media.length,
        unreadContacts: 0
      }
    };
  }

  const [alumniRes, mentorsRes, eventsRes, newslettersRes, legacyRes, contactsRes] = await Promise.all([
    supabase.from('alumni_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('alumni_profiles').select('*', { count: 'exact', head: true }).eq('willing_to_mentor', true),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('newsletters').select('*', { count: 'exact', head: true }),
    supabase.from('legacy_vault_items').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true })
  ]);

  return {
    dataSource: 'supabase',
    stats: {
      alumniCount: alumniRes.count ?? 0,
      mentorsCount: mentorsRes.count ?? 0,
      upcomingEvents: eventsRes.count ?? 0,
      newsletterCount: newslettersRes.count ?? 0,
      pendingLegacySubmissions: legacyRes.count ?? 0,
      unreadContacts: contactsRes.count ?? 0
    }
  };
}

export async function getAdminRecentItems() {
  const supabase = createServerSupabaseClient();

  if (!supabase || !hasSupabaseServerAccess()) {
    const store = await readDemoStore();
    return {
      dataSource: 'demo',
      recentAlumni: store.alumni.slice(0, 5).map((profile) => ({
        id: profile.id,
        primary: profile.fullName,
        secondary: `${profile.graduationYear} • ${profile.company}`,
        status: profile.willingToMentor ? 'Mentor' : 'Alumni'
      })),
      recentEvents: store.events.slice(0, 4).map((event) => ({
        id: event.id,
        primary: event.title,
        secondary: `${event.eventDate} • ${event.location}`,
        status: event.isFeatured ? 'Featured' : 'Published'
      })),
      recentNewsletters: store.newsletters.slice(0, 4).map((issue) => ({
        id: issue.id,
        primary: issue.title,
        secondary: issue.issueDate,
        status: issue.category
      }))
    };
  }

  const [alumniRes, eventsRes, newslettersRes] = await Promise.all([
    supabase.from('alumni_profiles').select('id, full_name, graduation_year, company, willing_to_mentor').order('created_at', { ascending: false }).limit(5),
    supabase.from('events').select('id, title, event_date, location, is_featured').order('created_at', { ascending: false }).limit(4),
    supabase.from('newsletters').select('id, title, issue_date, status').order('created_at', { ascending: false }).limit(4)
  ]);

  return {
    dataSource: 'supabase',
    recentAlumni: alumniRes.data?.map((row: { id: string; full_name: string; graduation_year: number | null; company: string | null; willing_to_mentor: boolean | null }) => ({
      id: row.id,
      primary: row.full_name,
      secondary: `${row.graduation_year ?? '—'} • ${row.company ?? 'Company TBA'}`,
      status: row.willing_to_mentor ? 'Mentor' : 'Alumni'
    })) ?? [],
    recentEvents: eventsRes.data?.map((row: { id: string; title: string; event_date: string; location: string | null; is_featured: boolean | null }) => ({
      id: row.id,
      primary: row.title,
      secondary: `${row.event_date} • ${row.location ?? 'Location TBA'}`,
      status: row.is_featured ? 'Featured' : 'Published'
    })) ?? [],
    recentNewsletters: newslettersRes.data?.map((row: { id: string; title: string; issue_date: string | null; status: string | null }) => ({
      id: row.id,
      primary: row.title,
      secondary: row.issue_date ?? 'Draft',
      status: row.status ?? 'Draft'
    })) ?? []
  };
}

export async function getAdminAlumniRecords(): Promise<TableRow[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase || !hasSupabaseServerAccess()) {
    const store = await readDemoStore();
    return store.alumni.map((row) => ({
      id: row.id,
      primary: row.fullName,
      secondary: `${row.graduationYear} ${row.graduationTerm} • ${row.jobTitle}, ${row.company}`,
      tertiary: `${row.location} • ${row.industry}`,
      badge: row.memberStatus === 'active' ? 'Active member' : row.alumniAccessEnabled ? 'Alumni-enabled' : 'Restricted'
    }));
  }

  const { data } = await supabase
    .from('alumni_profiles')
    .select('id, full_name, graduation_year, graduation_term, member_status, alumni_access_enabled, job_title, company, location, industry, willing_to_mentor, is_public')
    .order('created_at', { ascending: false })
    .limit(50);

  return data?.map((row: { id: string; full_name: string; graduation_year: number | null; graduation_term: string | null; member_status: string | null; alumni_access_enabled: boolean | null; job_title: string | null; company: string | null; location: string | null; industry: string | null; willing_to_mentor: boolean | null; is_public: boolean | null }) => ({
    id: row.id,
    primary: row.full_name,
    secondary: `${row.graduation_year ?? '—'} ${row.graduation_term ?? ''} • ${row.job_title ?? 'Title TBA'}, ${row.company ?? 'Company TBA'}`.trim(),
    tertiary: `${row.location ?? '—'} • ${row.industry ?? '—'}`,
    badge: row.member_status === 'active' ? 'Active member' : row.alumni_access_enabled ? 'Alumni-enabled' : 'Restricted'
  })) ?? [];
}

export async function getAdminEventRecords(): Promise<TableRow[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase || !hasSupabaseServerAccess()) {
    const store = await readDemoStore();
    return store.events.map((row) => ({
      id: row.id,
      primary: row.title,
      secondary: `${row.eventDate} • ${row.location}`,
      tertiary: row.description,
      badge: row.isFeatured ? 'Featured' : row.status
    }));
  }

  const { data } = await supabase
    .from('events')
    .select('id, title, event_date, location, description, is_featured, status')
    .order('event_date', { ascending: true })
    .limit(50);

  return data?.map((row: { id: string; title: string; event_date: string; location: string | null; description: string | null; is_featured: boolean | null; status: string | null }) => ({
    id: row.id,
    primary: row.title,
    secondary: `${row.event_date} • ${row.location ?? 'Location TBA'}`,
    tertiary: row.description ?? '',
    badge: row.is_featured ? 'Featured' : row.status ?? 'Draft'
  })) ?? [];
}

function truncateText(value: string | null | undefined, max = 120) {
  const text = (value || "").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export async function getAdminNewsletterRecords(): Promise<TableRow[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase || !hasSupabaseServerAccess()) {
    const store = await readDemoStore();
    return store.newsletters.map((row) => ({
      id: row.id,
      primary: row.title,
      secondary: `${row.issueDate} • ${row.category}`,
      tertiary: truncateText(row.summary, 120),
      badge: row.status,
    }));
  }

  const { data } = await supabase
    .from("newsletters")
    .select("id, title, issue_date, category, summary, status")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    data?.map(
      (row: {
        id: string;
        title: string;
        issue_date: string | null;
        category: string | null;
        summary: string | null;
        status: string | null;
      }) => ({
        id: row.id,
        primary: row.title,
        secondary: `${row.issue_date ?? "Draft"} • ${row.category ?? "Newsletter"}`,
        tertiary: truncateText(row.summary, 120),
        badge: row.status ?? "Draft",
      })
    ) ?? []
  );
}

export async function getAdminMediaRecords(): Promise<MediaItem[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase || !hasSupabaseServerAccess()) {
    const store = await readDemoStore();
    return store.media.map((row) => ({
      id: row.id,
      title: row.title,
      mediaType: row.mediaType,
      yearLabel: row.yearLabel,
      caption: row.caption,
      fileUrl: row.fileUrl,
      storageBucket: row.storageBucket,
      storagePath: row.storagePath
    }));
  }

  const { data } = await supabase
    .from('media_items')
    .select('id, title, media_type, year_label, caption, file_url, storage_bucket, storage_path')
    .order('created_at', { ascending: false })
    .limit(50);

  return data?.map((row: { id: string; title: string; media_type: string; year_label: string | null; caption: string | null; file_url: string | null; storage_bucket?: string | null; storage_path?: string | null }) => ({
    id: row.id,
    title: row.title,
    mediaType: row.media_type,
    yearLabel: row.year_label ?? undefined,
    caption: row.caption ?? undefined,
    fileUrl: row.file_url ?? undefined,
    storageBucket: row.storage_bucket ?? undefined,
    storagePath: row.storage_path ?? undefined
  })) ?? [];
}

type AdminAlumniDetail = {
  id: string;
  fullName: string;
  graduationYear: number;
  major: string;
  company: string;
  jobTitle: string;
  industry: string;
  location: string;
  shortBio: string;
  linkedinUrl?: string;
  email?: string;
  phone?: string;
  graduationTerm: 'spring' | 'summer' | 'fall' | 'winter';
  memberStatus: 'active' | 'graduating' | 'alumni' | 'inactive';
  alumniAccessEnabled: boolean;
  willingToMentor: boolean;
  isPublic: boolean;
  isFeatured: boolean;
};

export async function getAdminAlumniRecordById(id: string): Promise<AdminAlumniDetail | null> {
  const supabase = createServerSupabaseClient();

  if (!supabase || !hasSupabaseServerAccess()) {
    const store = await readDemoStore();
    const row = store.alumni.find((item) => item.id === id);
    return row ? {
      id: row.id,
      fullName: row.fullName,
      graduationYear: row.graduationYear,
      major: row.major,
      company: row.company,
      jobTitle: row.jobTitle,
      industry: row.industry,
      location: row.location,
      shortBio: row.shortBio,
      linkedinUrl: row.linkedinUrl,
      email: row.email,
      phone: row.phone,
      graduationTerm: row.graduationTerm,
      memberStatus: row.memberStatus,
      alumniAccessEnabled: row.alumniAccessEnabled,
      willingToMentor: row.willingToMentor,
      isPublic: row.isPublic,
      isFeatured: row.isFeatured,
    } : null;
  }

  const [{ data: profile }, { data: details }] = await Promise.all([
    supabase.from('alumni_profiles').select('id, full_name, graduation_year, graduation_term, member_status, alumni_access_enabled, major, company, job_title, industry, location, short_bio, linkedin_url, willing_to_mentor, is_public, is_featured').eq('id', id).maybeSingle(),
    supabase.from('alumni_private_details').select('email, phone').eq('alumni_profile_id', id).maybeSingle(),
  ]);

  if (!profile) return null;

  return {
    id: profile.id,
    fullName: profile.full_name,
    graduationYear: profile.graduation_year ?? new Date().getFullYear(),
    major: profile.major ?? '',
    company: profile.company ?? '',
    jobTitle: profile.job_title ?? '',
    industry: profile.industry ?? '',
    location: profile.location ?? '',
    shortBio: profile.short_bio ?? '',
    linkedinUrl: profile.linkedin_url ?? undefined,
    email: details?.email ?? undefined,
    phone: details?.phone ?? undefined,
    graduationTerm: (profile.graduation_term ?? 'spring') as 'spring' | 'summer' | 'fall' | 'winter',
    memberStatus: (profile.member_status ?? 'alumni') as 'active' | 'graduating' | 'alumni' | 'inactive',
    alumniAccessEnabled: Boolean(profile.alumni_access_enabled ?? true),
    willingToMentor: Boolean(profile.willing_to_mentor),
    isPublic: Boolean(profile.is_public),
    isFeatured: Boolean(profile.is_featured),
  };
}

type AdminEventDetail = {
  id: string;
  title: string;
  slug: string;
  eventDate: string;
  eventTime: string;
  location: string;
  audience: string;
  description: string;
  bodyContent: string;
  tags: string;
  isFeatured: boolean;
  status: 'draft' | 'published';
};

export async function getAdminEventRecordById(id: string): Promise<AdminEventDetail | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase || !hasSupabaseServerAccess()) {
    const store = await readDemoStore();
    const row = store.events.find((item) => item.id === id);
    return row ? {
      ...row,
      tags: row.tags.join(', '),
    } : null;
  }

  const { data } = await supabase.from('events').select('id, title, slug, event_date, event_time, location, audience, description, body_content, tags, is_featured, status').eq('id', id).maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    eventDate: data.event_date,
    eventTime: data.event_time ?? '',
    location: data.location ?? '',
    audience: data.audience ?? '',
    description: data.description ?? '',
    bodyContent: data.body_content ?? '',
    tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
    isFeatured: Boolean(data.is_featured),
    status: (data.status ?? 'draft') as 'draft' | 'published',
  };
}

type AdminNewsletterDetail = {
  id: string;
  title: string;
  slug: string;
  category: string;
  issueDate: string;
  subjectLine: string;
  summary: string;
  bodyContent: string;
  status: 'draft' | 'published' | 'sent';
  isFeatured: boolean;
};

export async function getAdminNewsletterRecordById(id: string): Promise<AdminNewsletterDetail | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase || !hasSupabaseServerAccess()) {
    const store = await readDemoStore();
    return store.newsletters.find((item) => item.id === id) ?? null;
  }

  const { data } = await supabase.from('newsletters').select('id, title, slug, category, issue_date, subject_line, summary, body_content, status, is_featured').eq('id', id).maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    category: data.category ?? '',
    issueDate: data.issue_date ?? '',
    subjectLine: data.subject_line ?? '',
    summary: data.summary ?? '',
    bodyContent: data.body_content ?? '',
    status: (data.status ?? 'draft') as 'draft' | 'published' | 'sent',
    isFeatured: Boolean(data.is_featured),
  };
}

type AdminMediaDetail = {
  id: string;
  title: string;
  mediaType: 'photo' | 'document' | 'video' | 'composite';
  yearLabel?: string;
  caption?: string;
  fileUrl?: string;
  storageBucket?: string;
  storagePath?: string;
};

export async function getAdminMediaRecordById(id: string): Promise<AdminMediaDetail | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase || !hasSupabaseServerAccess()) {
    return (await readDemoStore()).media.find((item) => item.id === id) ?? null;
  }

  const { data } = await supabase.from('media_items').select('id, title, media_type, year_label, caption, file_url, storage_bucket, storage_path').eq('id', id).maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    title: data.title,
    mediaType: data.media_type,
    yearLabel: data.year_label ?? undefined,
    caption: data.caption ?? undefined,
    fileUrl: data.file_url ?? undefined,
    storageBucket: data.storage_bucket ?? undefined,
    storagePath: data.storage_path ?? undefined,
  };
}
