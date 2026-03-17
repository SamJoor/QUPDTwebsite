create index if not exists idx_contact_submissions_inquiry_type on contact_submissions (inquiry_type);
create index if not exists idx_newsletter_subscribers_is_active on newsletter_subscribers (is_active);
create index if not exists idx_newsletters_status on newsletters (status);
