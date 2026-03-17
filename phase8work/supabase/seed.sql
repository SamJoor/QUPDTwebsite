insert into alumni_profiles (full_name, graduation_year, graduation_term, member_status, alumni_access_enabled, major, company, job_title, industry, location, linkedin_url, short_bio, willing_to_mentor, is_featured, is_public)
values
  ('Michael Harrington', 2014, 'spring', 'alumni', true, 'Economics', 'Goldman Sachs', 'Vice President', 'Finance', 'New York, NY', 'https://www.linkedin.com/', 'Helps young alumni navigate recruiting, leadership, and early-career decisions.', true, true, true),
  ('Daniel Russo', 2018, 'spring', 'alumni', true, 'Computer Science', 'HubSpot', 'Product Manager', 'Technology', 'Boston, MA', 'https://www.linkedin.com/', 'Advises brothers on internships, product, and career pivots.', true, false, true),
  ('Anthony Morales', 2011, 'spring', 'alumni', true, 'Management', 'Yale New Haven Health', 'Operations Director', 'Healthcare', 'New Haven, CT', null, 'Supports alumni engagement and mission-driven careers.', false, false, true)
on conflict do nothing;

insert into events (slug, title, event_date, event_time, location, description, is_featured, status, audience, image_hint, body_content, tags)
values
  ('founders-day-banquet', 'Founders Day Banquet', '2026-04-18', '6:30 PM', 'New Haven Lawn Club', 'Join alumni, active brothers, and supporters for an evening honoring chapter legacy.', true, 'published', 'Alumni, active brothers, families, and chapter friends', 'Formal banquet, chapter traditions, annual recognition', 'Founders Day should feel like the chapter''s signature evening.

This page structure is already set up to support event detail copy and RSVP collection.', ARRAY['Founders Day','Tradition','Flagship Event']),
  ('career-night', 'Alumni Career Night', '2026-05-05', '7:00 PM', 'Chapter House & Zoom', 'A networking evening connecting students with alumni across major industries.', false, 'published', 'Active brothers and early-career alumni', 'Networking, mentorship, professional guidance', 'Career Night is one of the easiest ways to turn alumni goodwill into direct student impact.', ARRAY['Career','Mentorship','Hybrid'])
on conflict do nothing;

insert into newsletters (slug, title, subject_line, summary, body_content, issue_date, status, is_featured, category)
values
  ('spring-2026-brotherhood-update', 'Spring 2026 Brotherhood Update', 'Spring 2026 Brotherhood Update', 'A look at chapter achievements, alumni news, service highlights, and the events shaping this semester.', 'This issue format is already structured like a real archive page.

Once an email provider is connected, this same content can power both the web archive and the outgoing newsletter.', '2026-03-01', 'published', true, 'Chapter Update')
on conflict do nothing;

insert into alumni_private_details (alumni_profile_id, email, phone)
select id, lower(replace(full_name, ' ', '.')) || '@example.org', '(555) 010-2026'
from alumni_profiles
on conflict (alumni_profile_id) do nothing;

insert into admin_users (email, full_name)
values ('admin@example.org', 'Chapter Admin')
on conflict (email) do nothing;
