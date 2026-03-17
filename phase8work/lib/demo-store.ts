import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { alumniProfiles, defaultAboutPageContent, defaultHomePageContent, events, legacyVaultItems, newsletters } from '@/lib/constants/site';
import { AdminAboutPageInput, AdminAlumniInput, AdminEventInput, AdminHomePageInput, AdminMediaInput, AdminNewsletterInput } from '@/lib/validations/admin';
import { AboutPageContent, GraduationTerm, HomePageContent, MemberStatus } from '@/types';

export type DemoAlumniRecord = {
  id: string;
  fullName: string;
  graduationYear: number;
  graduationTerm: GraduationTerm;
  memberStatus: MemberStatus;
  alumniAccessEnabled: boolean;
  major: string;
  company: string;
  jobTitle: string;
  industry: string;
  location: string;
  shortBio: string;
  linkedinUrl?: string;
  email?: string;
  phone?: string;
  willingToMentor: boolean;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
};

export type DemoEventRecord = {
  id: string;
  title: string;
  slug: string;
  eventDate: string;
  eventTime: string;
  location: string;
  audience: string;
  description: string;
  bodyContent: string;
  tags: string[];
  isFeatured: boolean;
  status: 'draft' | 'published';
  createdAt: string;
};

export type DemoNewsletterRecord = {
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
  createdAt: string;
};

export type DemoMediaRecord = {
  id: string;
  title: string;
  mediaType: 'photo' | 'document' | 'video' | 'composite';
  yearLabel?: string;
  caption?: string;
  fileUrl?: string;
  storageBucket?: string;
  storagePath?: string;
  createdAt: string;
};

export type DemoStore = {
  alumni: DemoAlumniRecord[];
  events: DemoEventRecord[];
  newsletters: DemoNewsletterRecord[];
  media: DemoMediaRecord[];
  siteContent: {
    home: HomePageContent;
    about: AboutPageContent;
  };
};

const STORE_PATH = path.join(process.cwd(), 'data', 'demo-store.json');

function isoDate(input?: string) {
  if (!input) return new Date().toISOString();
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function mapStatus(year: number): { graduationTerm: GraduationTerm; memberStatus: MemberStatus; alumniAccessEnabled: boolean } {
  const current = new Date().getFullYear();
  const alumni = year < current;
  return {
    graduationTerm: 'spring',
    memberStatus: alumni ? 'alumni' : 'active',
    alumniAccessEnabled: alumni,
  };
}

function seedStore(): DemoStore {
  return {
    alumni: alumniProfiles.map((profile) => {
      const status = mapStatus(Number(profile.gradYear));
      return {
        id: randomUUID(),
        fullName: profile.name,
        graduationYear: Number(profile.gradYear),
        graduationTerm: status.graduationTerm,
        memberStatus: status.memberStatus,
        alumniAccessEnabled: status.alumniAccessEnabled,
        major: profile.major || 'Undeclared',
        company: profile.company,
        jobTitle: profile.title,
        industry: profile.industry,
        location: profile.location,
        shortBio: profile.bio,
        linkedinUrl: profile.linkedin,
        email: `${profile.name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '')}@example.org`,
        phone: '(555) 010-2026',
        willingToMentor: profile.mentor,
        isPublic: true,
        isFeatured: Boolean(profile.featured),
        createdAt: new Date().toISOString(),
      };
    }),
    events: events.map((event) => ({
      id: randomUUID(),
      title: event.title,
      slug: event.slug,
      eventDate: isoDate(event.date),
      eventTime: event.time,
      location: event.location,
      audience: event.audience || 'Alumni and brothers',
      description: event.description,
      bodyContent: (event.body || []).join('\n\n') || event.description,
      tags: event.tags || [],
      isFeatured: Boolean(event.featured),
      status: 'published',
      createdAt: new Date().toISOString(),
    })),
    newsletters: newsletters.map((issue) => ({
      id: randomUUID(),
      title: issue.title,
      slug: issue.slug,
      category: issue.category,
      issueDate: `${issue.date}`,
      subjectLine: issue.title,
      summary: issue.excerpt,
      bodyContent: (issue.body || []).join('\n\n') || issue.excerpt,
      status: 'published',
      isFeatured: false,
      createdAt: new Date().toISOString(),
    })),
    media: legacyVaultItems.map((item) => ({
      id: item.id,
      title: item.title,
      mediaType: item.type === 'Document' ? 'document' : item.type === 'Composite' ? 'composite' : 'photo',
      yearLabel: item.era,
      caption: item.description,
      fileUrl: undefined,
      storageBucket: 'legacy-vault',
      storagePath: `${item.era}/${item.id}`,
      createdAt: new Date().toISOString(),
    })),
    siteContent: {
      home: defaultHomePageContent,
      about: defaultAboutPageContent,
    },
  };
}

async function ensureStore() {
  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(seedStore(), null, 2), 'utf8');
  }
}

