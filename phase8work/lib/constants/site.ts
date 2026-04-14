import { AboutPageContent, AlumniProfile, EventItem, HomePageContent, LegacyVaultItem, NavItem, NewsletterIssue, Spotlight, Stat, TimelineEntry } from '@/types';

export const siteConfig = {
  name: 'Phi Delta Theta',
  chapter: 'Alumni Network',
  description:
    'A modern digital home for alumni, active brothers, and supporters of Phi Delta Theta — built to preserve legacy, strengthen lifelong brotherhood, and keep the chapter connected for years to come.'
};

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Alumni', href: '/alumni' },
  { label: 'Events', href: '/events' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Mentorship', href: '/mentorship' },
  { label: 'Legacy Vault', href: '/legacy-vault' },
  { label: 'Contact', href: '/contact' }
];

export const chapterStats: Stat[] = [
  { value: 'SOON', label: 'Connected Alumni', description: 'A growing network of brothers, supporters, and chapter friends.' },
  { value: 'SOON', label: 'Mentors & Volunteers', description: 'Alumni already positioned to help with guidance and opportunity.' },
  { value: '~2', label: 'Annual Signature Events', description: 'Recurring touchpoints designed to keep the chapter active year-round.' },
  { value: '.5', label: 'Years of Chapter History', description: 'A legacy worth preserving in a more permanent digital home.' }
];

export const values = [
  {
    title: 'Brotherhood for Life',
    description: 'Create a lifelong connection between alumni and active brothers grounded in trust, pride, and shared experience.'
  },
  {
    title: 'Leadership & Service',
    description: 'Highlight the professional, civic, and philanthropic impact of Phi Delta Theta beyond graduation.'
  },
  {
    title: 'Legacy Preservation',
    description: 'Document chapter milestones, stories, photos, traditions, and memories so they remain accessible for future generations.'
  }
];

export const events: EventItem[] = [
  {
    slug: 'founders-day-banquet',
    title: 'Founders Day Banquet',
    date: 'April 18, 2026',
    time: '6:30 PM',
    location: 'New Haven Lawn Club',
    audience: 'Alumni, active brothers, families, and chapter friends',
    description:
      'Join alumni, active brothers, and supporters for an evening honoring chapter legacy, celebrating accomplishments, and welcoming the next era of lifelong brotherhood.',
    featured: true,
    imageHint: 'Formal banquet, chapter traditions, annual recognition',
    tags: ['Founders Day', 'Tradition', 'Flagship Event'],
    schedule: [
      { time: '6:00 PM', label: 'Reception and alumni check-in' },
      { time: '6:45 PM', label: 'Dinner service begins' },
      { time: '7:30 PM', label: 'Chapter updates and alumni recognition' },
      { time: '8:15 PM', label: 'Brotherhood toast and closing remarks' }
    ],
    body: [
      'Founders Day should feel like the chapter’s signature evening — formal enough to honor tradition, but warm enough to welcome brothers from every era back into the room.',
      'This page structure is already set up to support event detail copy, schedule sections, RSVP collection, and future gallery additions after the event concludes.',
      'Once Supabase is connected, the same model can support real attendee lists, reminder emails, capacity controls, and post-event photo uploads.'
    ]
  },
  {
    slug: 'career-night',
    title: 'Alumni Career Night',
    date: 'May 5, 2026',
    time: '7:00 PM',
    location: 'Chapter House & Zoom',
    audience: 'Active brothers and early-career alumni',
    description: 'A networking and career conversation evening connecting students with alumni across finance, tech, consulting, law, and entrepreneurship.',
    imageHint: 'Networking, mentorship, professional guidance',
    tags: ['Career', 'Mentorship', 'Hybrid'],
    body: [
      'Career Night is one of the easiest ways to turn alumni goodwill into direct student impact.',
      'This event structure works well for panel discussions, office hours, resume review sessions, or industry-specific breakouts.'
    ]
  },
  {
    slug: 'golf-outing',
    title: 'Summer Golf Outing',
    date: 'June 21, 2026',
    time: '11:00 AM',
    location: 'Farmington Woods',
    audience: 'Alumni and chapter supporters',
    description: 'A relaxed alumni summer gathering centered around fellowship, fundraising, and chapter support.',
    imageHint: 'Golf, summer, alumni gathering',
    tags: ['Summer', 'Fundraising', 'Social'],
    body: [
      'The summer golf outing gives alumni a lower-pressure reason to stay involved while still supporting chapter initiatives.',
      'This page can later support sponsor recognition, foursome registration, and donor acknowledgments.'
    ]
  },
  {
    slug: 'alumni-brotherhood-game',
    title: 'Alumni vs Active Brotherhood Game',
    date: 'September 12, 2026',
    time: '2:00 PM',
    location: 'Campus Recreation Center',
    audience: 'Alumni and active brothers',
    description: 'A spirited annual matchup followed by dinner, chapter updates, and a photo night.',
    imageHint: 'Athletics, tradition, alumni return weekend',
    tags: ['Tradition', 'Brotherhood', 'Campus'],
    body: [
      'Events like this keep the alumni relationship from becoming purely formal or administrative.',
      'It is also a strong candidate for recurring media galleries and short-form recap content afterward.'
    ]
  }
];

