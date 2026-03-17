alter table if exists alumni_profiles
  add column if not exists graduation_term text default 'spring',
  add column if not exists member_status text default 'alumni',
  add column if not exists alumni_access_enabled boolean default true;

create table if not exists site_content (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null,
  content_key text not null,
  content_value text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_slug, content_key)
);

create index if not exists idx_alumni_profiles_member_status on alumni_profiles(member_status);
create index if not exists idx_alumni_profiles_alumni_access on alumni_profiles(alumni_access_enabled);
create index if not exists idx_site_content_page_slug on site_content(page_slug);

insert into site_content (page_slug, content_key, content_value)
values
  ('home', 'heroEyebrow', 'Phi Delta Theta Alumni Network'),
  ('home', 'heroTitle', 'Brotherhood That Endures Beyond Graduation'),
  ('home', 'heroDescription', 'A refined digital home built to honor chapter legacy, strengthen alumni connection, and create meaningful opportunities for mentorship, events, and lifelong engagement.'),
  ('home', 'missionEyebrow', 'Our Purpose'),
  ('home', 'missionTitle', 'A modern home for lifelong brotherhood'),
  ('home', 'missionDescription', 'This website is designed to help alumni stay connected, preserve chapter history, support active brothers, and create a stronger long-term network across generations.'),
  ('home', 'valuesEyebrow', 'Values'),
  ('home', 'valuesTitle', 'The principles that should shape every section of the site'),
  ('home', 'valuesDescription', 'The visual style may feel modern, but the site should still communicate fraternity tradition, chapter pride, and service-minded leadership.'),
  ('home', 'statsEyebrow', 'At a Glance'),
  ('home', 'statsTitle', 'The chapter, measured in connection and continuity'),
  ('home', 'statsDescription', 'A premium alumni site should communicate substance right away: history, engagement, and opportunities to stay involved.'),
  ('home', 'eventsEyebrow', 'Featured Event'),
  ('home', 'eventsTitle', 'Gatherings that keep the brotherhood active'),
  ('home', 'eventsDescription', 'From formal banquets to networking nights and reunions, events should be easy to discover and feel worth attending.'),
  ('home', 'newsletterEyebrow', 'Latest Communication'),
  ('home', 'newsletterTitle', 'Chapter updates that keep alumni informed'),
  ('home', 'newsletterDescription', 'The newsletter experience should feel polished and official, with clear archives and simple signup for ongoing communication.'),
  ('home', 'spotlightEyebrow', 'Featured Story'),
  ('home', 'spotlightTitle', 'Celebrate the brothers shaping life beyond the chapter'),
  ('home', 'spotlightDescription', 'Alumni stories help future graduates see what this network can become and remind returning brothers why staying connected matters.'),
  ('home', 'legacyEyebrow', 'Legacy Vault'),
  ('home', 'legacyTitle', 'Preserve the chapter memory with care'),
  ('home', 'legacyDescription', 'Build a digital archive for composite boards, reunion photos, letters, milestone documents, and stories that deserve to outlast any one generation.'),
  ('home', 'finalCtaEyebrow', 'Get involved'),
  ('home', 'finalCtaTitle', 'Help shape the next era of the chapter'),
  ('home', 'finalCtaDescription', 'Encourage alumni to update their information, mentor active brothers, attend events, and contribute memories that strengthen the chapter over time.'),
  ('about', 'heroEyebrow', 'About the Chapter'),
  ('about', 'heroTitle', 'A chapter story built on tradition, service, and enduring connection'),
  ('about', 'heroDescription', 'This page is structured to feel like a premium chapter history page rather than a wall of text, using narrative sections, milestones, and thematic content blocks.'),
  ('about', 'overviewTitle', 'Chapter overview'),
  ('about', 'overviewDescription', 'Phi Delta Theta has long served as a place where friendship, leadership, scholarship, and service extend beyond campus and into lifelong brotherhood.'),
  ('about', 'overviewBody', 'This starter gives you a polished framework for telling the real story of your chapter: where it began, how it grew, what traditions define it, and why alumni remain connected years after graduation.'),
  ('about', 'overviewBodySecondary', 'Once you replace the sample copy with chapter-specific history, this page can become one of the strongest emotional trust-builders on the site.'),
  ('about', 'themesTitle', 'Core themes to emphasize'),
  ('about', 'themeOneTitle', 'Founding identity'),
  ('about', 'themeOneDescription', 'Why the chapter was established and what values shaped its earliest era.'),
  ('about', 'themeTwoTitle', 'Traditions'),
  ('about', 'themeTwoDescription', 'Rituals, annual moments, and shared experiences that brothers still remember.'),
  ('about', 'themeThreeTitle', 'Legacy'),
  ('about', 'themeThreeDescription', 'The chapter''s impact on leadership, service, career development, and lifelong connection.'),
  ('about', 'timelineEyebrow', 'Timeline'),
  ('about', 'timelineTitle', 'Major moments in chapter history'),
  ('about', 'timelineDescription', 'Use this format to preserve institutional memory in a way future officers can actually maintain.')
on conflict (page_slug, content_key) do nothing;