export async function readDemoStore(): Promise<DemoStore> {
  await ensureStore();
  const raw = await fs.readFile(STORE_PATH, 'utf8');
  const parsed = JSON.parse(raw) as Partial<DemoStore>;
  const fallback = seedStore();
  return {
    alumni: parsed.alumni ?? fallback.alumni,
    events: parsed.events ?? fallback.events,
    newsletters: parsed.newsletters ?? fallback.newsletters,
    media: parsed.media ?? fallback.media,
    siteContent: {
      home: { ...fallback.siteContent.home, ...(parsed.siteContent?.home ?? {}) },
      about: { ...fallback.siteContent.about, ...(parsed.siteContent?.about ?? {}) },
    },
  };
}

export async function writeDemoStore(store: DemoStore) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

export async function createDemoAlumni(input: AdminAlumniInput) {
  const store = await readDemoStore();
  const record: DemoAlumniRecord = {
    id: randomUUID(),
    fullName: input.fullName,
    graduationYear: input.graduationYear,
    graduationTerm: input.graduationTerm,
    memberStatus: input.memberStatus,
    alumniAccessEnabled: input.alumniAccessEnabled,
    major: input.major,
    company: input.company,
    jobTitle: input.jobTitle,
    industry: input.industry,
    location: input.location,
    shortBio: input.shortBio,
    linkedinUrl: input.linkedinUrl || undefined,
    email: input.email || undefined,
    phone: input.phone || undefined,
    willingToMentor: input.willingToMentor,
    isPublic: input.isPublic,
    isFeatured: input.isFeatured,
    createdAt: new Date().toISOString(),
  };
  store.alumni.unshift(record);
  await writeDemoStore(store);
  return record;
}

export async function createDemoEvent(input: AdminEventInput) {
  const store = await readDemoStore();
  const record: DemoEventRecord = {
    id: randomUUID(),
    title: input.title,
    slug: input.slug,
    eventDate: input.eventDate,
    eventTime: input.eventTime,
    location: input.location,
    audience: input.audience,
    description: input.description,
    bodyContent: input.bodyContent,
    tags: input.tags ? input.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
    isFeatured: input.isFeatured,
    status: input.status,
    createdAt: new Date().toISOString(),
  };
  store.events.unshift(record);
  await writeDemoStore(store);
  return record;
}

export async function createDemoNewsletter(input: AdminNewsletterInput) {
  const store = await readDemoStore();
  const record: DemoNewsletterRecord = {
    id: randomUUID(),
    title: input.title,
    slug: input.slug,
    category: input.category,
    issueDate: input.issueDate,
    subjectLine: input.subjectLine,
    summary: input.summary,
    bodyContent: input.bodyContent,
    status: input.status,
    isFeatured: input.isFeatured,
    createdAt: new Date().toISOString(),
  };
  store.newsletters.unshift(record);
  await writeDemoStore(store);
  return record;
}

export async function createDemoMedia(input: AdminMediaInput) {
  const store = await readDemoStore();
  const record: DemoMediaRecord = {
    id: randomUUID(),
    title: input.title,
    mediaType: input.mediaType,
    yearLabel: input.yearLabel || undefined,
    caption: input.caption || undefined,
    fileUrl: input.fileUrl || undefined,
    storageBucket: input.storageBucket || undefined,
    storagePath: input.storagePath || undefined,
    createdAt: new Date().toISOString(),
  };
  store.media.unshift(record);
  await writeDemoStore(store);
  return record;
}

export async function updateDemoAlumni(id: string, input: AdminAlumniInput) {
  const store = await readDemoStore();
  const index = store.alumni.findIndex((item) => item.id === id);
  if (index === -1) return null;
  store.alumni[index] = {
    ...store.alumni[index],
    fullName: input.fullName,
    graduationYear: input.graduationYear,
    graduationTerm: input.graduationTerm,
    memberStatus: input.memberStatus,
    alumniAccessEnabled: input.alumniAccessEnabled,
    major: input.major,
    company: input.company,
    jobTitle: input.jobTitle,
    industry: input.industry,
    location: input.location,
    shortBio: input.shortBio,
    linkedinUrl: input.linkedinUrl || undefined,
    email: input.email || undefined,
    phone: input.phone || undefined,
    willingToMentor: input.willingToMentor,
    isPublic: input.isPublic,
    isFeatured: input.isFeatured,
  };
  await writeDemoStore(store);
  return store.alumni[index];
}