export const featuredEvent = events[0];

export const alumniProfiles: AlumniProfile[] = [
  {
    name: 'Michael Harrington',
    gradYear: '2014',
    company: 'Goldman Sachs',
    title: 'Vice President',
    industry: 'Finance',
    location: 'New York, NY',
    bio: 'Helps young alumni navigate early career decisions and recruiting. Passionate about mentorship and chapter continuity.',
    mentor: true,
    major: 'Economics',
    linkedin: 'https://www.linkedin.com/',
    interests: ['Recruiting', 'Mentorship', 'Capital Markets'],
    featured: true
  },
  {
    name: 'Daniel Russo',
    gradYear: '2018',
    company: 'HubSpot',
    title: 'Product Manager',
    industry: 'Technology',
    location: 'Boston, MA',
    bio: 'Focused on product strategy and growth. Enjoys advising students on internships, communication, and career pivots.',
    mentor: true,
    major: 'Computer Science',
    linkedin: 'https://www.linkedin.com/',
    interests: ['Product', 'Startups', 'Internships']
  },
  {
    name: 'Anthony Morales',
    gradYear: '2011',
    company: 'Yale New Haven Health',
    title: 'Operations Director',
    industry: 'Healthcare',
    location: 'New Haven, CT',
    bio: 'Supports alumni engagement and encourages brothers to build careers around service, excellence, and integrity.',
    mentor: false,
    major: 'Management',
    interests: ['Healthcare', 'Operations', 'Service']
  },
  {
    name: 'Brian Keller',
    gradYear: '2007',
    company: 'PwC',
    title: 'Senior Manager',
    industry: 'Consulting',
    location: 'Chicago, IL',
    bio: 'Longtime chapter volunteer who enjoys speaking on leadership, professional development, and life after college.',
    mentor: true,
    major: 'Accounting',
    interests: ['Consulting', 'Leadership', 'Professional Development']
  },
  {
    name: 'Sean Whitaker',
    gradYear: '2019',
    company: 'IBM',
    title: 'Solutions Architect',
    industry: 'Technology',
    location: 'Austin, TX',
    bio: 'Works at the intersection of enterprise software and client strategy. Loves helping brothers break into technical business roles.',
    mentor: true,
    major: 'Information Systems',
    interests: ['Cloud', 'Client Strategy', 'Career Switching']
  },
  {
    name: 'Nicholas Barber',
    gradYear: '2016',
    company: 'State of Connecticut',
    title: 'Assistant Attorney General',
    industry: 'Legal',
    location: 'Hartford, CT',
    bio: 'Encourages brothers interested in law, public service, and mission-driven careers.',
    mentor: false,
    major: 'Political Science',
    interests: ['Law', 'Public Service', 'Civic Leadership']
  }
];

export const newsletters: NewsletterIssue[] = [
  {
    slug: 'spring-2026-brotherhood-update',
    title: 'Spring 2026 Brotherhood Update',
    date: 'March 2026',
    excerpt: 'A look at chapter achievements, alumni news, service highlights, and the events shaping this semester.',
    category: 'Chapter Update',
    body: [
      'This issue format is already structured like a real archive page, not a placeholder headline alone.',
      'You can replace these paragraphs with actual chapter updates, academic achievements, alumni stories, and event recaps.',
      'Once an email provider is connected, this same content can power both the web archive and the outgoing newsletter.'
    ]
  },
  {
    slug: 'winter-2025-year-in-review',
    title: 'Winter 2025 Year in Review',
    date: 'December 2025',
    excerpt: 'Celebrating a year of alumni connection, chapter growth, and meaningful brotherhood milestones.',
    category: 'Year in Review',
    body: [
      'Year-in-review issues are ideal for summarizing chapter momentum and creating a ritual alumni expect.',
      'This archive structure can also support featured images, linked announcements, and spotlight callouts.'
    ]
  },
  {
    slug: 'fall-2025-founders-letter',
    title: 'Fall 2025 Founders Letter',
    date: 'October 2025',
    excerpt: 'A reflection on tradition, chapter continuity, and the role alumni play in strengthening the future.',
    category: 'Founders Day',
    body: [
      'Letters like this help the site feel official, intentional, and stewarded rather than casually maintained.',
      'They are also a strong fit for officer updates and alumni-chair communications.'
    ]
  }
];

