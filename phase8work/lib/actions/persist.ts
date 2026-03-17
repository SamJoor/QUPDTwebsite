import { ContactInput, MentorInput, MenteeInput, NewsletterInput, RSVPInput } from '@/lib/validations/forms';
import { createServerSupabaseClient } from '@/lib/supabase/server';

type PersistenceResult = {
  persisted: boolean;
  mode: 'supabase' | 'demo';
  error?: string;
};

export async function persistNewsletterSignup(input: NewsletterInput): Promise<PersistenceResult> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return { persisted: false, mode: 'demo' };

  const { error } = await supabase.from('newsletter_subscribers').upsert({
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    graduation_year: input.graduationYear ? Number(input.graduationYear) : null,
    subscriber_type: input.subscriberType,
    is_active: true
  }, { onConflict: 'email' });

  return error ? { persisted: false, mode: 'supabase', error: error.message } : { persisted: true, mode: 'supabase' };
}

export async function persistContactSubmission(input: ContactInput): Promise<PersistenceResult> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return { persisted: false, mode: 'demo' };

  const { error } = await supabase.from('contact_submissions').insert({
    full_name: input.name,
    email: input.email,
    inquiry_type: input.topic,
    message: input.message
  });

  return error ? { persisted: false, mode: 'supabase', error: error.message } : { persisted: true, mode: 'supabase' };
}

export async function persistMentorApplication(input: MentorInput): Promise<PersistenceResult> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return { persisted: false, mode: 'demo' };

  const [company, ...titleParts] = input.companyTitle.split(' - ');
  const { error } = await supabase.from('mentors').insert({
    full_name: input.name,
    graduation_year: Number(input.graduationYear),
    company: company?.trim() || input.companyTitle,
    job_title: titleParts.join(' - ').trim() || input.companyTitle,
    industry: input.industry,
    mentoring_areas: input.mentoringAreas,
    preferred_contact_method: 'email',
    availability: input.availability,
    email: input.email
  });

  return error ? { persisted: false, mode: 'supabase', error: error.message } : { persisted: true, mode: 'supabase' };
}

export async function persistMenteeRequest(input: MenteeInput): Promise<PersistenceResult> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return { persisted: false, mode: 'demo' };

  const { error } = await supabase.from('mentee_requests').insert({
    full_name: input.name,
    class_year: input.classYear,
    career_interests: input.careerInterests,
    goals: input.goals,
    linkedin_url: input.linkedInOrResume || null,
    preferred_mentor_background: input.preferredBackground || null,
    email: input.email
  });

  return error ? { persisted: false, mode: 'supabase', error: error.message } : { persisted: true, mode: 'supabase' };
}

export async function persistEventRsvp(input: RSVPInput): Promise<PersistenceResult> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return { persisted: false, mode: 'demo' };

  const { data: event } = await supabase.from('events').select('id').eq('slug', input.eventSlug).maybeSingle();

  if (!event) {
    return { persisted: false, mode: 'supabase', error: 'Event not found in Supabase.' };
  }

  const { error } = await supabase.from('event_rsvps').insert({
    event_id: event.id,
    full_name: input.fullName,
    email: input.email,
    graduation_year: input.graduationYear ? Number(input.graduationYear) : null,
    guest_count: input.guestCount,
    notes: input.notes || null
  });

  return error ? { persisted: false, mode: 'supabase', error: error.message } : { persisted: true, mode: 'supabase' };
}
