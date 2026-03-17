import { redirect } from 'next/navigation';
import { MemberProfileForm } from '@/components/forms/member-profile-form';
import { getCurrentMemberProfile } from '@/lib/queries/member';

export default async function MemberProfilePage() {
  const profile = await getCurrentMemberProfile();
  if (!profile) redirect('/member/claim');

  return <MemberProfileForm profile={profile} />;
}