export async function updateDemoEvent(id: string, input: AdminEventInput) {
  const store = await readDemoStore();
  const index = store.events.findIndex((item) => item.id === id);
  if (index === -1) return null;
  store.events[index] = {
    ...store.events[index],
    title: input.title,
    slug: input.slug,
    eventDate: input.eventDate,
    eventTime: input.eventTime,
    location: input.location,
    audience: input.audience,
    description: input.description,
    bodyContent: input.bodyContent,
    tags: input.tags ? input.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
    isFeatured: input.isFeatured,
    status: input.status,
  };
  await writeDemoStore(store);
  return store.events[index];
}

export async function updateDemoNewsletter(id: string, input: AdminNewsletterInput) {
  const store = await readDemoStore();
  const index = store.newsletters.findIndex((item) => item.id === id);
  if (index === -1) return null;
  store.newsletters[index] = {
    ...store.newsletters[index],
    title: input.title,
    slug: input.slug,
    category: input.category,
    issueDate: input.issueDate,
    subjectLine: input.subjectLine,
    summary: input.summary,
    bodyContent: input.bodyContent,
    status: input.status,
    isFeatured: input.isFeatured,
  };
  await writeDemoStore(store);
  return store.newsletters[index];
}

export async function updateDemoMedia(id: string, input: AdminMediaInput) {
  const store = await readDemoStore();
  const index = store.media.findIndex((item) => item.id === id);
  if (index === -1) return null;
  store.media[index] = {
    ...store.media[index],
    title: input.title,
    mediaType: input.mediaType,
    yearLabel: input.yearLabel || undefined,
    caption: input.caption || undefined,
    fileUrl: input.fileUrl || undefined,
    storageBucket: input.storageBucket || undefined,
    storagePath: input.storagePath || undefined,
  };
  await writeDemoStore(store);
  return store.media[index];
}

export async function updateDemoHomeContent(input: AdminHomePageInput) {
  const store = await readDemoStore();
  store.siteContent.home = { ...store.siteContent.home, ...input };
  await writeDemoStore(store);
  return store.siteContent.home;
}

export async function updateDemoAboutContent(input: AdminAboutPageInput) {
  const store = await readDemoStore();
  store.siteContent.about = { ...store.siteContent.about, ...input };
  await writeDemoStore(store);
  return store.siteContent.about;
}

export async function importDemoAlumni(records: AdminAlumniInput[]) {
  const store = await readDemoStore();
  for (const input of records) {
    const email = input.email?.toLowerCase().trim();
    const existingIndex = store.alumni.findIndex((row) => (email && row.email?.toLowerCase() === email) || (!email && row.fullName === input.fullName && row.graduationYear === input.graduationYear));
    if (existingIndex >= 0) {
      store.alumni[existingIndex] = {
        ...store.alumni[existingIndex],
        fullName: input.fullName,
        graduationYear: input.graduationYear,
        graduationTerm: input.graduationTerm,
        memberStatus: input.memberStatus,
        alumniAccessEnabled: input.alumniAccessEnabled,
        major: input.major,
        company: input.company,
        jobTitle: input.jobTitle,
        industry: input.industry,
        location: input.location,
        shortBio: input.shortBio,
        linkedinUrl: input.linkedinUrl || undefined,
        email: input.email || undefined,
        phone: input.phone || undefined,
        willingToMentor: input.willingToMentor,
        isPublic: input.isPublic,
        isFeatured: input.isFeatured,
      };
    } else {
      store.alumni.unshift({
        id: randomUUID(),
        fullName: input.fullName,
        graduationYear: input.graduationYear,
        graduationTerm: input.graduationTerm,
        memberStatus: input.memberStatus,
        alumniAccessEnabled: input.alumniAccessEnabled,
        major: input.major,
        company: input.company,
        jobTitle: input.jobTitle,
        industry: input.industry,
        location: input.location,
        shortBio: input.shortBio,
        linkedinUrl: input.linkedinUrl || undefined,
        email: input.email || undefined,
        phone: input.phone || undefined,
        willingToMentor: input.willingToMentor,
        isPublic: input.isPublic,
        isFeatured: input.isFeatured,
        createdAt: new Date().toISOString(),
      });
    }
  }
  await writeDemoStore(store);
  return { count: records.length };
}

export async function deleteDemoRecord(type: keyof Omit<DemoStore, 'siteContent'>, id: string) {
  const store = await readDemoStore();
  store[type] = store[type].filter((item: { id: string }) => item.id !== id) as never;
  await writeDemoStore(store);
}
