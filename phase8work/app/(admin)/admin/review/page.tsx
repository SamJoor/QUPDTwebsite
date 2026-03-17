import { createServerSupabaseClient, hasSupabaseServerAccess } from '@/lib/supabase/server';
import { readDemoStore } from '@/lib/demo-store';

async function getReviewQueue() {
  const supabase = createServerSupabaseClient();

  if (!supabase || !hasSupabaseServerAccess()) {
    const store = await readDemoStore();
    return {
      mode: 'demo',
      items: [
        { label: 'Newsletter subscribers', value: String(store.alumni.length), detail: 'Demo approximation until Supabase subscriber records are connected.' },
        { label: 'Contact submissions', value: '0', detail: 'Public contact form submissions appear here once Supabase is connected.' },
        { label: 'Profile update requests', value: '0', detail: 'Member profile requests will route here once Supabase is connected.' },
        { label: 'Mentor applications', value: '0', detail: 'Mentorship submissions are ready for review routing.' },
      ],
    };
  }

  const [subs, contacts, profileUpdates, mentors, mentees] = await Promise.all([
    supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('inquiry_type', 'profile_update_request'),
    supabase.from('mentors').select('*', { count: 'exact', head: true }),
    supabase.from('mentee_requests').select('*', { count: 'exact', head: true }),
  ]);

  return {
    mode: 'supabase',
    items: [
      { label: 'Active subscribers', value: String(subs.count ?? 0), detail: 'Recipients eligible for newsletter sends.' },
      { label: 'Contact submissions', value: String(contacts.count ?? 0), detail: 'General inbound inquiries and volunteer interest.' },
      { label: 'Profile update requests', value: String(profileUpdates.count ?? 0), detail: 'Requests submitted from the member area.' },
      { label: 'Mentor applications', value: String(mentors.count ?? 0), detail: 'Alumni volunteer forms waiting for program review.' },
      { label: 'Mentee requests', value: String(mentees.count ?? 0), detail: 'Student matching requests ready for outreach.' },
    ],
  };
}

export default async function ReviewQueuePage() {
  const queue = await getReviewQueue();

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Admin module</p>
        <h1 className="mt-3 text-4xl">Review queue</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">This page centralizes the operational side of the chapter website: inbound requests, active subscriber counts, and the forms that officers need to process on a recurring basis.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {queue.items.map((item) => (
          <div key={item.label} className="surface p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-burgundy/80">{item.label}</p>
            <p className="mt-4 text-4xl font-semibold text-fraternity-charcoal">{item.value}</p>
            <p className="mt-3 text-sm text-fraternity-slate">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="surface p-8">
        <h2 className="text-2xl">Workflow notes</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="font-semibold text-fraternity-charcoal">Newsletter ops</p>
            <p className="mt-2 text-sm text-fraternity-slate">Draft the issue in the newsletters module, publish it, then send it from the new send controls. In preview mode it will still mark the workflow without contacting subscribers.</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="font-semibold text-fraternity-charcoal">Member servicing</p>
            <p className="mt-2 text-sm text-fraternity-slate">Alumni can now submit profile update requests from the protected member area. Those requests are stored as contact submissions with a dedicated inquiry type so officers can process them consistently.</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-fraternity-slate">Data source: <span className="font-semibold text-fraternity-charcoal">{queue.mode}</span></p>
      </div>
    </div>
  );
}
