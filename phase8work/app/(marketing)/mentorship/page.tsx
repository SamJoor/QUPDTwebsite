import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { alumniProfiles } from '@/lib/constants/site';
import { ProfileCard } from '@/components/cards/profile-card';
import { MentorSignupForm } from '@/components/forms/mentor-signup-form';
import { MenteeRequestForm } from '@/components/forms/mentee-request-form';

export default function MentorshipPage() {
  const mentors = alumniProfiles.filter((profile) => profile.mentor);

  return (
    <>
      <PageHero
        eyebrow="Mentorship"
        title="Connect alumni experience with the next generation of brothers"
        description="This page includes real mentor and mentee intake forms that already post to validated API routes, making it one of the more immediately useful pieces of the MVP."
      />
      <SectionShell title="Mentor spotlights" description="Highlight willing alumni so the program feels active and credible from the first launch.">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {mentors.map((profile) => (
            <ProfileCard key={profile.name} profile={profile} />
          ))}
        </div>
      </SectionShell>
      <SectionShell eyebrow="Program intake" title="Launch with manual matching, not unnecessary complexity" description="Collect structured submissions first. Then let officers review and pair alumni with students manually while the program proves itself.">
        <div className="grid gap-6 lg:grid-cols-2">
          <MentorSignupForm />
          <MenteeRequestForm />
        </div>
      </SectionShell>
    </>
  );
}
