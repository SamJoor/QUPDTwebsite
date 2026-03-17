import Link from 'next/link';
import { NewsletterIssue } from '@/types';
import { Badge } from '@/components/ui/badge';

export function NewsletterCard({ issue }: { issue: NewsletterIssue }) {
  return (
    <div className="surface p-6">
      <Badge>{issue.category}</Badge>
      <h3 className="mt-5 text-2xl">{issue.title}</h3>
      <p className="mt-2 text-sm font-medium text-fraternity-charcoal">{issue.date}</p>
      <p className="mt-4">{issue.excerpt}</p>
      <Link href={`/newsletter/${issue.slug}`} className="mt-6 inline-block text-sm font-semibold text-fraternity-burgundy hover:underline">
        Read issue
      </Link>
    </div>
  );
}
