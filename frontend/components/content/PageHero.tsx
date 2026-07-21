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
    <section className="relative overflow-hidden bg-mint-50">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-coral-400/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute inset-0 hidden select-none sm:block" aria-hidden>
        <span className="float-shape absolute right-[18%] top-10 h-2.5 w-2.5 rotate-45 rounded-sm bg-coral-400/60" style={{ animationDelay: "0.3s" }} />
        <span className="float-shape absolute right-[8%] top-24 h-2 w-2 rounded-full bg-teal-500/60" style={{ animationDelay: "1.2s" }} />
      </div>
      <Container className="relative py-14 sm:py-16">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 shadow-sm">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-navy-950 sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">{description}</p>
      </Container>
    </section>
  );
}
