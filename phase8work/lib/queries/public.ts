import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AlumniProfile, EventItem, LegacyVaultItem, NewsletterIssue } from '@/types';
import { readDemoStore } from '@/lib/demo-store';
import { legacyVaultItems as fallbackLegacy } from '@/lib/constants/site';

type DbAlumniRow = {
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
  is_featured: boolean | null;
};

type DbEventRow = {
  slug: string;
  title: string;
  event_date: string;
  event_time: string | null;
  location: string | null;
  description: string | null;
  is_featured: boolean | null;
  audience: string | null;
  image_hint: string | null;
  body_content: string | null;
  tags: string[] | null;
};

type DbNewsletterRow = {
  slug: string;
  title: string;
  summary: string | null;
  issue_date: string | null;
  status: string | null;
  body_content: string | null;
  category: string | null;
};

type DbLegacyRow = {
  id: string;
  title: string;
  year_label: string | null;
  item_type: LegacyVaultItem['type'] | null;
  description: string | null;
};

function formatDate(date: string | null) {
  if (!date) return 'TBD';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(parsed);
}

function formatMonthYear(date: string | null) {
  if (!date) return 'Draft';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(parsed);
}

function paragraphize(content: string | null | undefined) {
  if (!content) return undefined;
  return content.split('\n\n').map((item) => item.trim()).filter(Boolean);
}

function mapAlumniRow(row: DbAlumniRow): AlumniProfile {
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
    featured: Boolean(row.is_featured)
  };
}

function mapEventRow(row: DbEventRow): EventItem {
  return {
    slug: row.slug,
    title: row.title,
    date: formatDate(row.event_date),
    time: row.event_time ?? 'TBD',
    location: row.location ?? 'Location TBA',
    description: row.description ?? 'Event details coming soon.',
    featured: Boolean(row.is_featured),
    audience: row.audience ?? undefined,
    imageHint: row.image_hint ?? undefined,
    body: paragraphize(row.body_content),
    tags: row.tags ?? undefined
  };
}

function mapNewsletterRow(row: DbNewsletterRow): NewsletterIssue {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.summary ?? 'Newsletter summary coming soon.',
    date: formatMonthYear(row.issue_date),
    category: row.category ?? row.status ?? 'Newsletter',
    body: paragraphize(row.body_content)
  };
}

function mapLegacyRow(row: DbLegacyRow): LegacyVaultItem {
  return {
    id: row.id,
    title: row.title,
    era: row.year_label ?? 'Undated',
    type: row.item_type ?? 'Story',
    description: row.description ?? 'Archive details coming soon.'
  };
}

async function getDemoPublicData() {
  const store = await readDemoStore();
  return {
    alumni: store.alumni.filter((row) => row.isPublic).map((row) => ({
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
      featured: row.isFeatured
    } satisfies AlumniProfile)),
    events: store.events.filter((row) => row.status === 'published').map((row) => ({
      slug: row.slug,
      title: row.title,
      date: formatDate(row.eventDate),
      time: row.eventTime,
      location: row.location,
      description: row.description,
      featured: row.isFeatured,
      audience: row.audience,
      body: paragraphize(row.bodyContent),
      tags: row.tags
    } satisfies EventItem)),
    newsletters: store.newsletters.filter((row) => row.status !== 'draft').map((row) => ({
      slug: row.slug,
      title: row.title,
      excerpt: row.summary,
      date: formatMonthYear(row.issueDate),
      category: row.category,
      body: paragraphize(row.bodyContent)
    } satisfies NewsletterIssue))
  };
}

export async function getAlumniProfiles(): Promise<AlumniProfile[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return (await getDemoPublicData()).alumni;

  const { data, error } = await supabase
    .from('alumni_profiles')
    .select('full_name, graduation_year, company, job_title, industry, location, short_bio, linkedin_url, willing_to_mentor, major, is_featured')
    .eq('is_public', true)
    .order('graduation_year', { ascending: false })
    .order('full_name', { ascending: true });

  if (error || !data?.length) return (await getDemoPublicData()).alumni;
  return (data as DbAlumniRow[]).map(mapAlumniRow);
}

export async function getEvents(): Promise<EventItem[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return (await getDemoPublicData()).events;

  const { data, error } = await supabase
    .from('events')
    .select('slug, title, event_date, event_time, location, description, is_featured, audience, image_hint, body_content, tags')
    .eq('status', 'published')
    .order('event_date', { ascending: true });

  if (error || !data?.length) return (await getDemoPublicData()).events;
  return (data as DbEventRow[]).map(mapEventRow);
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return (await getDemoPublicData()).events.find((event) => event.slug === slug) ?? null;

  const { data } = await supabase
    .from('events')
    .select('slug, title, event_date, event_time, location, description, is_featured, audience, image_hint, body_content, tags')
    .eq('slug', slug)
    .maybeSingle();

  if (!data) return (await getDemoPublicData()).events.find((event) => event.slug === slug) ?? null;
  return mapEventRow(data as DbEventRow);
}

export async function getNewsletters(): Promise<NewsletterIssue[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return (await getDemoPublicData()).newsletters;

  const { data, error } = await supabase
    .from('newsletters')
    .select('slug, title, summary, issue_date, status, body_content, category')
    .in('status', ['published', 'sent'])
    .order('issue_date', { ascending: false });

  if (error || !data?.length) return (await getDemoPublicData()).newsletters;
  return (data as DbNewsletterRow[]).map(mapNewsletterRow);
}

export async function getNewsletterBySlug(slug: string): Promise<NewsletterIssue | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return (await getDemoPublicData()).newsletters.find((issue) => issue.slug === slug) ?? null;

  const { data } = await supabase
    .from('newsletters')
    .select('slug, title, summary, issue_date, status, body_content, category')
    .eq('slug', slug)
    .maybeSingle();

  if (!data) return (await getDemoPublicData()).newsletters.find((issue) => issue.slug === slug) ?? null;
  return mapNewsletterRow(data as DbNewsletterRow);
}

export async function getLegacyVaultItems(): Promise<LegacyVaultItem[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return fallbackLegacy;

  const { data, error } = await supabase
    .from('legacy_vault_items')
    .select('id, title, year_label, item_type, description')
    .eq('status', 'approved')
    .order('year_label', { ascending: false });

  if (error || !data?.length) return fallbackLegacy;
  return (data as DbLegacyRow[]).map(mapLegacyRow);
}
