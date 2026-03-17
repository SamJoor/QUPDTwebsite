import { Container } from '@/components/layout/container';
import { ReactNode } from 'react';

export function SectionShell({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section className="section-padding">
      <Container>
        <div className="max-w-3xl">
          {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-burgundy">{eyebrow}</p> : null}
          <h2 className="mt-3 text-3xl md:text-4xl">{title}</h2>
          {description ? <p className="mt-4 max-w-2xl text-lg">{description}</p> : null}
        </div>
        <div className="mt-10">{children}</div>
      </Container>
    </section>
  );
}
