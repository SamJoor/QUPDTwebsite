import Link from 'next/link';
import { AlumniProfile } from '@/types';
import { Badge } from '@/components/ui/badge';

export function ProfileCard({ profile }: { profile: AlumniProfile }) {
  return (
    <div className="surface flex h-full flex-col p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-2xl">{profile.name}</h3>
        <Badge>Class of {profile.gradYear}</Badge>
        {profile.mentor ? <Badge className="bg-fraternity-burgundy text-white">Mentor</Badge> : null}
        {profile.featured ? <Badge className="bg-fraternity-gold/20 text-fraternity-charcoal">Featured</Badge> : null}
      </div>
      <p className="mt-3 text-sm font-medium text-fraternity-charcoal">{profile.title} · {profile.company}</p>
      <p className="mt-1 text-sm">{profile.industry} · {profile.location}</p>
      {profile.major ? <p className="mt-1 text-sm text-fraternity-slate">Major: {profile.major}</p> : null}
      <p className="mt-4 flex-1">{profile.bio}</p>
      {profile.interests?.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <Badge key={interest} className="bg-fraternity-parchment text-fraternity-charcoal">{interest}</Badge>
          ))}
        </div>
      ) : null}
      {profile.linkedin ? (
        <div className="mt-5">
          <Link href={profile.linkedin} target="_blank" className="text-sm font-semibold text-fraternity-burgundy hover:underline">
            View LinkedIn
          </Link>
        </div>
      ) : null}
    </div>
  );
}
