export type NavItem = {
  label: string;
  href: string;
};

export type Stat = {
  label: string;
  value: string;
  description?: string;
};

export type EventItem = {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  featured?: boolean;
  audience?: string;
  imageHint?: string;
  body?: string[];
  schedule?: { time: string; label: string }[];
  tags?: string[];
};

export type AlumniProfile = {
  name: string;
  gradYear: string;
  company: string;
  title: string;
  industry: string;
  location: string;
  bio: string;
  linkedin?: string;
  mentor: boolean;
  major?: string;
  interests?: string[];
  featured?: boolean;
};

export type MemberDirectoryProfile = AlumniProfile & {
  email?: string;
  phone?: string;
  preferredContactMethod?: string;
};

export type NewsletterIssue = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  body?: string[];
};

export type Spotlight = {
  name: string;
  role: string;
  quote: string;
  story: string;
};

export type TimelineEntry = {
  year: string;
  title: string;
  description: string;
};

export type LegacyVaultItem = {
  id: string;
  title: string;
  era: string;
  type: "Photo" | "Document" | "Story" | "Composite";
  description: string;
};

export type MediaItem = {
  id: string;
  title: string;
  mediaType: string;
  yearLabel?: string;
  caption?: string;
  fileUrl?: string;
  storageBucket?: string;
  storagePath?: string;
};

export type DirectoryFilters = {
  search: string;
  gradYear: string;
  industry: string;
  location: string;
  major: string;
  mentorOnly: boolean;
};

export type GraduationTerm = "spring" | "summer" | "fall" | "winter";
export type MemberStatus = "active" | "graduating" | "alumni" | "inactive";

export type SessionRole = "admin" | "alumni" | "active";

export type SessionUser = {
  role: SessionRole;
  email: string;
  name: string;
  expiresAt: number;
};

export type MemberProfileRecord = {
  id: string;
  email: string;
  fullName: string;
  graduationYear: number;
  graduationTerm?: GraduationTerm;
  memberStatus?: MemberStatus;
  alumniAccessEnabled?: boolean;
  major: string;
  company: string;
  jobTitle: string;
  industry: string;
  location: string;
  shortBio: string;
  linkedinUrl?: string;
  phone?: string;
  willingToMentor: boolean;
  isPublic: boolean;
  emailVisibility: "private" | "members" | "public";
  phoneVisibility: "private" | "members" | "public";
  linkedinVisibility: "private" | "members" | "public";
};

export type HomePageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  missionEyebrow: string;
  missionTitle: string;
  missionDescription: string;
  valuesEyebrow: string;
  valuesTitle: string;
  valuesDescription: string;
  statsEyebrow: string;
  statsTitle: string;
  statsDescription: string;
  eventsEyebrow: string;
  eventsTitle: string;
  eventsDescription: string;
  newsletterEyebrow: string;
  newsletterTitle: string;
  newsletterDescription: string;
  spotlightEyebrow: string;
  spotlightTitle: string;
  spotlightDescription: string;
  legacyEyebrow: string;
  legacyTitle: string;
  legacyDescription: string;
  finalCtaEyebrow: string;
  finalCtaTitle: string;
  finalCtaDescription: string;
};

export type AboutPageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  overviewTitle: string;
  overviewDescription: string;
  overviewBody: string;
  overviewBodySecondary: string;
  themesTitle: string;
  themeOneTitle: string;
  themeOneDescription: string;
  themeTwoTitle: string;
  themeTwoDescription: string;
  themeThreeTitle: string;
  themeThreeDescription: string;
  timelineEyebrow: string;
  timelineTitle: string;
  timelineDescription: string;
};