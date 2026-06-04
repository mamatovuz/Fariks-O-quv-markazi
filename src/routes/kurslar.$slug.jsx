import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { coursesBySlug, courses } from "@/data/courses";
import { useSiteContent } from "@/hooks/use-site-content";
const Route = createFileRoute("/kurslar/$slug")({
  loader: ({ params }) => {
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const c = coursesBySlug[loaderData?.slug];
    if (!c)
      return {
        meta: [{ title: "Kurs topilmadi \xB7 FARIKS" }],
      };
    const title = `${c.title} \u2014 FARIKS o'quv markazi`;
    const desc = `${c.tagline} ${c.blurb} Davomiyligi ${c.duration}, ${c.schedule}. Narxi ${c.price}.`;
    const url = `https://fariksuz.up.railway.app/kurslar/${c.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: c.title,
            description: c.blurb,
            provider: {
              "@type": "EducationalOrganization",
              name: "FARIKS o'quv markazi",
              url: "https://fariksuz.up.railway.app",
            },
            educationalLevel: c.level,
            timeRequired: c.duration,
            offers: {
              "@type": "Offer",
              priceCurrency: "UZS",
              price: c.price,
              availability: "https://schema.org/InStock",
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: c.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  component: CoursePage,
  notFoundComponent: () => (
    <main className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <Nav />
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-32 text-center sm:px-6 md:pb-24 md:pt-40">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-4xl">Kurs topilmadi</h1>
        <p className="mt-4 text-muted-foreground">Ushbu yo'nalish mavjud emas yoki ko'chirilgan.</p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm text-paper hover:bg-ember"
        >
          Bosh sahifaga qaytish →
        </Link>
      </div>
      <Footer />
    </main>
  ),
});
function CoursePage() {
  const { slug } = Route.useLoaderData();
  const content = useSiteContent();
  const c = content.courses.find((course) => course.slug === slug);

  if (!c) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-paper text-ink">
        <Nav />
        <div className="mx-auto max-w-2xl px-5 pb-20 pt-32 text-center sm:px-6 md:pb-24 md:pt-40">
          <p className="eyebrow">404</p>
          <h1 className="mt-4 font-display text-4xl">Kurs topilmadi</h1>
          <p className="mt-4 text-muted-foreground">
            Ushbu yo'nalish mavjud emas yoki ko'chirilgan.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm text-paper hover:bg-ember"
          >
            Bosh sahifaga qaytish -&gt;
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const others = content.courses.filter((x) => x.slug !== c.slug).slice(0, 3);
  return (
    <main className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <Nav />

      {/* Hero */}
      <section className="bg-paper pt-28 sm:pt-32 md:pt-40">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 md:px-10">
          <div className="eyebrow">
            <Link to="/" className="hover:text-ember">
              Bosh sahifa
            </Link>{" "}
            / Yo'nalish № {c.no}
          </div>
          <div className="mt-8 grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-8">
              <h1
                className="font-display text-[clamp(2.25rem,6vw,5rem)] leading-[0.95] tracking-[-0.02em] text-ink"
                style={{ fontWeight: 400 }}
              >
                {c.title}
                <span className="text-ember">.</span>
              </h1>
              <p className="mt-6 max-w-2xl font-display text-2xl italic leading-snug text-ink/75 md:text-3xl">
                {c.tagline}
              </p>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {c.blurb}
              </p>
            </div>

            <aside className="col-span-12 md:col-span-4">
              <div className="rounded-md border border-rule bg-card p-6 md:p-8">
                <div className="eyebrow">Narxi</div>
                <div className="mt-2 font-display text-4xl text-ink" style={{ fontWeight: 500 }}>
                  {c.price}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{c.priceNote}</p>
                <a
                  href="/#aloqa"
                  className="mt-6 inline-flex w-full items-center justify-between rounded-full bg-ink px-6 py-3.5 text-sm text-paper hover:bg-ember"
                >
                  Bepul sinov darsi
                  <span aria-hidden>→</span>
                </a>
              </div>
            </aside>
          </div>

          {/* Meta strip */}
          <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-rule bg-rule sm:grid-cols-2 md:mt-16 md:grid-cols-4">
            <Meta label="Davomiyligi" value={c.duration} />
            <Meta label="Daraja" value={c.level} />
            <Meta label="Jadval" value={c.schedule} />
            <Meta label="Guruh" value={c.groupSize} />
          </dl>
        </div>
      </section>

      {/* Program */}
      <section className="bg-paper py-20 md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 md:px-10">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-4">
              <div className="eyebrow">Dastur</div>
              <h2
                className="mt-6 font-display text-4xl leading-[0.95] tracking-[-0.02em] text-ink md:text-5xl"
                style={{ fontWeight: 400 }}
              >
                Qadam-baqadam{" "}
                <em className="italic" style={{ fontWeight: 300 }}>
                  jadval
                </em>
                .
              </h2>
            </div>
            <ol className="col-span-12 md:col-span-8">
              {c.program.map((p, i) => (
                <li
                  key={i}
                  className={`grid grid-cols-12 gap-4 py-7 md:gap-6 md:py-8 ${i === 0 ? "border-y" : "border-b"} border-rule`}
                >
                  <div className="col-span-12 md:col-span-3">
                    <div className="font-display text-sm text-ember">{p.week}</div>
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <h3 className="font-display text-2xl text-ink" style={{ fontWeight: 500 }}>
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Outcomes */}
          <div className="mt-20 grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-4">
              <div className="eyebrow">Natija</div>
              <h2
                className="mt-6 font-display text-3xl leading-tight text-ink md:text-4xl"
                style={{ fontWeight: 400 }}
              >
                Kursdan keyin —{" "}
                <em className="italic" style={{ fontWeight: 300 }}>
                  nima qila olasiz
                </em>
                .
              </h2>
            </div>
            <ul className="col-span-12 md:col-span-8 md:pt-4">
              {c.outcomes.map((o, i) => (
                <li
                  key={i}
                  className="flex gap-4 border-b border-rule py-5 text-base text-ink/85 sm:text-lg"
                >
                  <span className="font-display text-ember">{String(i + 1).padStart(2, "0")}</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-ink py-20 text-paper md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 md:px-10">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-paper/60">
                Savol-javob
              </div>
              <h2
                className="mt-6 font-display text-4xl leading-[0.95] text-paper md:text-5xl"
                style={{ fontWeight: 400 }}
              >
                Tez-tez{" "}
                <em className="italic" style={{ fontWeight: 300 }}>
                  so'ralayotgan
                </em>
                .
              </h2>
            </div>
            <div className="col-span-12 md:col-span-8">
              {c.faqs.map((f, i) => (
                <details key={i} className="group border-b border-paper/15 py-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 sm:gap-6">
                    <span className="font-display text-xl text-paper md:text-2xl">{f.q}</span>
                    <span className="mt-1 font-display text-2xl text-ember transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-paper/70">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Other courses */}
      <section className="bg-paper py-20 md:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 md:px-10">
          <div className="eyebrow">Boshqa yo'nalishlar</div>
          <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  to="/kurslar/$slug"
                  params={{ slug: o.slug }}
                  className="group block border-t border-ink pt-6 transition-colors hover:text-ember"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-sm text-ember">{o.no}</span>
                    <span className="font-display text-xl text-ink transition-colors group-hover:text-ember">
                      →
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl text-ink" style={{ fontWeight: 500 }}>
                    {o.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">{o.tagline}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
function Meta({ label, value }) {
  return (
    <div className="bg-paper p-5 md:p-6">
      <div className="eyebrow">{label}</div>
      <div
        className="mt-2 font-display text-lg leading-snug text-ink md:text-xl"
        style={{ fontWeight: 500 }}
      >
        {value}
      </div>
    </div>
  );
}
export { Route };
