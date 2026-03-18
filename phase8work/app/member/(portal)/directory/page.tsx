import Link from 'next/link';
import { getMemberDirectoryProfiles } from '@/lib/queries/member';

export default async function MemberDirectoryPage() {
  const profiles = await getMemberDirectoryProfiles();

  return (
    <div className="space-y-6">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
          Private directory
        </p>
        <h2 className="mt-3 text-4xl">Expanded alumni contact access</h2>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          This page demonstrates the next privacy layer beyond the public directory by exposing
          fields that should only appear in authenticated alumni experiences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {profiles.map((profile) => (
          <article key={`${profile.name}-${profile.gradYear}`} className="surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl">{profile.name}</h3>
                <p className="mt-1 text-sm text-fraternity-slate">
                  Class of {profile.gradYear} · {profile.title}, {profile.company}
                </p>
              </div>

              {profile.mentor ? (
                <span className="rounded-full bg-fraternity-burgundy px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  Mentor
                </span>
              ) : null}
            </div>

            <p className="mt-4 text-sm text-fraternity-slate">{profile.bio}</p>

            <dl className="mt-5 grid gap-3 text-sm text-fraternity-charcoal sm:grid-cols-2">
              <div>
                <dt className="font-semibold">Industry</dt>
                <dd>{profile.industry}</dd>
              </div>

              <div>
                <dt className="font-semibold">Location</dt>
                <dd>{profile.location}</dd>
              </div>

              <div>
                <dt className="font-semibold">Email</dt>
                <dd>{profile.email || 'Coordinate through chapter admin'}</dd>
              </div>

              <div>
                <dt className="font-semibold">Phone</dt>
                <dd>{profile.phone || 'On request'}</dd>
              </div>

              <div>
                <dt className="font-semibold">Preferred contact</dt>
                <dd>{profile.preferredContactMethod || 'Email'}</dd>
              </div>

              <div>
                <dt className="font-semibold">Major</dt>
                <dd>{profile.major || '—'}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="font-semibold">LinkedIn</dt>
                <dd>
                  {profile.linkedin ? (
                    <Link
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-fraternity-burgundy underline underline-offset-4"
                    >
                      View LinkedIn profile
                    </Link>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}