export const alumniSpotlight: Spotlight = {
  name: 'Ben Berube',
  role: 'OG Pres',
  quote: 'https://www.pinterest.com/pin/original-image--813251645231601330/',
  story:
    'We will miss you Ben'
};

export const timeline: TimelineEntry[] = [
  {
    year: '2025',
    title: 'Chapter Founded',
    description: ''
  },
  {
    year: '3025',
    title: 'First Alumni Event',
    description: 'Promised to us 1000 years ago'
  },
  {
    year: '4000',
    title: 'idk',
    description: ''
  },
  {
    year: '5000',
    title: 'etc. etc. we get the point atp',
    description: ' '
  }
];

export const legacyVaultItems: LegacyVaultItem[] = [
  {
    id: '1',
    title: 'Composite Board',
    era: '300BC',
    type: 'Composite',
    description: ''
  },
  {
    id: '2',
    title: 'Letter from President',
    era: '2025',
    type: 'Document',
    description: 'https://www.pinterest.com/pin/original-image--813251645231601330/'
  },
  {
    id: '3',
    title: 'Reunion Weekend Photo Collection',
    era: '2010s',
    type: 'Photo',
    description: 'Images from a major return weekend showing intergenerational alumni connection.'
  },
  {
    id: '4',
    title: 'Brotherhood Memory Submission',
    era: '2000s',
    type: 'Story',
    description: 'A contributed memory that adds emotional depth and context to the chapter archive.'
  }
];


export const defaultHomePageContent: HomePageContent = {
  heroEyebrow: 'Phi Delta Theta Alumni Network',
  heroTitle: 'Brotherhood That Endures Beyond Graduation',
  heroDescription: 'A digital home built to strengthen alumni connection, and create meaningful opportunities for mentorship, events, and lifelong engagement.',
  missionEyebrow: 'Our Purpose',
  missionTitle: 'A modern home for lifelong brotherhood',
  missionDescription: 'When brothers graduate, they don’t stop being part of the chapter. This site is designed to keep every brother connected, informed, and involved for years to come.',
  valuesEyebrow: 'Values',
  valuesTitle: 'The principles that should shape every section of the site',
  valuesDescription: 'The visual style may feel modern, but the site should still communicate fraternity tradition, chapter pride, and service-minded leadership.',
  statsEyebrow: 'At a Glance',
  statsTitle: 'The chapter, measured in connection and continuity',
  statsDescription: 'A premium alumni site should communicate substance right away: history, engagement, and opportunities to stay involved.',
  eventsEyebrow: 'Featured Event',
  eventsTitle: 'Gatherings that keep the brotherhood active',
  eventsDescription: 'From formal banquets to networking nights and reunions, events should be easy to discover and feel worth attending.',
  newsletterEyebrow: 'Latest Communication',
  newsletterTitle: 'Chapter updates that keep alumni informed',
  newsletterDescription: 'The newsletter experience should feel polished and official, with clear archives and simple signup for ongoing communication.',
  spotlightEyebrow: 'Featured Story',
  spotlightTitle: 'Celebrate the brothers shaping life beyond the chapter',
  spotlightDescription: 'Alumni stories help future graduates see what this network can become and remind returning brothers why staying connected matters.',
  legacyEyebrow: 'Legacy Vault',
  legacyTitle: 'Preserve the chapter memory with care',
  legacyDescription: 'Build a digital archive for composite boards, reunion photos, letters, milestone documents, and stories that deserve to outlast any one generation.',
  finalCtaEyebrow: 'Get involved',
  finalCtaTitle: 'Help shape the next era of the chapter',
  finalCtaDescription: 'Encourage alumni to update their information, mentor active brothers, attend events, and contribute memories that strengthen the chapter over time.'
};

export const defaultAboutPageContent: AboutPageContent = {
  heroEyebrow: 'About the Chapter',
  heroTitle: 'A chapter built on tradition, service, and connection',
  heroDescription: 'This pages function is to tell a bit about our chapter. Im lazy and dont feel like writing it right now',
  overviewTitle: 'Chapter overview',
  overviewDescription: '',
  overviewBody: '',
  overviewBodySecondary: ' ',
  themesTitle: 'Core themes to emphasize',
  themeOneTitle: 'Founding identity',
  themeOneDescription: '',
  themeTwoTitle: 'Traditions',
  themeTwoDescription: 'Rituals, annual moments, and shared experiences that brothers still remember.',
  themeThreeTitle: 'Legacy',
  themeThreeDescription: 'The chapter’s impact on leadership, service, career development, and lifelong connection.',
  timelineEyebrow: 'Timeline',
  timelineTitle: 'Major moments in chapter history',
  timelineDescription: 'Use this format to preserve institutional memory in a way future officers can actually maintain.'
};
