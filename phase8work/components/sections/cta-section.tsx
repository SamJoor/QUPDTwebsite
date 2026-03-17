import { ReactNode } from 'react';
import { Container } from '@/components/layout/container';

export function CTASection({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions: ReactNode }) {
  return (
    <section className="section-padding pt-0">
      <Container>
        <div className="surface grid gap-6 bg-fraternity-charcoal p-8 text-white md:grid-cols-[1.4fr_1fr] md:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-gold">{eyebrow}</p>
            <h2 className="mt-3 text-3xl text-white md:text-4xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-base text-white/80 md:text-lg">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:justify-end">{actions}</div>
        </div>
      </Container>
    </section>
  );
}
