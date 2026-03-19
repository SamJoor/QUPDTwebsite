import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(4),
  scope: z.enum(['admin', 'alumni', "active"]),
});

export const adminAlumniSchema = z.object({
  fullName: z.string().min(2),
  graduationYear: z.coerce.number().int().min(1900).max(2100),
  graduationTerm: z.enum(['spring', 'summer', 'fall', 'winter']).default('spring'),
  memberStatus: z.enum(['active', 'graduating', 'alumni', 'inactive']).default('alumni'),
  alumniAccessEnabled: z.boolean().default(true),
  major: z.string().min(2),
  company: z.string().min(2),
  jobTitle: z.string().min(2),
  industry: z.string().min(2),
  location: z.string().min(2),
  shortBio: z.string().min(20),
  linkedinUrl: z.string().url().or(z.literal('')).optional(),
  email: z.email().or(z.literal('')).optional(),
  phone: z.string().optional(),
  bondNumber: z.string().optional().default(''),
  willingToMentor: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  isFeatured: z.boolean().default(false)
});

export const adminEventSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  eventDate: z.string().min(8),
  eventTime: z.string().min(2),
  location: z.string().min(2),
  audience: z.string().min(2),
  description: z.string().min(20),
  bodyContent: z.string().min(20),
  tags: z.string().optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('published')
});

export const adminNewsletterSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().min(3).max(160).regex(/^[a-z0-9-]+$/),
  category: z.string().min(2).max(60),
  issueDate: z.string().min(7).max(20),
  subjectLine: z.string().min(3).max(160),
  summary: z.string().min(10).max(160),
  bodyContent: z.string().min(20).max(10000),
  status: z.enum(['draft', 'published', 'sent']).default('draft'),
  isFeatured: z.boolean().default(false)
});

export const adminMediaSchema = z.object({
  title: z.string().min(2),
  mediaType: z.enum(['photo', 'document', 'video', 'composite']),
  yearLabel: z.string().optional(),
  caption: z.string().optional(),
  fileUrl: z.string().url().or(z.literal('')).optional(),
  storageBucket: z.string().optional(),
  storagePath: z.string().optional()
});

export const adminHomePageSchema = z.object({
  heroEyebrow: z.string().min(2),
  heroTitle: z.string().min(5),
  heroDescription: z.string().min(20),
  missionEyebrow: z.string().min(2),
  missionTitle: z.string().min(5),
  missionDescription: z.string().min(20),
  valuesEyebrow: z.string().min(2),
  valuesTitle: z.string().min(5),
  valuesDescription: z.string().min(20),
  statsEyebrow: z.string().min(2),
  statsTitle: z.string().min(5),
  statsDescription: z.string().min(20),
  eventsEyebrow: z.string().min(2),
  eventsTitle: z.string().min(5),
  eventsDescription: z.string().min(20),
  newsletterEyebrow: z.string().min(2),
  newsletterTitle: z.string().min(5),
  newsletterDescription: z.string().min(20),
  spotlightEyebrow: z.string().min(2),
  spotlightTitle: z.string().min(5),
  spotlightDescription: z.string().min(20),
  legacyEyebrow: z.string().min(2),
  legacyTitle: z.string().min(5),
  legacyDescription: z.string().min(20),
  finalCtaEyebrow: z.string().min(2),
  finalCtaTitle: z.string().min(5),
  finalCtaDescription: z.string().min(20),
});

export const adminAboutPageSchema = z.object({
  heroEyebrow: z.string().min(2),
  heroTitle: z.string().min(5),
  heroDescription: z.string().min(20),
  overviewTitle: z.string().min(2),
  overviewDescription: z.string().min(20),
  overviewBody: z.string().min(20),
  overviewBodySecondary: z.string().min(20),
  themesTitle: z.string().min(2),
  themeOneTitle: z.string().min(2),
  themeOneDescription: z.string().min(10),
  themeTwoTitle: z.string().min(2),
  themeTwoDescription: z.string().min(10),
  themeThreeTitle: z.string().min(2),
  themeThreeDescription: z.string().min(10),
  timelineEyebrow: z.string().min(2),
  timelineTitle: z.string().min(5),
  timelineDescription: z.string().min(20),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type AdminAlumniInput = z.infer<typeof adminAlumniSchema>;
export type AdminEventInput = z.infer<typeof adminEventSchema>;
export type AdminNewsletterInput = z.infer<typeof adminNewsletterSchema>;
export type AdminMediaInput = z.infer<typeof adminMediaSchema>;
export type AdminHomePageInput = z.infer<typeof adminHomePageSchema>;
export type AdminAboutPageInput = z.infer<typeof adminAboutPageSchema>;