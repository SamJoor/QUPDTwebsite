import { Container } from '@/components/layout/container';
import { Badge } from '@/components/ui/badge';
import { ReactNode } from 'react';

export function PageHero({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return (
    <section className="section-padding bg-hero-glow">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <Badge>{eyebrow}</Badge>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg">{description}</p>
          {actions ? <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div> : null}
        </div>
      </Container>
    </section>
  );
}
