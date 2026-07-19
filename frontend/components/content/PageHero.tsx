import { Container } from "@/components/Container";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-teal-700 text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" aria-hidden />
      <Container className="relative py-14 sm:py-16">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-100">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-300 sm:text-lg">{description}</p>
      </Container>
    </section>
  );
}
